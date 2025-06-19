// js/uiManager.js

/**
 * @fileoverview Manages all user interface rendering and interactions for EduQuest.
 * This includes switching views, updating dynamic content (player stats, quests, shop),
 * handling notifications, modals, and managing the onboarding tour.
 */

import { GAME_CONSTANTS } from './constants.js';
import { getPlayerData, getQuests, getInventory, getSettings, updateSettings, getCalendarEvents, getSkillData, updateSkillData, updatePlayerData, updateOnboardingStatus, getOnboardingStatus } from './dataManager.js';
import { getAvatarPartsByCategory, getAvatarPartById } from './avatars.js';
import { getShopItemsByCategory, getShopItemById, getLimitedOfferItems } from './shopItems.js';
import { THEMES } from './themes.js';
import { SKILL_TREES, getSkillTreeBySubject, getSkillNodeById } from './skills.js';
import { checkCompletionCondition } from './battles.js'; // For checking quest conditions

// --- DOM Element References ---
const DOMElements = {
    // App Structure
    appContainer: document.getElementById('app-container'),
    sidebar: document.getElementById('sidebar'),
    mainContent: document.getElementById('main-content'),
    sidebarToggleOpen: document.getElementById('sidebar-toggle-open'),
    sidebarToggleClose: document.getElementById('sidebar-toggle-close'),

    // Player Summary
    playerName: document.getElementById('player-name'),
    playerLevel: document.getElementById('player-level'),
    playerXP: document.getElementById('current-xp'),
    nextLevelXP: document.getElementById('next-level-xp'),
    xpBar: document.getElementById('xp-bar'),
    playerGold: document.getElementById('player-gold'),
    avatarDisplay: document.getElementById('avatar-display'),
    playerSummary: document.getElementById('player-summary'), // Reference to the entire player summary div

    // Navigation
    navButtons: document.querySelectorAll('.nav-button'),
    views: document.querySelectorAll('.view'),

    // Dashboard View
    dashboardLevel: document.getElementById('dashboard-level'),
    dashboardXP: document.getElementById('dashboard-xp'),
    dashboardNextXP: document.getElementById('dashboard-next-xp'),
    dashboardXPBar: document.getElementById('dashboard-xp-bar'),
    dashboardGold: document.getElementById('dashboard-gold'),
    dashboardActiveQuests: document.getElementById('dashboard-active-quests'),
    dashboardStatsList: document.getElementById('dashboard-stats-list'),
    dashboardAchievements: document.getElementById('dashboard-achievements'),
    focusCurrent: document.getElementById('focus-current'),
    focusMax: document.getElementById('focus-max'),
    focusBar: document.getElementById('focus-bar'),

    // Quest Log View
    questList: document.getElementById('quest-list'),
    questFilter: document.getElementById('quest-filter'),
    questSort: document.getElementById('quest-sort'),

    // Shop View
    shopCurrentGold: document.getElementById('shop-current-gold'),
    shopTimer: document.getElementById('shop-timer'),
    shopAvatarGear: document.getElementById('shop-avatar-gear'),
    shopPowerUps: document.getElementById('shop-power-ups'),
    shopDecorations: document.getElementById('shop-decorations'),
    shopBlueprints: document.getElementById('shop-blueprints'),
    shopLimitedOffers: document.getElementById('shop-limited-offers'),

    // Calendar View
    calendarGrid: document.getElementById('calendar-grid'),
    calendarMonthYear: document.getElementById('calendar-month-year'),
    calendarPrevMonthBtn: document.getElementById('calendar-prev-month'),
    calendarNextMonthBtn: document.getElementById('calendar-next-month'),
    addStudyBlockBtn: document.getElementById('add-study-block-btn'),

    // Avatar Customization View
    avatarPreviewContainer: document.getElementById('avatar-preview-container'),
    avatarNameInput: document.getElementById('avatar-name-input'),
    saveAvatarNameBtn: document.getElementById('save-avatar-name'),
    avatarCategoryTabs: document.getElementById('avatar-category-tabs'),
    avatarItemList: document.getElementById('avatar-item-list'),

    // Knowledge Tree View
    skillPointsDisplay: document.getElementById('skill-points-display'),
    respecSkillsBtn: document.getElementById('respec-skills-btn'),
    respecCostDisplay: document.getElementById('respec-cost'),
    subjectTreeList: document.getElementById('subject-tree-list'),
    selectedTreeName: document.getElementById('selected-tree-name'),
    skillTreeDiagram: document.getElementById('skill-tree-diagram'),

    // Settings View
    themeSelection: document.getElementById('theme-selection'),
    darkModeToggle: document.getElementById('dark-mode-toggle'),
    musicToggle: document.getElementById('music-toggle'),
    sfxToggle: document.getElementById('sfx-toggle'),
    musicVolume: document.getElementById('music-volume'),
    sfxVolume: document.getElementById('sfx-volume'),
    dueDateRemindersToggle: document.getElementById('due-date-reminders-toggle'),
    performanceModeToggle: document.getElementById('performance-mode-toggle'),
    skillAutoAllocate: document.getElementById('skill-auto-allocate'),
    resetGameDataBtn: document.getElementById('reset-game-data-btn'),

    // Modals & Notifications
    onboardingOverlay: document.getElementById('onboarding-overlay'),
    onboardingModal: document.getElementById('onboarding-modal'),
    onboardingTitle: document.getElementById('onboarding-title'),
    onboardingText: document.getElementById('onboarding-text'),
    onboardingNextBtn: document.getElementById('onboarding-next-btn'),
    onboardingHighlight: document.getElementById('onboarding-highlight'),
    confirmationModal: document.getElementById('confirmation-modal'),
    confirmationMessage: document.getElementById('confirmation-message'),
    confirmYesBtn: document.getElementById('confirm-yes'),
    confirmNoBtn: document.getElementById('confirm-no'),
    notificationBox: document.getElementById('notification-box'),
    notificationMessage: document.getElementById('notification-message'),
};

let currentView = 'dashboard'; // Keep track of the currently active view
let currentCalendarDate = new Date(); // Stores the currently displayed month for the calendar
let currentAvatarCategory = 'body'; // Stores the currently selected avatar customization category
let selectedSkillSubject = null; // Stores the currently selected skill tree subject

