// js/gameLogic.js

/**
 * @fileoverview Implements the core game logic for EduQuest.
 * This module handles player progression (XP, leveling, gold), quest management (completion, rewards),
 * shop interactions (purchasing items), skill tree progression, and overall game state updates.
 * It interacts with dataManager for persistence and uiManager for rendering updates.
 */

import { GAME_CONSTANTS } from './constants.js';
import { getPlayerData, updatePlayerData, getQuests, updateQuests, getInventory, updateInventory, getSettings, updateSettings, getSkillData, updateSkillData, resetGameData, saveShopRefreshTimestamp, loadShopRefreshTimestamp } from './dataManager.js';
import { showNotification, updatePlayerSummary, updateDashboardView, renderQuestList, renderShop, renderCalendar, renderSkillTreeDiagram, renderSettings, startOnboardingTour, showView } from './uiManager.js'; // Import UI update functions
import { getShopItemById } from './shopItems.js';
import { getSkillTreeBySubject, getSkillNodeById } from './skills.js';
import { checkCompletionCondition, generateDailyMathProblems } from './battles.js';

// --- Initialization and Core Loops ---

/**
 * Initializes game logic by setting up intervals and applying initial settings.
 */
export function initializeGameLogic() {
    console.log('Initializing game logic...');
    applyCurrentTheme(); // Apply the theme loaded from settings on startup
    checkAndApplyDarkMode(); // Apply dark mode if enabled
    startFocusRegenLoop(); // Start the focus regeneration loop
    checkDailyResets(); // Check for daily quest and shop resets

    // Attach event listeners for quest completion buttons (Delegation is better for dynamic elements)
    document.getElementById('quest-list').addEventListener('click', (event) => {
        if (event.target.classList.contains('complete-quest-btn')) {
            const questId = event.target.dataset.questId;
            // Dummy progress for now, in a real app this would come from a quiz/task completion
            const currentProgress = 1; // Assuming 1 means full completion for simpler quests
            completeQuest(questId, currentProgress);
        }
    });

    document.getElementById('shop-avatar-gear').addEventListener('click', handleShopButtonClick);
    document.getElementById('shop-power-ups').addEventListener('click', handleShopButtonClick);
    document.getElementById('shop-decorations').addEventListener('click', handleShopButtonClick);
    document.getElementById('shop-blueprints').addEventListener('click', handleShopButtonClick);
    document.getElementById('shop-limited-offers').addEventListener('click', handleShopButtonClick);

    document.getElementById('respec-skills-btn').addEventListener('click', respecSkills);

    // Initial UI updates after everything is loaded
    updatePlayerSummary();
    updateDashboardView();
    // showView('dashboard'); // This is handled by onboarding
    // The onboarding tour will decide the initial view
}

/**
 * Applies the currently selected theme from settings.
 */
export function applyCurrentTheme(themeId = getSettings().currentTheme) {
    const selectedTheme = THEMES.find(t => t.id === themeId);
    if (!selectedTheme) {
        console.warn(`Theme with ID ${themeId} not found.`);
        return;
    }

    const currentSettings = getSettings();
    const previousThemeId = currentSettings.currentTheme;
    const previousTheme = THEMES.find(t => t.id === previousThemeId);

    const DOMElements = {
        appContainer: document.getElementById('app-container'),
        sidebar: document.getElementById('sidebar'),
        playerSummary: document.getElementById('player-summary'),
        avatarDisplay: document.getElementById('avatar-display'),
        navButtonActive: document.querySelector('.nav-button.active'), // Get the currently active nav button
        viewBackground: document.getElementById('dashboard-view'), // Use dashboard as a general example for view backgrounds
        dashboardCardBlue: document.querySelector('#dashboard-view .bg-blue-100'), // Example, will need to target dynamically
        dashboardCardYellow: document.querySelector('#dashboard-view .bg-yellow-100'),
        dashboardCardGreen: document.querySelector('#dashboard-view .bg-green-100'),
        dashboardCardPurple: document.querySelector('#dashboard-view .bg-purple-100'),
        dashboardCardIndigo: document.querySelector('#dashboard-view .bg-indigo-100'),
        dashboardCardRed: document.querySelector('#dashboard-view .bg-red-100'),
        shopItemCard: document.querySelector('#shop-view .shop-item-card'), // Example
        calendarDay: document.querySelector('#calendar-grid .calendar-day'), // Example
        calendarDayCurrentMonth: document.querySelector('#calendar-grid .calendar-day.current-month'), // Example
        skillNode: document.querySelector('#skill-tree-diagram .skill-node'), // Example
        skillNodeUnlocked: document.querySelector('#skill-tree-diagram .skill-node.unlocked'), // Example
        skillNodeActive: document.querySelector('#skill-tree-diagram .skill-node.active-skill'), // Example
    };

    // Remove old theme classes
    if (previousTheme) {
        for (const key in previousTheme.cssClasses) {
            const element = DOMElements[key] || (key === 'body' ? document.body : null);
            if (element) {
                element.classList.remove(...previousTheme.cssClasses[key].split(' ').filter(cls => cls));
            }
        }
    }

    // Add new theme classes
    for (const key in selectedTheme.cssClasses) {
        const element = DOMElements[key] || (key === 'body' ? document.body : null);
        if (element) {
            // Special handling for appContainer gradient - replace
            if (key === 'appContainer') {
                element.classList.forEach(cls => {
                    if (cls.startsWith('from-') || cls.startsWith('to-') || cls.startsWith('bg-gradient-')) {
                        element.classList.remove(cls);
                    }
                });
            }
            element.classList.add(...selectedTheme.cssClasses[key].split(' ').filter(cls => cls));
        }
    }

    // Update settings only after successful application
    updateSettings({ currentTheme: themeId });
    checkAndApplyDarkMode(); // Re-apply dark mode to ensure it layers correctly
}

