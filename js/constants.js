// js/constants.js

/**
 * @fileoverview Global constants and configurations for the EduQuest application.
 * This module exports various fixed values, such as XP thresholds, subject names,
 * local storage keys, and game settings, making them easily accessible and manageable.
 */

// Define and export global constants
export const GAME_CONSTANTS = {
    // Player progression
    INITIAL_XP: 0,
    INITIAL_LEVEL: 1,
    INITIAL_GOLD: 50, // Starting gold for new players
    INITIAL_SKILL_POINTS: 0, // Starting skill points
    INITIAL_FOCUS_MAX: 100, // Max value for the focus meter
    FOCUS_REGEN_RATE: 5, // How much focus regenerates per interval (e.g., per hour)
    FOCUS_REGEN_INTERVAL_MS: 3600000, // Interval for focus regeneration in milliseconds (1 hour)
    XP_PER_LEVEL: { // XP required to reach the next level
        1: 100,
        2: 250,
        3: 500,
        4: 800,
        5: 1200,
        6: 1700,
        7: 2300,
        8: 3000,
        9: 3800,
        10: 4700,
        // ... extend as needed
    },
    SKILL_POINTS_PER_LEVEL: 1, // Skill points gained per level up

    // Subjects and their display names
    SUBJECTS: {
        MATH: 'Mathematics',
        SCIENCE: 'Science',
        HISTORY: 'History',
        ENGLISH: 'English',
        ART: 'Arts & Creativity',
        LOGIC: 'Logic & Critical Thinking', // For skill tree specialization
        PHYSICS: 'Physics', // Example for deeper subjects
        CHEMISTRY: 'Chemistry',
        BIOLOGY: 'Biology',
        GEOGRAPHY: 'Geography',
        LITERATURE: 'Literature',
        WRITING: 'Writing',
    },

    // Local Storage Keys
    LS_KEYS: {
        PLAYER_DATA: 'eduquest_playerData',
        QUEST_DATA: 'eduquest_questData',
        INVENTORY_DATA: 'eduquest_inventoryData',
        SETTINGS_DATA: 'eduquest_settingsData',
        CALENDAR_EVENTS: 'eduquest_calendarEvents',
        SKILL_DATA: 'eduquest_skillData',
        AVATAR_DATA: 'eduquest_avatarData',
        ONBOARDING_STATUS: 'eduquest_onboardingStatus',
        SHOP_LAST_REFRESH: 'eduquest_shopLastRefresh', // Timestamp for shop offers
    },

    // Shop Configuration
    LIMITED_OFFER_REFRESH_INTERVAL_MS: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    RESPEC_SKILLS_COST: 50, // Gold cost to reset skill points

    // Quest Types
    QUEST_TYPES: {
        MAIN: 'main',
        SIDE: 'side',
        DAILY: 'daily',
        STUDY_BLOCK: 'study_block', // For calendar events
    },

    // Avatar configuration
    AVATAR_PART_LAYERS: ['body', 'head', 'eyes', 'mouth', 'hair', 'top', 'bottom', 'accessory'], // Order of rendering layers for avatar
    AVATAR_DEFAULT_NAME: 'Young Scholar',

    // Notification durations
    NOTIFICATION_DURATION_MS: 3000, // How long notifications stay on screen

    // Onboarding steps
    ONBOARDING_STEPS: [
        {
            title: "Welcome to EduQuest!",
            text: "Embark on an epic quest to master knowledge and become the ultimate scholar!",
            highlightId: null, // No specific element highlighted initially
            action: null
        },
        {
            title: "Your Scholar Profile",
            text: "This is your personal dashboard. Track your level, XP, and Knowledge Gems here.",
            highlightId: "player-summary",
            action: null
        },
        {
            title: "Navigation & Views",
            text: "Use the sidebar to explore different sections: Quests, Shop, Calendar, and more.",
            highlightId: "sidebar",
            action: null
        },
        {
            title: "The Quest Log",
            text: "Your assignments and tasks are now Quests! Complete them to earn rewards.",
            highlightId: "quests-view",
            action: "showView('quests')"
        },
        {
            title: "The Scholar's Emporium",
            text: "Spend your Knowledge Gems on cool avatar gear, power-ups, and study decorations!",
            highlightId: "shop-view",
            action: "showView('shop')"
        },
        {
            title: "Knowledge Tree",
            text: "Unlock powerful skills and passive bonuses by investing your Skill Points in different subjects.",
            highlightId: "knowledge-tree-view",
            action: "showView('knowledge-tree')"
        },
        {
            title: "Customize Your Avatar",
            text: "Make your scholar unique! Change your look and name in the Avatar section.",
            highlightId: "avatar-view",
            action: "showView('avatar')"
        },
        {
            title: "Settings & Options",
            text: "Manage themes, sound, and other game preferences here. You can even reset your progress if needed!",
            highlightId: "settings-view",
            action: "showView('settings')"
        },
        {
            title: "Start Your Journey!",
            text: "You are now ready to begin your EduQuest! Your first quest is to customize your avatar. Good luck!",
            highlightId: null,
            action: "showView('avatar')" // Direct user to avatar customization
        }
    ],

    // Default Settings
    DEFAULT_SETTINGS: {
        darkMode: false,
        musicEnabled: true,
        sfxEnabled: true,
        musicVolume: 0.5, // 0.0 to 1.0
        sfxVolume: 0.75, // 0.0 to 1.0
        dueDateReminders: true,
        performanceMode: false,
        skillAutoAllocate: 'none', // 'none', 'balanced', 'math-focus', etc.
        currentTheme: 'default', // 'default', 'fantasy', 'sci-fi'
    },
};