/**
 * Displays a non-blocking notification message to the user.
 * @param {string} message - The message to display.
 * @param {string} type - Type of message (e.g., 'success', 'error', 'info').
 */
export function showNotification(message, type = 'info') {
    DOMElements.notificationMessage.textContent = message;
    DOMElements.notificationBox.className = 'fixed bottom-4 right-4 p-4 rounded-xl shadow-lg transition-opacity duration-300 z-40 opacity-100';

    // Apply type-specific styling
    switch (type) {
        case 'success':
            DOMElements.notificationBox.classList.add('bg-green-600', 'text-white');
            break;
        case 'error':
            DOMElements.notificationBox.classList.add('bg-red-600', 'text-white');
            break;
        case 'warning':
            DOMElements.notificationBox.classList.add('bg-yellow-600', 'text-white');
            break;
        case 'info':
        default:
            DOMElements.notificationBox.classList.add('bg-gray-900', 'text-white');
            break;
    }

    // Hide after a set duration
    setTimeout(() => {
        DOMElements.notificationBox.classList.remove('opacity-100');
        DOMElements.notificationBox.classList.add('opacity-0');
        // Clean up classes after transition
        setTimeout(() => {
            DOMElements.notificationBox.className = 'fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-xl shadow-lg opacity-0 transition-opacity duration-300 z-40';
        }, 300); // Match transition duration
    }, GAME_CONSTANTS.NOTIFICATION_DURATION_MS);
}

/**
 * Shows a confirmation modal and returns a Promise that resolves based on user action.
 * @param {string} message - The message to display in the confirmation modal.
 * @returns {Promise<boolean>} Resolves to true if confirmed, false if cancelled.
 */
export function showConfirmationModal(message) {
    DOMElements.confirmationMessage.textContent = message;
    DOMElements.confirmationModal.classList.remove('hidden');

    return new Promise(resolve => {
        const confirmYes = () => {
            DOMElements.confirmationModal.classList.add('hidden');
            DOMElements.confirmYesBtn.removeEventListener('click', confirmYes);
            DOMElements.confirmNoBtn.removeEventListener('click', confirmNo);
            resolve(true);
        };
        const confirmNo = () => {
            DOMElements.confirmationModal.classList.add('hidden');
            DOMElements.confirmYesBtn.removeEventListener('click', confirmYes);
            DOMElements.confirmNoBtn.removeEventListener('click', confirmNo);
            resolve(false);
        };

        DOMElements.confirmYesBtn.addEventListener('click', confirmYes);
        DOMElements.confirmNoBtn.addEventListener('click', confirmNo);
    });
}

/**
 * Switches the active view in the main content area.
 * @param {string} viewId - The ID of the view to show (e.g., 'dashboard').
 */
export function showView(viewId) {
    // Hide current view and remove active class from nav button
    const activeView = document.querySelector('.view.active-view');
    if (activeView) {
        activeView.classList.remove('active-view');
        activeView.classList.add('hidden');
    }

    const activeButton = document.querySelector('.nav-button.active');
    if (activeButton) {
        activeButton.classList.remove('active');
    }

    // Show new view and add active class to nav button
    const newView = document.getElementById(viewId + '-view');
    if (newView) {
        newView.classList.remove('hidden');
        newView.classList.add('active-view');
        currentView = viewId; // Update current view tracker

        // Highlight corresponding nav button
        const newActiveButton = document.querySelector(`.nav-button[data-view="${viewId}"]`);
        if (newActiveButton) {
            newActiveButton.classList.add('active');
        }

        // Trigger specific view updates
        switch (viewId) {
            case 'dashboard':
                updateDashboardView();
                break;
            case 'quests':
                renderQuestList();
                break;
            case 'shop':
                renderShop();
                break;
            case 'calendar':
                renderCalendar(currentCalendarDate);
                break;
            case 'avatar':
                renderAvatarCustomization();
                break;
            case 'knowledge-tree':
                renderKnowledgeTreeNav();
                renderSkillTreeDiagram(); // Render default or selected tree
                break;
            case 'settings':
                renderSettings();
                break;
        }
        closeSidebar(); // Close sidebar on mobile after view change
    } else {
        console.error(`View with ID '${viewId}-view' not found.`);
    }
}

/**
 * Updates the player's summary section (sidebar).
 */
export function updatePlayerSummary() {
    const playerData = getPlayerData();
    const nextLevelXP = GAME_CONSTANTS.XP_PER_LEVEL[playerData.level] || Infinity;
    const xpPercentage = (playerData.xp / nextLevelXP) * 100;

    DOMElements.playerName.textContent = playerData.name;
    DOMElements.playerLevel.textContent = playerData.level;
    DOMElements.playerXP.textContent = playerData.xp;
    DOMElements.nextLevelXP.textContent = nextLevelXP === Infinity ? 'MAX' : nextLevelXP;
    DOMElements.xpBar.style.width = `${Math.min(100, xpPercentage)}%`;
    DOMElements.playerGold.textContent = playerData.gold;

    renderEquippedAvatar(DOMElements.avatarDisplay, playerData.equippedAvatar);
}

/**
 * Updates the Dashboard view with current player stats.
 */