/**
 * Checks dark mode setting and applies/removes the 'dark-mode' class to the body.
 */
function checkAndApplyDarkMode() {
    const settings = getSettings();
    if (settings.darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}


/**
 * Handles clicks on shop buttons to purchase items.
 * @param {Event} event - The click event.
 */
function handleShopButtonClick(event) {
    const button = event.target.closest('button'); // Use closest to get the button even if a child is clicked
    if (!button || button.disabled) return;

    const itemId = button.dataset.itemId;
    if (itemId) {
        purchaseItem(itemId);
    }
}

// --- Player Progression ---

/**
 * Adds XP to the player and potentially levels them up.
 * @param {number} amount - The amount of XP to add.
 * @param {string} subject - The subject related to the XP gain.
 */
export function addXP(amount, subject = null) {
    let playerData = getPlayerData();
    let currentXP = playerData.xp + amount;
    let currentLevel = playerData.level;
    let skillPointsGained = 0;

    // Apply XP boost from active skills or power-ups (future expansion)
    // For now, simple direct addition

    // Check for level up
    while (currentXP >= (GAME_CONSTANTS.XP_PER_LEVEL[currentLevel] || Infinity)) {
        if (GAME_CONSTANTS.XP_PER_LEVEL[currentLevel] === undefined) {
            // Player reached max level, stop XP accumulation beyond current level
            currentXP = GAME_CONSTANTS.XP_PER_LEVEL[currentLevel -1] || currentXP; // Cap XP at max level if desired
            break;
        }
        currentXP -= GAME_CONSTANTS.XP_PER_LEVEL[currentLevel];
        currentLevel++;
        skillPointsGained += GAME_CONSTANTS.SKILL_POINTS_PER_LEVEL;
        showNotification(`LEVEL UP! You are now Level ${currentLevel}!`, 'success');
    }

    // Update player data
    const updatedPlayerData = {
        ...playerData,
        xp: currentXP,
        level: currentLevel,
        gold: playerData.gold + Math.floor(amount / 5), // Small gold reward for XP gain
    };

    // Update subject XP if applicable
    if (subject && playerData.subjects[subject]) {
        updatedPlayerData.subjects = {
            ...playerData.subjects,
            [subject]: {
                xp: playerData.subjects[subject].xp + amount,
                // Subject level up logic could go here too, similar to player level
                level: playerData.subjects[subject].level, // Placeholder
            }
        };
    }
    updatePlayerData(updatedPlayerData);

    // Update skill points
    if (skillPointsGained > 0) {
        const skillData = getSkillData();
        updateSkillData({
            points: skillData.points + skillPointsGained,
        });
        showNotification(`Gained ${skillPointsGained} Skill Point(s)!`, 'info');
    }

    updatePlayerSummary();
    updateDashboardView(); // Refresh dashboard to show new XP/level
}

/**
 * Adds gold to the player.
 * @param {number} amount - The amount of gold to add.
 */
export function addGold(amount) {
    const playerData = getPlayerData();
    updatePlayerData({ gold: playerData.gold + amount });
    updatePlayerSummary();
    updateDashboardView();
}

/**
 * Adds an achievement to the player's profile.
 * @param {string} achievementId - The ID of the achievement earned.
 * @param {string} achievementName - The display name of the achievement.
 */
export function addAchievement(achievementId, achievementName) {
    const playerData = getPlayerData();
    if (!playerData.achievements.includes(achievementId)) {
        updatePlayerData({ achievements: [...playerData.achievements, achievementId] });
        showNotification(`Achievement Unlocked: "${achievementName}"!`, 'success');
        updateDashboardView(); // To update the achievements list
    }
}

// --- Quest Management ---

/**
 * Completes a quest and grants rewards.
 * @param {string} questId - The ID of the quest to complete.
 * @param {*} currentProgress - The current progress value against the quest's completion condition.
 */
export function completeQuest(questId, currentProgress = 1) { // Default progress to 1 for simple completion
    let quests = getQuests();
    const questIndex = quests.findIndex(q => q.id === questId);

    if (questIndex === -1) {
        showNotification('Quest not found.', 'error');
        return;
    }

    const quest = quests[questIndex];

    if (quest.isCompleted) {
        showNotification(`Quest "${quest.title}" is already completed.`, 'info');
        return;
    }

    // Update quest progress first
    quest.progress = currentProgress;

    // Check if completion condition is met using the battle module's helper
    const isConditionMet = checkCompletionCondition(quest.completionCondition, getPlayerData(), currentProgress);

    if (!isConditionMet) {
        showNotification(`Quest "${quest.title}" not yet complete. Current progress: ${quest.progress}/${quest.targetProgress}`, 'warning');
        updateQuests(quests); // Save updated progress
        renderQuestList(); // Re-render quest list
        updateDashboardView();
        return;
    }

    // Mark quest as completed
    quest.isCompleted = true;
    quest.dateCompleted = new Date().toISOString();

    // Grant rewards
    addXP(quest.xpReward, quest.subject);
    addGold(quest.goldReward);
    showNotification(`Quest "${quest.title}" Completed! Gained ${quest.xpReward} XP and ${quest.goldReward} Gold.`, 'success');

    // Handle quest chain progression
    if (quest.isChained && quest.chain) {
        const nextStage = quest.stage + 1;
        const nextQuestInChain = quests.find(q => q.chain === quest.chain && q.stage === nextStage);
        if (nextQuestInChain) {
            // Make the next quest visible/available if it's hidden
            if (nextQuestInChain.isHidden) {
                nextQuestInChain.isHidden = false;
                showNotification(`New quest unlocked: "${nextQuestInChain.title}"!`, 'info');
            }
        }
    }

    updateQuests(quests); // Save updated quests
    renderQuestList(); // Re-render quest list
    updateDashboardView();
    updatePlayerSummary(); // Ensure XP/Gold updates
}

/**
 * Updates the progress of a specific quest.
 * This is called by other parts of the game (e.g., when a quiz question is answered).
 * @param {string} questId - The ID of the quest to update.
 * @param {number} progressIncrement - The amount to increment the progress by.
 * @param {boolean} checkCompletionNow - If true, immediately check and complete the quest if conditions are met.
 */
export function updateQuestProgress(questId, progressIncrement = 1, checkCompletionNow = false) {
    let quests = getQuests();
    const questIndex = quests.findIndex(q => q.id === questId);

    if (questIndex === -1 || quests[questIndex].isCompleted) {
        return; // Quest not found or already completed
    }

    const quest = quests[questIndex];
    quest.progress = Math.min(quest.targetProgress, quest.progress + progressIncrement);
    updateQuests(quests);
    renderQuestList(); // Refresh quest list UI

    if (checkCompletionNow) {
        completeQuest(questId, quest.progress); // Pass current progress for condition checking
    } else {
        showNotification(`Quest "${quest.title}" progress: ${quest.progress}/${quest.targetProgress}`, 'info');
    }
}


// --- Shop and Inventory Management ---

/**
 * Handles the purchase of an item from the shop.
 * @param {string} itemId - The ID of the item to purchase.
 */
export function purchaseItem(itemId) {
    let playerData = getPlayerData();
    let inventory = getInventory();
    const item = getShopItemById(itemId);

    if (!item) {
        showNotification('Item not found.', 'error');
        return false;
    }

    if (playerData.gold < item.cost) {
        showNotification('Not enough Knowledge Gems!', 'error');
        return false;
    }

    // Check if item is already owned (for non-consumables)
    if (item.type === 'avatar_gear' && inventory.unlockedAvatarParts[item.category]?.includes(item.assetId)) {
        showNotification('You already own this avatar part!', 'info');
        return false;
    }
     if (item.type === 'theme' && inventory.unlockedThemes.includes(item.id)) {
        showNotification('You already own this theme!', 'info');
        return false;
    }
    // For other types like power-ups, blueprints, allow multiple purchases or adding to inventory

    // Deduct gold
    updatePlayerData({ gold: playerData.gold - item.cost });

    // Add item to inventory/unlock
    if (item.type === 'avatar_gear') {
        // Ensure the category array exists
        if (!inventory.unlockedAvatarParts[item.category]) {
            inventory.unlockedAvatarParts[item.category] = [];
        }
        inventory.unlockedAvatarParts[item.category].push(item.assetId);
        showNotification(`Unlocked new avatar part: ${item.name}!`, 'success');
    } else if (item.type === 'theme') {
        inventory.unlockedThemes.push(item.id);
        showNotification(`Unlocked new theme: ${item.name}!`, 'success');
    }
    else {
        // For consumable items or blueprints, add to the 'items' array
        const existingItem = inventory.items.find(invItem => invItem.id === item.id);
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 0) + 1;
        } else {
            inventory.items.push({ id: item.id, quantity: 1 });
        }
        showNotification(`Purchased ${item.name}!`, 'success');
    }

    updateInventory(inventory);
    updatePlayerSummary(); // Update gold display
    renderShop(); // Re-render shop to show item as owned or update quantity
    renderAvatarCustomization(); // Re-render avatar view if a part was bought

    return true;
}

