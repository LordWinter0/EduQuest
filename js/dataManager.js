// js/dataManager.js

/**
 * @fileoverview Manages all interactions with localStorage for the EduQuest application.
 * This module provides functions to save, load, and clear various types of game data,
 * ensuring data persistence across sessions for the single-player experience.
 */

import { GAME_CONSTANTS } from './constants.js';
import { QUESTS } from './quests.js'; // Import original quest data for initialization
import { SHOP_ITEMS } from './shopItems.js'; // Import shop items for inventory check
import { SKILL_TREES } from './skills.js'; // Import skill trees for initialization
import { AVATAR_PARTS, getDefaultAvatar } from './avatars.js'; // Import avatar parts for initialization
import { THEMES } from './themes.js'; // Import themes for initialization

// Default player data structure for new games
const DEFAULT_PLAYER_DATA = {
    name: GAME_CONSTANTS.AVATAR_DEFAULT_NAME,
    level: GAME_CONSTANTS.INITIAL_LEVEL,
    xp: GAME_CONSTANTS.INITIAL_XP,
    gold: GAME_CONSTANTS.INITIAL_GOLD,
    skillPoints: GAME_CONSTANTS.INITIAL_SKILL_POINTS,
    focus: GAME_CONSTANTS.INITIAL_FOCUS_MAX,
    lastFocusRegen: new Date().toISOString(), // Timestamp for last focus regeneration calculation
    subjects: Object.values(GAME_CONSTANTS.SUBJECTS).reduce((acc, subject) => {
        acc[subject] = { xp: 0, level: 0 }; // Initialize XP for each subject
        return acc;
    }, {}),
    achievements: [], // Array of achievement IDs
    equippedAvatar: getDefaultAvatar(), // Store IDs of equipped avatar parts
};

// Default quest data structure
const DEFAULT_QUEST_DATA = QUESTS.map(quest => ({ ...quest })); // Deep copy original quest data

// Default inventory data structure
const DEFAULT_INVENTORY_DATA = {
    items: [], // Array of { id: 'item_id', quantity: X }
    unlockedThemes: ['default'], // Default theme is always unlocked
    unlockedAvatarParts: (function() {
        const defaultParts = {};
        for (const layer in AVATAR_PARTS) {
            defaultParts[layer] = AVATAR_PARTS[layer]
                .filter(part => part.isDefault || !part.unlockCost) // Include default and free parts
                .map(part => part.id);
        }
        return defaultParts;
    })(),
    unlockedSkills: Object.values(SKILL_TREES).reduce((acc, tree) => {
        acc[tree.name] = tree.nodes.filter(node => node.prerequisites.length === 0 && node.cost === 0).map(node => node.id); // Unlock initial skills with no prereqs/cost
        return acc;
    }, {}),
};

// Default calendar event data
const DEFAULT_CALENDAR_EVENTS = []; // Array of { id, title, date, type, questId? }

// Main player data object (will be loaded from localStorage or initialized)
let playerData = {};
// Main quests array (will be loaded from localStorage or initialized)
let quests = [];
// Main inventory object
let inventory = {};
// Main settings object
let settings = {};
// Main calendar events array
let calendarEvents = [];
// Main skill data (for tracking unlocked skills and skill points spent)
let skillData = {};

/**
 * Saves a specific type of data to localStorage.
 * @param {string} key - The localStorage key (e.g., GAME_CONSTANTS.LS_KEYS.PLAYER_DATA).
 * @param {object|array} data - The data object or array to save.
 */
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        // console.log(`Data saved for key: ${key}`);
    } catch (error) {
        console.error(`Error saving data to localStorage for key ${key}:`, error);
    }
}

/**
 * Loads a specific type of data from localStorage.
 * @param {string} key - The localStorage key.
 * @param {object|array} defaultValue - The default value to return if data is not found.
 * @returns {object|array} The loaded data or the default value.
 */