export function updateDashboardView() {
    const playerData = getPlayerData();
    const quests = getQuests();

    DOMElements.dashboardLevel.textContent = playerData.level;
    DOMElements.dashboardXP.textContent = playerData.xp;
    DOMElements.dashboardNextXP.textContent = GAME_CONSTANTS.XP_PER_LEVEL[playerData.level] || 'MAX';
    const xpPercentage = (playerData.xp / (GAME_CONSTANTS.XP_PER_LEVEL[playerData.level] || playerData.xp)) * 100;
    DOMElements.dashboardXPBar.style.width = `${Math.min(100, xpPercentage)}%`;
    DOMElements.dashboardGold.textContent = playerData.gold;

    // Active Quests
    const activeQuests = quests.filter(q => !q.isCompleted && !q.isHidden);
    DOMElements.dashboardActiveQuests.innerHTML = activeQuests.length > 0
        ? activeQuests.map(q => `<li>${q.title} (${Math.floor((q.progress / q.targetProgress) * 100)}% progress)</li>`).join('')
        : '<li>No active quests. Visit Quest Log!</li>';

    // Subject Stats
    DOMElements.dashboardStatsList.innerHTML = Object.entries(playerData.subjects)
        .map(([subject, data]) => `
            <li class="flex justify-between items-center">
                <span class="font-medium">${subject}:</span>
                <span class="text-right">${data.xp} XP (Level ${data.level})</span>
            </li>
        `).join('');

    // Recent Achievements
    DOMElements.dashboardAchievements.innerHTML = playerData.achievements.length > 0
        ? playerData.achievements.slice(-5).reverse().map(achievement => `<li>${achievement}</li>`).join('') // Show last 5
        : '<li>No achievements yet!</li>';

    // Focus Meter
    DOMElements.focusCurrent.textContent = playerData.focus;
    DOMElements.focusMax.textContent = GAME_CONSTANTS.INITIAL_FOCUS_MAX;
    DOMElements.focusBar.style.width = `${(playerData.focus / GAME_CONSTANTS.INITIAL_FOCUS_MAX) * 100}%`;
}

/**
 * Renders the quest list based on current filters and sort order.
 */
export function renderQuestList() {
    const quests = getQuests();
    const playerData = getPlayerData();
    const filter = DOMElements.questFilter.value;
    const sort = DOMElements.questSort.value;

    let filteredQuests = quests.filter(q => !q.isHidden); // Always hide hidden quests

    // Apply filter
    if (filter === 'active') {
        filteredQuests = filteredQuests.filter(q => !q.isCompleted);
    } else if (filter === 'completed') {
        filteredQuests = filteredQuests.filter(q => q.isCompleted);
    } else if (filter === 'daily') {
        filteredQuests = filteredQuests.filter(q => q.type === GAME_CONSTANTS.QUEST_TYPES.DAILY);
    } else if (filter === 'main') {
        filteredQuests = filteredQuests.filter(q => q.type === GAME_CONSTANTS.QUEST_TYPES.MAIN);
    } else if (filter === 'side') {
        filteredQuests = filteredQuests.filter(q => q.type === GAME_CONSTANTS.QUEST_TYPES.SIDE);
    }

    // Apply sort
    filteredQuests.sort((a, b) => {
        if (sort === 'dueDate' && a.dueDate && b.dueDate) {
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        if (sort === 'subject') {
            return (a.subject || '').localeCompare(b.subject || '');
        }
        if (sort === 'xpReward') {
            return b.xpReward - a.xpReward;
        }
        if (sort === 'goldReward') {
            return b.goldReward - a.goldReward;
        }
        return 0;
    });

    DOMElements.questList.innerHTML = filteredQuests.length > 0
        ? filteredQuests.map(quest => {
            const progressPercentage = quest.targetProgress > 0 ? Math.min(100, (quest.progress / quest.targetProgress) * 100) : 100;
            const statusColor = quest.isCompleted ? 'bg-green-500' : (quest.progress > 0 ? 'bg-blue-500' : 'bg-gray-400');
            const statusText = quest.isCompleted ? 'Completed' : (quest.progress > 0 ? 'In Progress' : 'Not Started');
            const dueDateText = quest.dueDate ? `<p class="text-xs text-gray-500">Due: ${new Date(quest.dueDate).toLocaleDateString()}</p>` : '';
            const completeButton = !quest.isCompleted ? `<button data-quest-id="${quest.id}" class="complete-quest-btn mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md">Complete Quest</button>` : '';

            // Determine if quest can be started (all prerequisites met and not completed)
            const canStart = quest.prerequisites.every(prereqId => {
                const prereqQuest = quests.find(q => q.id === prereqId);
                return prereqQuest && prereqQuest.isCompleted;
            }) && !quest.isCompleted;

            // Only show quests that are either active or completed, or can be started
            if (!canStart && !quest.isCompleted && quest.progress === 0 && quest.prerequisites.length > 0) {
                 return ''; // Hide quests that cannot be started yet
            }

            return `
                <div class="bg-white p-4 rounded-xl shadow-md border ${quest.isCompleted ? 'border-green-300' : 'border-blue-300'}">
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">${quest.title}</h3>
                    <p class="text-gray-600 text-sm mb-2">${quest.description}</p>
                    ${dueDateText}
                    <div class="flex items-center text-sm mb-1">
                        <i class="fas fa-flask mr-2 text-blue-500"></i> Subject: <span class="font-medium ml-1">${quest.subject || 'General'}</span>
                    </div>
                    <div class="flex items-center text-sm mb-1">
                        <i class="fas fa-star mr-2 text-yellow-500"></i> XP Reward: <span class="font-medium ml-1">${quest.xpReward}</span>
                    </div>
                    <div class="flex items-center text-sm mb-3">
                        <i class="fas fa-gem mr-2 text-yellow-500"></i> Gold Reward: <span class="font-medium ml-1">${quest.goldReward}</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                        <div class="${statusColor} h-2.5 rounded-full" style="width: ${progressPercentage}%;"></div>
                    </div>
                    <div class="text-xs text-gray-500 mt-1">${statusText} (${quest.progress}/${quest.targetProgress})</div>
                    ${canStart ? completeButton : (quest.isCompleted ? '' : `<p class="text-sm text-red-500 mt-3">Prerequisites not met.</p>`)}
                </div>
            `;
        }).join('')
        : '<div class="bg-gray-100 p-4 rounded-xl shadow-md text-gray-600 text-center col-span-full">No quests to display based on current filters.</div>';

    // Attach event listeners to newly rendered buttons
    DOMElements.questList.querySelectorAll('.complete-quest-btn').forEach(button => {
        button.onclick = (e) => {
            const questId = e.target.dataset.questId;
            // Trigger completion logic from gameLogic.js (will be defined later)
            // For now, we can show a notification or a dummy completion
            showNotification(`Attempting to complete quest: ${questId}`, 'info');
            // A more complete implementation would call a gameLogic function here
            // e.g., gameLogic.completeQuest(questId);
        };
    });
}

/**
 * Renders the shop items based on categories.
 */
export function renderShop() {
    const inventory = getInventory();
    const playerData = getPlayerData();

    DOMElements.shopCurrentGold.textContent = playerData.gold;

    const renderItems = (container, items, isLimited = false) => {
        container.innerHTML = items.map(item => {
            const isOwned = inventory.items.some(invItem => invItem.id === item.id) ||
                             (item.type === 'avatar_gear' && inventory.unlockedAvatarParts[item.category]?.includes(item.assetId)) ||
                             (item.type === 'theme' && inventory.unlockedThemes.includes(item.id)); // Check for themes
            const canAfford = playerData.gold >= item.cost;
            const buttonText = isOwned ? 'Owned' : (canAfford ? 'Buy' : 'Too Expensive');
            const buttonClass = isOwned ? 'bg-gray-500 cursor-not-allowed' : (canAfford ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-300 cursor-not-allowed');
            const isDisabled = isOwned || !canAfford;

            return `
                <div class="shop-item-card">
                    <i class="${item.icon} item-icon"></i>
                    <h4 class="font-semibold text-gray-800 mt-2">${item.name}</h4>
                    <p class="text-sm text-gray-600 mb-2">${item.description}</p>
                    <div class="item-price">
                        <i class="fas fa-gem mr-1"></i> ${item.cost}
                    </div>
                    <button class="${buttonClass}" data-item-id="${item.id}" ${isDisabled ? 'disabled' : ''}>
                        ${buttonText}
                    </button>
                </div>
            `;
        }).join('');

        container.querySelectorAll('button').forEach(button => {
            if (!button.disabled) {
                button.onclick = (e) => {
                    const itemId = e.target.dataset.itemId;
                    // This will trigger the purchase logic in gameLogic.js
                    // e.g., gameLogic.purchaseItem(itemId);
                    showNotification(`Attempting to buy: ${itemId}`, 'info');
                };
            }
        });
    };

    renderItems(DOMElements.shopAvatarGear, getShopItemsByCategory('avatar_gear'));
    renderItems(DOMElements.shopPowerUps, getShopItemsByCategory('power_up'));
    renderItems(DOMElements.shopDecorations, getShopItemsByCategory('decoration'));
    renderItems(DOMElements.shopBlueprints, getShopItemsByCategory('blueprint'));

    // Limited Offers
    const limitedOffers = getLimitedOfferItems(); // From shopItems.js
    renderItems(DOMElements.shopLimitedOffers, limitedOffers, true);

    // Update shop timer (dummy for now, actual logic in app.js)
    DOMElements.shopTimer.textContent = '23h 59m 59s'; // Placeholder
}

/**
 * Renders the calendar for the specified month and year.
 * @param {Date} date - A Date object representing the month to display.
 */
export function renderCalendar(date) {
    DOMElements.calendarGrid.innerHTML = ''; // Clear previous days
    const today = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth(); // 0-indexed

    DOMElements.calendarMonthYear.textContent = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    // Get the first day of the month and last day of the month
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0); // Last day of current month

    // Calculate the day of the week for the first day (0 for Sunday, 1 for Monday, etc.)
    const startDayOfWeek = firstDay.getDay();

    // Fill in leading empty days
    for (let i = 0; i < startDayOfWeek; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.classList.add('calendar-day');
        DOMElements.calendarGrid.appendChild(emptyDay);
    }

    // Fill in days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dayDate = new Date(currentYear, currentMonth, day);
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-day', 'current-month');
        dayDiv.innerHTML = `<span class="calendar-day-number">${day}</span>`;

        if (dayDate.toDateString() === today.toDateString()) {
            dayDiv.classList.add('today');
        }

        const eventsForDay = getCalendarEvents().filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.getFullYear() === currentYear &&
                   eventDate.getMonth() === currentMonth &&
                   eventDate.getDate() === day;
        });

        if (eventsForDay.length > 0) {
            dayDiv.classList.add('has-events');
            eventsForDay.forEach(event => {
                const eventSpan = document.createElement('span');
                eventSpan.classList.add('calendar-event');
                if (event.type === GAME_CONSTANTS.QUEST_TYPES.STUDY_BLOCK) {
                    eventSpan.classList.add('study-block');
                } else {
                    eventSpan.classList.add('quest-deadline');
                }
                eventSpan.textContent = event.title;
                dayDiv.appendChild(eventSpan);
            });
        }
        DOMElements.calendarGrid.appendChild(dayDiv);
    }

    // Attach event listeners for calendar navigation
    DOMElements.calendarPrevMonthBtn.onclick = () => {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
        renderCalendar(currentCalendarDate);
    };
    DOMElements.calendarNextMonthBtn.onclick = () => {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
        renderCalendar(currentCalendarDate);
    };
}