/**
 * Uses an item from the player's inventory.
 * @param {string} itemId - The ID of the item to use.
 */
export function useItem(itemId) {
    let inventory = getInventory();
    const itemIndex = inventory.items.findIndex(invItem => invItem.id === itemId);

    if (itemIndex === -1 || inventory.items[itemIndex].quantity <= 0) {
        showNotification('You do not have this item.', 'error');
        return false;
    }

    const item = getShopItemById(itemId); // Get original item data
    if (!item) {
        console.error(`Item definition for ${itemId} not found.`);
        showNotification('Error: Item definition missing.', 'error');
        return false;
    }

    // Apply item effect
    if (item.effect) {
        switch (item.effect.type) {
            case 'xp_boost':
                // Implement XP boost mechanism (e.g., set a temporary flag, apply to next quest)
                // For now, just log and notify
                showNotification(`Activated XP Boost! Next quest will give ${item.effect.value * 100}% bonus XP. (Placeholder)`, 'info');
                break;
            case 'focus_restore':
                const playerData = getPlayerData();
                const newFocus = Math.min(GAME_CONSTANTS.INITIAL_FOCUS_MAX, playerData.focus + item.effect.value);
                updatePlayerData({ focus: newFocus });
                showNotification(`Restored ${item.effect.value} Focus! Current Focus: ${newFocus}`, 'success');
                updateDashboardView();
                break;
            case 'quiz_hint':
                showNotification(`You have ${item.effect.value} hint(s) available for quizzes. (Placeholder)`, 'info');
                // You'd need a way to track available hints and consume them in a quiz component
                break;
            default:
                showNotification('This item has no defined effect or its effect cannot be used right now.', 'warning');
                return false; // Don't consume item if effect not handled
        }
    } else {
        showNotification('This item has no direct use effect.', 'warning');
        return false; // Don't consume item
    }

    // Consume item
    inventory.items[itemIndex].quantity--;
    if (inventory.items[itemIndex].quantity <= 0) {
        inventory.items.splice(itemIndex, 1); // Remove if quantity is zero
    }
    updateInventory(inventory);
    showNotification(`Used ${item.name}.`, 'info');
    // Re-render inventory view if applicable (not yet implemented)
    return true;
}