function loadFromLocalStorage(key, defaultValue) {
    try {
        const data = localStorage.getItem(key);
        if (data === null) {
            // console.log(`No data found for key: ${key}, returning default.`);
            return defaultValue;
        }
        // console.log(`Data loaded for key: ${key}`);
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error loading data from localStorage for key ${key}:`, error);
        // If parsing fails, it might be corrupt data, return default
        return defaultValue;
    }
}

/**
 * Initializes all game data by loading from localStorage or setting defaults.
 */
export function initializeGameData() {
    playerData = loadFromLocalStorage(GAME_CONSTANTS.LS_KEYS.PLAYER_DATA, DEFAULT_PLAYER_DATA);
    quests = loadFromLocalStorage(GAME_CONSTANTS.LS_KEYS.QUEST_DATA, DEFAULT_QUEST_DATA);
    inventory = loadFromLocalStorage(GAME_CONSTANTS.LS_KEYS.INVENTORY_DATA, DEFAULT_INVENTORY_DATA);
    settings = loadFromLocalStorage(GAME_CONSTANTS.LS_KEYS.SETTINGS_DATA, GAME_CONSTANTS.DEFAULT_SETTINGS);
    calendarEvents = loadFromLocalStorage(GAME_CONSTANTS.LS_KEYS.CALENDAR_EVENTS, DEFAULT_CALENDAR_EVENTS);
    skillData = loadFromLocalStorage(GAME_CONSTANTS.LS_KEYS.SKILL_DATA, {
        points: playerData.skillPoints, // Sync skill points with player data initially
        unlockedSkills: DEFAULT_INVENTORY_DATA.unlockedSkills, // Use default initial unlocked skills
        spentPoints: Object.values(SKILL_TREES).reduce((acc, tree) => {
            acc[tree.name] = {}; // Initialize spent points per subject
            return acc;
        }, {})
    });

    // Ensure all existing quests have 'progress' and 'targetProgress' and other new fields if missing
    quests = quests.map(q => ({
        ...q,
        progress: q.progress !== undefined ? q.progress : 0,
        targetProgress: q.targetProgress !== undefined ? q.targetProgress : 1, // Default target progress to 1
        isCompleted: q.isCompleted !== undefined ? q.isCompleted : false,
        dateCompleted: q.dateCompleted !== undefined ? q.dateCompleted : null,
        isChained: q.isChained !== undefined ? q.isChained : false,
        chain: q.chain !== undefined ? q.chain : null,
        stage: q.stage !== undefined ? q.stage : null,
        branch: q.branch !== undefined ? q.branch : null,
        isHidden: q.isHidden !== undefined ? q.isHidden : false,
    }));

    // Ensure all existing inventory items are valid
    inventory.items = inventory.items.filter(item => SHOP_ITEMS.find(shopItem => shopItem.id === item.id));

    // Ensure all default avatar parts are unlocked for new players
    for (const layer in AVATAR_PARTS) {
        AVATAR_PARTS[layer].forEach(part => {
            if (part.isDefault && !inventory.unlockedAvatarParts[layer].includes(part.id)) {
                inventory.unlockedAvatarParts[layer].push(part.id);
            }
        });
    }

    // Ensure all default themes are unlocked
    THEMES.forEach(theme => {
        if (theme.isUnlocked && !inventory.unlockedThemes.includes(theme.id)) {
            inventory.unlockedThemes.push(theme.id);
        }
    });

    // Handle initial onboarding status
    const onboardingStatus = loadFromLocalStorage(GAME_CONSTANTS.LS_KEYS.ONBOARDING_STATUS, { completed: false, step: 0 });
    playerData.onboardingStatus = onboardingStatus;

    console.log('Game Data Initialized:', { playerData, quests, inventory, settings, calendarEvents, skillData });
}

/**
 * Gets the current player data.
 * @returns {object} The current player data.
 */
export function getPlayerData() {
    return playerData;
}

/**
 * Updates player data and saves it to localStorage.
 * @param {object} newData - An object containing properties to update in player data.
 */
export function updatePlayerData(newData) {
    playerData = { ...playerData, ...newData };
    saveToLocalStorage(GAME_CONSTANTS.LS_KEYS.PLAYER_DATA, playerData);
    // console.log('Player Data Updated:', playerData);
}

/**
 * Gets the current quests array.
 * @returns {Array<object>} The current quests array.
 */
export function getQuests() {
    return quests;
}

/**
 * Updates the quests array and saves it to localStorage.
 * @param {Array<object>} newQuests - The updated quests array.
 */
export function updateQuests(newQuests) {
    quests = newQuests;
    saveToLocalStorage(GAME_CONSTANTS.LS_KEYS.QUEST_DATA, quests);
    // console.log('Quests Updated:', quests);
}

/**
 * Gets the current inventory data.
 * @returns {object} The current inventory data.
 */
export function getInventory() {
    return inventory;
}

/**
 * Updates inventory data and saves it to localStorage.
 * @param {object} newInventory - An object containing properties to update in inventory data.
 */
export function updateInventory(newInventory) {
    inventory = { ...inventory, ...newInventory };
    saveToLocalStorage(GAME_CONSTANTS.LS_KEYS.INVENTORY_DATA, inventory);
    // console.log('Inventory Updated:', inventory);
}

/**
 * Gets the current settings data.
 * @returns {object} The current settings data.
 */
export function getSettings() {
    return settings;
}

/**
 * Updates settings data and saves it to localStorage.
 * @param {object} newSettings - An object containing properties to update in settings data.
 */
export function updateSettings(newSettings) {
    settings = { ...settings, ...newSettings };
    saveToLocalStorage(GAME_CONSTANTS.LS_KEYS.SETTINGS_DATA, settings);
    // console.log('Settings Updated:', settings);
}

/**
 * Gets the current calendar events array.
 * @returns {Array<object>} The current calendar events array.
 */
export function getCalendarEvents() {
    return calendarEvents;
}

/**
 * Updates the calendar events array and saves it to localStorage.
 * @param {Array<object>} newEvents - The updated calendar events array.
 */
export function updateCalendarEvents(newEvents) {
    calendarEvents = newEvents;
    saveToLocalStorage(GAME_CONSTANTS.LS_KEYS.CALENDAR_EVENTS, calendarEvents);
    // console.log('Calendar Events Updated:', calendarEvents);
}

/**
 * Gets the current skill data.
 * @returns {object} The current skill data.
 */
export function getSkillData() {
    return skillData;
}

/**
 * Updates skill data and saves it to localStorage.
 * @param {object} newSkillData - An object containing properties to update in skill data.
 */
export function updateSkillData(newSkillData) {
    skillData = { ...skillData, ...newSkillData };
    saveToLocalStorage(GAME_CONSTANTS.LS_KEYS.SKILL_DATA, skillData);
    // console.log('Skill Data Updated:', skillData);
}

/**
 * Gets the current onboarding status.
 * @returns {object} The current onboarding status.
 */
export function getOnboardingStatus() {
    return playerData.onboardingStatus;
}

/**
 * Updates onboarding status and saves it to localStorage.
 * @param {object} newStatus - An object containing properties to update in onboarding status.
 */
export function updateOnboardingStatus(newStatus) {
    playerData.onboardingStatus = { ...playerData.onboardingStatus, ...newStatus };
    saveToLocalStorage(GAME_CONSTANTS.LS_KEYS.ONBOARDING_STATUS, playerData.onboardingStatus);
    // console.log('Onboarding Status Updated:', playerData.onboardingStatus);
}

/**
 * Resets all game data to its default state.
 * This effectively starts a new game.
 */
export function resetGameData() {
    localStorage.removeItem(GAME_CONSTANTS.LS_KEYS.PLAYER_DATA);
    localStorage.removeItem(GAME_CONSTANTS.LS_KEYS.QUEST_DATA);
    localStorage.removeItem(GAME_CONSTANTS.LS_KEYS.INVENTORY_DATA);
    localStorage.removeItem(GAME_CONSTANTS.LS_KEYS.SETTINGS_DATA);
    localStorage.removeItem(GAME_CONSTANTS.LS_KEYS.CALENDAR_EVENTS);
    localStorage.removeItem(GAME_CONSTANTS.LS_KEYS.SKILL_DATA);
    localStorage.removeItem(GAME_CONSTANTS.LS_KEYS.ONBOARDING_STATUS);
    localStorage.removeItem(GAME_CONSTANTS.LS_KEYS.SHOP_LAST_REFRESH);

    // Re-initialize all data to default values
    initializeGameData();
    console.warn('All game data has been reset!');
}

/**
 * Saves the timestamp of the last shop refresh for limited offers.
 */
export function saveShopRefreshTimestamp() {
    const timestamp = new Date().getTime();
    localStorage.setItem(GAME_CONSTANTS.LS_KEYS.SHOP_LAST_REFRESH, timestamp.toString());
}

/**
 * Loads the timestamp of the last shop refresh.
 * @returns {number|null} The timestamp in milliseconds or null if not found.
 */
export function loadShopRefreshTimestamp() {
    const timestampStr = localStorage.getItem(GAME_CONSTANTS.LS_KEYS.SHOP_LAST_REFRESH);
    return timestampStr ? parseInt(timestampStr, 10) : null;
}