/**
 * Renders the avatar customization view.
 */
export function renderAvatarCustomization() {
    const playerData = getPlayerData();
    const inventory = getInventory();

    DOMElements.avatarNameInput.value = playerData.name;
    renderEquippedAvatar(DOMElements.avatarPreviewContainer, playerData.equippedAvatar);

    // Render category tabs
    DOMElements.avatarCategoryTabs.innerHTML = GAME_CONSTANTS.AVATAR_PART_LAYERS.map(layer => `
        <button class="px-4 py-2 rounded-xl text-sm font-medium transition-colors ${currentAvatarCategory === layer ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}"
                data-category="${layer}">${layer.charAt(0).toUpperCase() + layer.slice(1)}</button>
    `).join('');

    DOMElements.avatarCategoryTabs.querySelectorAll('button').forEach(button => {
        button.onclick = (e) => {
            currentAvatarCategory = e.target.dataset.category;
            renderAvatarCustomization(); // Re-render to show selected category items
        };
    });

    // Render items for the current category
    const itemsForCategory = getAvatarPartsByCategory(currentAvatarCategory);
    DOMElements.avatarItemList.innerHTML = itemsForCategory.map(part => {
        const isUnlocked = inventory.unlockedAvatarParts[currentAvatarCategory]?.includes(part.id);
        const isEquipped = playerData.equippedAvatar[currentAvatarCategory] === part.id;
        const isDisabled = !isUnlocked; // Items are disabled if not unlocked

        return `
            <div class="avatar-item-thumbnail ${isEquipped ? 'selected' : ''} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}"
                 data-part-id="${part.id}" data-category="${currentAvatarCategory}">
                <i class="${part.icon} text-4xl text-gray-600"></i>
                <span class="absolute bottom-1 text-xs">${part.name}</span>
                ${!isUnlocked ? '<span class="absolute top-1 right-1 text-yellow-500"><i class="fas fa-lock"></i></span>' : ''}
            </div>
        `;
    }).join('');

    DOMElements.avatarItemList.querySelectorAll('.avatar-item-thumbnail').forEach(thumbnail => {
        if (!thumbnail.classList.contains('opacity-50')) { // Only attach listener if not disabled
            thumbnail.onclick = (e) => {
                const partId = e.currentTarget.dataset.partId;
                const category = e.currentTarget.dataset.category;
                const playerData = getPlayerData();
                const updatedEquippedAvatar = { ...playerData.equippedAvatar, [category]: partId };
                updatePlayerData({ equippedAvatar: updatedEquippedAvatar });
                renderAvatarCustomization(); // Re-render preview and selection
                updatePlayerSummary(); // Update sidebar avatar
                showNotification(`Equipped ${getAvatarPartById(partId, category).name}!`, 'success');

                // If onboarding quest for avatar customization is active, complete it
                const onboardingQuest = getQuests().find(q => q.id === 'onboarding_customize_avatar' && !q.isCompleted);
                if (onboardingQuest) {
                    onboardingQuest.progress = 1;
                    // The completion logic will be handled by gameLogic when quests are updated.
                    // For now, just mark progress.
                }
            };
        }
    });
}