// --- Skill Tree Logic ---

/**
 * Learns a skill in a specific subject tree.
 * @param {string} subject - The subject of the skill tree.
 * @param {string} skillId - The ID of the skill node to learn.
 */
export function learnSkill(subject, skillId) {
    let skillData = getSkillData();
    let playerData = getPlayerData();
    const skillTree = getSkillTreeBySubject(subject);
    const skillNode = getSkillNodeById(skillId, subject);

    if (!skillTree || !skillNode) {
        showNotification('Skill or skill tree not found.', 'error');
        return false;
    }

    if (skillData.unlockedSkills[subject]?.includes(skillId)) {
        showNotification(`You already know "${skillNode.name}".`, 'info');
        return false;
    }

    if (!skillNode.prerequisites.every(prereqId => skillData.unlockedSkills[subject]?.includes(prereqId))) {
        showNotification('Prerequisites not met for this skill.', 'error');
        return false;
    }

    if (skillData.points < skillNode.cost) {
        showNotification('Not enough Skill Points to learn this skill.', 'error');
        return false;
    }

    // Deduct skill points
    skillData.points -= skillNode.cost;
    // Add skill to unlocked skills for that subject
    if (!skillData.unlockedSkills[subject]) {
        skillData.unlockedSkills[subject] = [];
    }
    skillData.unlockedSkills[subject].push(skillId);

    // Track spent points for respec cost calculation (optional, but good for fine-tuning)
    if (!skillData.spentPoints[subject]) {
        skillData.spentPoints[subject] = {};
    }
    skillData.spentPoints[subject][skillId] = skillNode.cost;


    updateSkillData(skillData);
    updatePlayerData({ skillPoints: skillData.points }); // Sync player data's skill points
    showNotification(`Learned "${skillNode.name}"!`, 'success');

    // Re-render the skill tree to show new unlocked status
    renderSkillTreeDiagram(subject);
    updatePlayerSummary(); // To update skill points display
    return true;
}