/**
 * Renders the equipped avatar in a specified container.
 * @param {HTMLElement} container - The DOM element to render the avatar into.
 * @param {object} equippedAvatar - The object containing IDs of equipped parts.
 */
export function renderEquippedAvatar(container, equippedAvatar) {
    container.innerHTML = ''; // Clear previous avatar parts

    // Remove the default user icon if present
    const defaultIcon = container.querySelector('.fas.fa-user-circle');
    if (defaultIcon) {
        defaultIcon.remove();
    }

    // Render parts in specified order
    GAME_CONSTANTS.AVATAR_PART_LAYERS.forEach(layer => {
        const partId = equippedAvatar[layer];
        if (partId) {
            const partData = getAvatarPartById(partId, layer);
            if (partData && partData.asset) {
                let partElement;
                if (partData.asset.type === 'icon') {
                    partElement = document.createElement('i');
                    partElement.className = `${partData.asset.value} absolute text-6xl text-gray-700`; // Adjust sizing/color as needed
                    // Apply different z-index or classes for layering if actual SVG/IMG assets were used
                    // For FA icons, layering is more conceptual or relies on a base icon
                    if (layer === 'body') partElement.classList.add('text-7xl'); // Make body slightly larger
                    if (layer === 'top' || layer === 'bottom') partElement.classList.add('text-7xl');
                }
                // Future: else if (partData.asset.type === 'svg' || partData.asset.type === 'img') { ... }
                if (partElement) {
                    container.appendChild(partElement);
                }
            }
        }
    });

    // If no parts rendered, show fallback
    if (container.children.length === 0) {
        const fallbackIcon = document.createElement('i');
        fallbackIcon.className = 'fas fa-user-circle text-6xl text-gray-500';
        container.appendChild(fallbackIcon);
    }
}

/**
 * Renders the navigation for the Knowledge Tree (list of subjects).
 */
export function renderKnowledgeTreeNav() {
    DOMElements.subjectTreeList.innerHTML = '';
    for (const subject in SKILL_TREES) {
        const tree = SKILL_TREES[subject];
        const listItem = document.createElement('li');
        listItem.className = 'mb-2';
        listItem.innerHTML = `
            <button class="w-full text-left py-2 px-4 rounded-xl flex items-center hover:bg-gray-200 transition-colors duration-200 ${selectedSkillSubject === subject ? 'bg-gray-200 font-semibold' : ''}"
                    data-subject="${subject}">
                <i class="${tree.icon} mr-3 text-gray-600"></i> ${tree.name}
            </button>
        `;
        DOMElements.subjectTreeList.appendChild(listItem);
    }

    DOMElements.subjectTreeList.querySelectorAll('button').forEach(button => {
        button.onclick = (e) => {
            selectedSkillSubject = e.target.dataset.subject;
            renderKnowledgeTreeNav(); // Re-render nav to highlight
            renderSkillTreeDiagram(selectedSkillSubject); // Render the selected tree
        };
    });
}

/**
 * Renders the selected Knowledge Tree diagram.
 * @param {string} subject - The subject of the skill tree to render.
 */
export function renderSkillTreeDiagram(subject = selectedSkillSubject) {
    DOMElements.skillTreeDiagram.innerHTML = ''; // Clear previous diagram
    if (!subject) {
        DOMElements.selectedTreeName.textContent = 'None Selected';
        DOMElements.skillTreeDiagram.innerHTML = '<p class="text-gray-500 text-center py-10">Select a subject tree to view its skills.</p>';
        return;
    }

    const tree = getSkillTreeBySubject(subject);
    if (!tree) {
        DOMElements.selectedTreeName.textContent = 'Error';
        DOMElements.skillTreeDiagram.innerHTML = '<p class="text-red-500 text-center py-10">Skill tree not found.</p>';
        return;
    }
    DOMElements.selectedTreeName.textContent = tree.name;

    const skillData = getSkillData();
    const playerData = getPlayerData();

    // Render Nodes
    tree.nodes.forEach(node => {
        const isUnlocked = skillData.unlockedSkills[subject]?.includes(node.id);
        const canUnlock = node.prerequisites.every(prereqId => skillData.unlockedSkills[subject]?.includes(prereqId)) &&
                          skillData.points >= node.cost && !isUnlocked;

        const nodeDiv = document.createElement('div');
        nodeDiv.id = `skill-node-${node.id}`;
        nodeDiv.classList.add('skill-node', isUnlocked ? 'unlocked' : 'locked');
        if (node.type === 'active') nodeDiv.classList.add('active-skill');
        if (canUnlock) nodeDiv.classList.add('border-purple-500', 'hover:bg-purple-100'); // Visual cue for unlockable

        nodeDiv.style.left = `${node.position.x}px`;
        nodeDiv.style.top = `${node.position.y}px`;
        nodeDiv.style.transform = `translate(-50%, -50%)`; // Center the node on its position

        nodeDiv.innerHTML = `
            <span class="skill-title">${node.name}</span>
            <span class="skill-cost">${isUnlocked ? 'Learned' : `${node.cost} SP`}</span>
            ${!isUnlocked && canUnlock ? '<span class="text-xs text-purple-700">Click to Learn!</span>' : ''}
        `;

        DOMElements.skillTreeDiagram.appendChild(nodeDiv);

        if (!isUnlocked && canUnlock) {
            nodeDiv.onclick = () => {
                // Confirm purchase
                showConfirmationModal(`Are you sure you want to learn "${node.name}" for ${node.cost} Skill Points?`)
                    .then(confirmed => {
                        if (confirmed) {
                             // Call gameLogic.learnSkill
                             gameLogic.learnSkill(subject, node.id); // Placeholder call
                             showNotification(`Learned skill: ${node.name}!`, 'success');
                             renderSkillTreeDiagram(subject); // Re-render
                             updatePlayerSummary(); // Update skill points display
                        }
                    });
            };
        } else if (isUnlocked && node.type === 'active') {
             nodeDiv.onclick = () => {
                 showNotification(`Skill "${node.name}" is an active ability. Use it during relevant tasks!`, 'info');
             };
        }
    });

    // Render Connections
    tree.connections.forEach(conn => {
        const fromNode = tree.nodes.find(node => node.id === conn.from);
        const toNode = tree.nodes.find(node => node.id === conn.to);

        if (fromNode && toNode) {
            const line = document.createElement('div');
            line.classList.add('skill-line');

            const isUnlockedLine = skillData.unlockedSkills[subject]?.includes(fromNode.id) &&
                                   skillData.unlockedSkills[subject]?.includes(toNode.id);
            if (isUnlockedLine) {
                line.classList.add('unlocked-line');
            }

            // Calculate positions (centered)
            const x1 = fromNode.position.x;
            const y1 = fromNode.position.y;
            const x2 = toNode.position.x;
            const y2 = toNode.position.y;

            const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

            line.style.width = `${distance}px`;
            line.style.left = `${x1}px`;
            line.style.top = `${y1}px`;
            line.style.transform = `rotate(${angle}deg)`;
            line.style.transformOrigin = 'left center'; // Rotate from the start point

            DOMElements.skillTreeDiagram.appendChild(line);
        }
    });

     // Move skill nodes to be on top of lines (z-index ordering)
    tree.nodes.forEach(node => {
        const nodeDiv = document.getElementById(`skill-node-${node.id}`);
        if (nodeDiv) {
            DOMElements.skillTreeDiagram.appendChild(nodeDiv); // Appending again moves it to the end (top z-index)
        }
    });

    DOMElements.respecCostDisplay.textContent = GAME_CONSTANTS.RESPEC_SKILLS_COST;
}


/**
 * Renders the Settings view with current game settings.
 */
export function renderSettings() {
    const settings = getSettings();
    const inventory = getInventory();

    // Theme selection
    DOMElements.themeSelection.innerHTML = THEMES.map(theme => {
        const isUnlocked = inventory.unlockedThemes.includes(theme.id);
        const isCurrent = settings.currentTheme === theme.id;
        const isDisabled = !isUnlocked && theme.cost > 0;
        return `
            <button class="flex flex-col items-center p-3 rounded-xl shadow-sm border-2
                           ${isCurrent ? 'border-purple-500' : 'border-gray-300 hover:border-gray-400'}
                           ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}"
                    data-theme-id="${theme.id}" ${isDisabled ? 'disabled' : ''}>
                <span class="font-medium text-sm">${theme.name}</span>
                ${!isUnlocked && theme.cost > 0 ? `<span class="text-xs text-yellow-600"><i class="fas fa-gem mr-1"></i> ${theme.cost}</span>` : ''}
            </button>
        `;
    }).join('');

    DOMElements.themeSelection.querySelectorAll('button').forEach(button => {
        if (!button.disabled) {
            button.onclick = (e) => {
                const themeId = e.currentTarget.dataset.themeId;
                if (themeId !== settings.currentTheme) {
                    showConfirmationModal(`Switch to "${THEMES.find(t => t.id === themeId).name}" theme?`)
                        .then(confirmed => {
                            if (confirmed) {
                                // Call gameLogic.applyTheme
                                gameLogic.applyTheme(themeId); // Placeholder
                                showNotification(`Theme changed to ${THEMES.find(t => t.id === themeId).name}`, 'success');
                                renderSettings(); // Re-render settings to show new active theme
                            }
                        });
                }
            };
        }
    });

    // Dark Mode Toggle
    DOMElements.darkModeToggle.checked = settings.darkMode;
    DOMElements.darkModeToggle.onchange = (e) => {
        const isDarkMode = e.target.checked;
        updateSettings({ darkMode: isDarkMode });
        // Apply/remove dark-mode class on body
        document.body.classList.toggle('dark-mode', isDarkMode);
        showNotification(`Dark Mode ${isDarkMode ? 'Enabled' : 'Disabled'}`, 'info');
    };

    // Sound Toggles & Volumes
    DOMElements.musicToggle.checked = settings.musicEnabled;
    DOMElements.sfxToggle.checked = settings.sfxEnabled;
    DOMElements.musicVolume.value = settings.musicVolume * 100;
    DOMElements.sfxVolume.value = settings.sfxVolume * 100;

    DOMElements.musicToggle.onchange = (e) => updateSettings({ musicEnabled: e.target.checked });
    DOMElements.sfxToggle.onchange = (e) => updateSettings({ sfxEnabled: e.target.checked });
    DOMElements.musicVolume.oninput = (e) => updateSettings({ musicVolume: parseFloat(e.target.value) / 100 });
    DOMElements.sfxVolume.oninput = (e) => updateSettings({ sfxVolume: parseFloat(e.target.value) / 100 });

    // Gameplay Preferences
    DOMElements.dueDateRemindersToggle.checked = settings.dueDateReminders;
    DOMElements.dueDateRemindersToggle.onchange = (e) => updateSettings({ dueDateReminders: e.target.checked });

    DOMElements.performanceModeToggle.checked = settings.performanceMode;
    DOMElements.performanceModeToggle.onchange = (e) => updateSettings({ performanceMode: e.target.checked });

    DOMElements.skillAutoAllocate.value = settings.skillAutoAllocate;
    DOMElements.skillAutoAllocate.onchange = (e) => updateSettings({ skillAutoAllocate: e.target.value });
}