/**
 * Resets all learned skills and refunds skill points (at a cost).
 */
export async function respecSkills() {
    const playerData = getPlayerData();
    const skillData = getSkillData();

    if (playerData.gold < GAME_CONSTANTS.RESPEC_SKILLS_COST) {
        showNotification(`You need ${GAME_CONSTANTS.RESPEC_SKILLS_COST} Gold to respec your skills.`, 'error');
        return false;
    }

    const confirmed = await uiManager.showConfirmationModal(`Respecing skills will cost ${GAME_CONSTANTS.RESPEC_SKILLS_COST} Gold and refund all spent skill points. Are you sure?`);
    if (!confirmed) {
        return false;
    }

    // Deduct gold
    updatePlayerData({ gold: playerData.gold - GAME_CONSTANTS.RESPEC_SKILLS_COST });

    // Calculate refunded points
    let refundedPoints = 0;
    for (const subject in skillData.spentPoints) {
        for (const skillId in skillData.spentPoints[subject]) {
            refundedPoints += skillData.spentPoints[subject][skillId];
        }
    }

    // Reset unlocked skills and spent points
    const newUnlockedSkills = {};
    const newSpentPoints = {};
    // Ensure default skills remain unlocked
    for (const subject in SKILL_TREES) {
        newUnlockedSkills[subject] = SKILL_TREES[subject].nodes
            .filter(node => node.prerequisites.length === 0 && node.cost === 0)
            .map(node => node.id);
        newSpentPoints[subject] = {};
    }

    updateSkillData({
        points: skillData.points + refundedPoints,
        unlockedSkills: newUnlockedSkills,
        spentPoints: newSpentPoints,
    });
    updatePlayerData({ skillPoints: skillData.points + refundedPoints }); // Sync player data's skill points

    showNotification(`Skills respecced! ${refundedPoints} Skill Points refunded.`, 'success');
    renderSkillTreeDiagram(selectedSkillSubject); // Re-render current tree
    updatePlayerSummary(); // Update gold and skill points
    return true;
}


// --- Game State Management ---

/**
 * Resets all game data to default.
 */
export function resetGame() {
    resetGameData(); // Calls the function from dataManager
    // After reset, re-initialize everything and start onboarding
    initializeGameLogic();
    startOnboardingTour();
    updatePlayerSummary(); // Ensure UI reflects reset
    showView('dashboard'); // Default view after reset
}

/**
 * Handles periodic focus regeneration.
 */