/**
 * Initializes listeners for common UI elements.
 * Called once at app startup.
 */
export function initializeUILoaders() {
    // Navigation button listeners
    DOMElements.navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const viewId = button.dataset.view;
            showView(viewId);
        });
    });

    // Sidebar toggle listeners for mobile
    DOMElements.sidebarToggleOpen.addEventListener('click', openSidebar);
    DOMElements.sidebarToggleClose.addEventListener('click', closeSidebar);
    // Close sidebar if clicking outside of it on mobile
    DOMElements.mainContent.addEventListener('click', (e) => {
        if (DOMElements.sidebar.classList.contains('open') && window.innerWidth < 768) {
            closeSidebar();
        }
    });
    // Prevent sidebar click from closing sidebar
    DOMElements.sidebar.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Quest filter and sort listeners
    DOMElements.questFilter.addEventListener('change', renderQuestList);
    DOMElements.questSort.addEventListener('change', renderQuestList);

    // Save Avatar Name
    DOMElements.saveAvatarNameBtn.addEventListener('click', () => {
        const newName = DOMElements.avatarNameInput.value.trim();
        if (newName && newName !== getPlayerData().name) {
            updatePlayerData({ name: newName });
            updatePlayerSummary();
            showNotification(`Scholar name changed to "${newName}"!`, 'success');
        } else if (!newName) {
            showNotification('Scholar name cannot be empty!', 'warning');
        }
    });

    // Calendar navigation already attached in renderCalendar, but ensures current month is set on first load
    DOMElements.calendarPrevMonthBtn.onclick = () => {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
        renderCalendar(currentCalendarDate);
    };
    DOMElements.calendarNextMonthBtn.onclick = () => {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
        renderCalendar(currentCalendarDate);
    };

    DOMElements.addStudyBlockBtn.onclick = async () => {
        const blockName = prompt("Enter a name for your study block:");
        if (blockName) {
            const blockDateStr = prompt("Enter the date for your study block (YYYY-MM-DD):");
            if (blockDateStr) {
                const blockDate = new Date(blockDateStr);
                if (isNaN(blockDate.getTime())) {
                    showNotification("Invalid date format. Please use YYYY-MM-DD.", "error");
                    return;
                }
                const newEvent = {
                    id: `study_block_${Date.now()}`,
                    title: blockName,
                    date: blockDate.toISOString(),
                    type: GAME_CONSTANTS.QUEST_TYPES.STUDY_BLOCK,
                };
                const currentEvents = getCalendarEvents();
                updateCalendarEvents([...currentEvents, newEvent]);
                renderCalendar(currentCalendarDate);
                showNotification(`Study block "${blockName}" added to calendar!`, 'success');

                // If onboarding quest for checking quests is active and complete, proceed
                const onboardingQuest = getQuests().find(q => q.id === 'onboarding_check_quests' && !q.isCompleted);
                if (onboardingQuest) {
                     onboardingQuest.progress = 1; // Mark as complete
                     // Completion will be handled by gameLogic when quests are updated.
                }
            }
        }
    };


    // Reset Game Data button listener
    DOMElements.resetGameDataBtn.addEventListener('click', async () => {
        const confirmed = await showConfirmationModal('Are you absolutely sure you want to reset all your game data? This cannot be undone!');
        if (confirmed) {
            gameLogic.resetGame(); // Calls the reset logic in gameLogic.js
            showNotification('All game data has been reset. Starting a new journey!', 'info');
        }
    });
}

/**
 * Opens the sidebar for mobile views.
 */
function openSidebar() {
    DOMElements.sidebar.classList.add('open');
    DOMElements.mainContent.classList.add('blurred-content'); // Add a class for styling blur/overlay
    // Create an overlay to close sidebar on click outside
    const overlay = document.createElement('div');
    overlay.id = 'sidebar-overlay';
    overlay.classList.add('fixed', 'inset-0', 'bg-black', 'bg-opacity-50', 'z-40', 'md:hidden');
    overlay.addEventListener('click', closeSidebar);
    document.body.appendChild(overlay);
}

/**
 * Closes the sidebar for mobile views.
 */
function closeSidebar() {
    DOMElements.sidebar.classList.remove('open');
    DOMElements.mainContent.classList.remove('blurred-content');
    const overlay = document.getElementById('sidebar-overlay');
    if (overlay) {
        overlay.remove();
    }
}

// --- Onboarding Tour Logic ---
let onboardingCurrentStep = 0;
let onboardingHighlightTimeout = null; // To clear previous highlight timeouts

export function startOnboardingTour() {
    const onboardingStatus = getOnboardingStatus();
    onboardingCurrentStep = onboardingStatus.step;

    if (onboardingStatus.completed) {
        DOMElements.onboardingOverlay.classList.add('hidden');
        showView('dashboard'); // Go to dashboard if onboarding is done
        return;
    }

    DOMElements.onboardingOverlay.classList.remove('hidden');
    displayOnboardingStep(onboardingCurrentStep);

    DOMElements.onboardingNextBtn.onclick = () => {
        onboardingCurrentStep++;
        updateOnboardingStatus({ step: onboardingCurrentStep });
        if (onboardingCurrentStep < GAME_CONSTANTS.ONBOARDING_STEPS.length) {
            displayOnboardingStep(onboardingCurrentStep);
        } else {
            // End of onboarding
            updateOnboardingStatus({ completed: true });
            DOMElements.onboardingOverlay.classList.add('hidden');
            showView('dashboard'); // Default view after onboarding
            showNotification('Onboarding complete! Your adventure begins!', 'success');
        }
    };
}