function startFocusRegenLoop() {
    setInterval(() => {
        let playerData = getPlayerData();
        const now = new Date().getTime();
        const lastRegenTime = new Date(playerData.lastFocusRegen).getTime();
        const timeElapsed = now - lastRegenTime;

        if (timeElapsed >= GAME_CONSTANTS.FOCUS_REGEN_INTERVAL_MS) {
            const intervalsPassed = Math.floor(timeElapsed / GAME_CONSTANTS.FOCUS_REGEN_INTERVAL_MS);
            const focusGain = intervalsPassed * GAME_CONSTANTS.FOCUS_REGEN_RATE;
            const newFocus = Math.min(GAME_CONSTANTS.INITIAL_FOCUS_MAX, playerData.focus + focusGain);

            if (newFocus > playerData.focus) {
                updatePlayerData({
                    focus: newFocus,
                    lastFocusRegen: new Date(lastRegenTime + intervalsPassed * GAME_CONSTANTS.FOCUS_REGEN_INTERVAL_MS).toISOString(),
                });
                updateDashboardView(); // Update focus bar
                showNotification(`Focus regenerated! (+${focusGain})`, 'info');
            }
        }
    }, 60000); // Check every minute, but only apply regen if enough time passed (e.g., an hour)
}

/**
 * Checks for and performs daily game resets (daily quests, shop limited offers).
 */
function checkDailyResets() {
    const lastRefreshTimestamp = loadShopRefreshTimestamp();
    const now = new Date().getTime();

    // Check if enough time has passed for daily refresh
    if (!lastRefreshTimestamp || (now - lastRefreshTimestamp) >= GAME_CONSTANTS.LIMITED_OFFER_REFRESH_INTERVAL_MS) {
        console.log("Performing daily reset: refreshing shop offers and daily quests.");
        // Reset daily quests (mark them as incomplete for the new day)
        let quests = getQuests();
        quests.forEach(q => {
            if (q.type === GAME_CONSTANTS.QUEST_TYPES.DAILY && q.isCompleted) {
                q.isCompleted = false;
                q.progress = 0;
                q.dateCompleted = null;
            }
        });
        updateQuests(quests);

        // This would be where you dynamically generate new daily quests if they weren't predefined
        // For now, we just reset the completion status of the predefined ones.

        // Re-randomize limited offers for the shop (if you want this to change daily)
        // This would involve picking random items from SHOP_ITEMS that are marked isLimitedOffer: true
        // For now, our SHOP_ITEMS already marks them, so simply re-rendering the shop is enough.

        saveShopRefreshTimestamp(); // Save new refresh timestamp
        renderShop(); // Update shop UI
        renderQuestList(); // Update quest UI
        showNotification('Daily quests and shop offers have refreshed!', 'info');
    }
    // Set up a timer to update the shop countdown timer in UI
    updateShopCountdown();
    setInterval(updateShopCountdown, 1000); // Update every second
}

/**
 * Updates the countdown timer for limited shop offers.
 */
function updateShopCountdown() {
    const lastRefreshTimestamp = loadShopRefreshTimestamp();
    if (!lastRefreshTimestamp) {
        DOMElements.shopTimer.textContent = 'Refreshing...';
        return;
    }

    const nextRefreshTime = lastRefreshTimestamp + GAME_CONSTANTS.LIMITED_OFFER_REFRESH_INTERVAL_MS;
    const timeLeft = nextRefreshTime - new Date().getTime();

    if (timeLeft <= 0) {
        DOMElements.shopTimer.textContent = 'Refreshed!';
        checkDailyResets(); // Trigger immediate reset if time runs out
        return;
    }

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    DOMElements.shopTimer.textContent = `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
}

// Export a single object with all functions to be used by other modules
const gameLogic = {
    initializeGameLogic,
    addXP,
    addGold,
    addAchievement,
    completeQuest,
    updateQuestProgress,
    purchaseItem,
    useItem,
    learnSkill,
    respecSkills,
    resetGame,
    applyTheme: applyCurrentTheme, // Expose applyCurrentTheme under gameLogic as well for settings view
};

// This is a crucial step to avoid circular dependency issues during module loading.
// uiManager needs gameLogic, and gameLogic needs uiManager.
// We set the reference AFTER gameLogic is fully defined.
import { setGameLogic } from './uiManager.js';
setGameLogic(gameLogic);

export default gameLogic; // Export the default object