function displayOnboardingStep(stepIndex) {
    const step = GAME_CONSTANTS.ONBOARDING_STEPS[stepIndex];
    if (!step) return;

    DOMElements.onboardingTitle.textContent = step.title;
    DOMElements.onboardingText.textContent = step.text;

    // Reset highlight
    DOMElements.onboardingHighlight.classList.add('hidden');
    if (onboardingHighlightTimeout) {
        clearTimeout(onboardingHighlightTimeout);
    }

    if (step.highlightId) {
        const targetElement = document.getElementById(step.highlightId);
        if (targetElement) {
            const targetRect = targetElement.getBoundingClientRect();
            const modalRect = DOMElements.onboardingModal.getBoundingClientRect();

            // Position highlight relative to the document
            DOMElements.onboardingHighlight.style.width = `${targetRect.width}px`;
            DOMElements.onboardingHighlight.style.height = `${targetRect.height}px`;
            DOMElements.onboardingHighlight.style.left = `${targetRect.left}px`;
            DOMElements.onboardingHighlight.style.top = `${targetRect.top}px`;
            DOMElements.onboardingHighlight.classList.remove('hidden');

            // Adjust modal position to not overlap highlight too much, or center
            const screenHeight = window.innerHeight;
            if (targetRect.top + targetRect.height + modalRect.height + 20 > screenHeight) {
                // If modal would go off screen below, position it above
                DOMElements.onboardingModal.style.top = `${targetRect.top - modalRect.height - 20}px`;
            } else {
                // Position below
                DOMElements.onboardingModal.style.top = `${targetRect.bottom + 20}px`;
            }
            DOMElements.onboardingModal.style.left = `${targetRect.left + targetRect.width / 2 - modalRect.width / 2}px`;
            DOMElements.onboardingModal.style.transform = `none`; // Remove transform if manually positioning

            // Ensure modal is within bounds after positioning
            if (parseFloat(DOMElements.onboardingModal.style.top) < 0) DOMElements.onboardingModal.style.top = '20px';
            if (parseFloat(DOMElements.onboardingModal.style.left) < 0) DOMElements.onboardingModal.style.left = '20px';
            if (parseFloat(DOMElements.onboardingModal.style.left) + modalRect.width > window.innerWidth) DOMElements.onboardingModal.style.left = `${window.innerWidth - modalRect.width - 20}px`;

            DOMElements.onboardingModal.style.position = 'fixed'; // Ensure it's fixed for precise positioning

            // Set a timeout to re-render the highlight if window resizes during onboarding
            onboardingHighlightTimeout = setTimeout(() => {
                window.addEventListener('resize', () => displayOnboardingStep(stepIndex), { once: true });
            }, 500); // Small delay
        }
    } else {
         // Re-center modal if no highlight
        DOMElements.onboardingModal.style.position = 'absolute';
        DOMElements.onboardingModal.style.top = '50%';
        DOMElements.onboardingModal.style.left = '50%';
        DOMElements.onboardingModal.style.transform = `translate(-50%, -50%)`;
    }

    // Execute action if defined (e.g., switch view)
    if (step.action) {
        // Use a small timeout to allow UI to render before action
        setTimeout(() => {
            eval(step.action); // DANGEROUS IN REAL-WORLD, BUT OK FOR LOCAL JS APP.
                              // In a real app, use a map of functions: { "showView": (view) => showView(view) }
                              // and call `actionMap[step.action.name](step.action.param)`
        }, 300);
    }
}

// Ensure the global window object has access to uiManager functions needed by onboarding eval()
window.uiManager = {
    showView: showView,
};

// Placeholder for gameLogic (will be defined in gameLogic.js)
// This is to prevent errors when uiManager tries to call gameLogic functions prematurely
let gameLogic = {
    purchaseItem: (itemId) => console.log(`[UI] Purchase requested for ${itemId}`),
    learnSkill: (subject, skillId) => console.log(`[UI] Learn skill requested for ${subject}:${skillId}`),
    resetGame: () => console.log(`[UI] Reset game requested.`),
    applyTheme: (themeId) => {
        const selectedTheme = THEMES.find(t => t.id === themeId);
        if (!selectedTheme) return;

        const currentSettings = getSettings();
        const previousThemeId = currentSettings.currentTheme;
        const previousTheme = THEMES.find(t => t.id === previousThemeId);

        // Remove old theme classes
        if (previousTheme) {
            for (const key in previousTheme.cssClasses) {
                if (DOMElements[key]) {
                    DOMElements[key].classList.remove(...previousTheme.cssClasses[key].split(' ').filter(cls => cls));
                } else if (key === 'body') {
                    document.body.classList.remove(...previousTheme.cssClasses.body.split(' ').filter(cls => cls));
                }
            }
        }

        // Add new theme classes
        for (const key in selectedTheme.cssClasses) {
            if (DOMElements[key]) {
                 // Special handling for appContainer gradient - replace
                 if (key === 'appContainer') {
                    DOMElements[key].classList.forEach(cls => {
                        if (cls.startsWith('from-') || cls.startsWith('to-') || cls.startsWith('bg-gradient-')) {
                            DOMElements[key].classList.remove(cls);
                        }
                    });
                 }
                DOMElements[key].classList.add(...selectedTheme.cssClasses[key].split(' ').filter(cls => cls));
            } else if (key === 'body') {
                document.body.classList.add(...selectedTheme.cssClasses.body.split(' ').filter(cls => cls));
            }
        }

        // Also ensure dark mode is correctly applied on top of the theme
        if (currentSettings.darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }

        updateSettings({ currentTheme: themeId });
    }
};

/**
 * Sets the gameLogic module reference for UI interactions.
 * This is a common pattern for circular dependencies or to ensure modules are fully loaded.
 * @param {object} gl - The gameLogic module.
 */
export function setGameLogic(gl) {
    gameLogic = gl;
}
