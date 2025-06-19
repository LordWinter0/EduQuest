// js/themes.js

/**
 * @fileoverview Defines the various visual themes for the EduQuest application.
 * Each theme specifies a unique set of CSS classes and/or background styles
 * that will be applied to the body and main containers to change the app's appearance.
 * Themes can also be unlocked or purchased in the game.
 */

// Import necessary constants if any, for example, if themes reference avatar parts or specific game elements
// import { GAME_CONSTANTS } from './constants.js';

export const THEMES = [
    {
        id: 'default',
        name: 'Default Academy',
        description: 'The classic look of the EduQuest Academy.',
        isUnlocked: true, // Default theme is always unlocked
        cost: 0,
        cssClasses: {
            body: '', // No specific body class for default, handled by base CSS
            appContainer: 'from-blue-600 to-purple-700',
            sidebar: 'bg-gray-800',
            playerSummary: 'bg-gray-700',
            avatarDisplay: 'bg-gray-600 border-yellow-400 text-gray-400',
            navButtonActive: 'bg-gray-700',
            viewBackground: 'bg-white',
            dashboardCardBlue: 'bg-blue-100 border-blue-200 text-blue-800',
            dashboardCardYellow: 'bg-yellow-100 border-yellow-200 text-yellow-800',
            dashboardCardGreen: 'bg-green-100 border-green-200 text-green-800',
            dashboardCardPurple: 'bg-purple-100 border-purple-200 text-purple-800',
            dashboardCardIndigo: 'bg-indigo-100 border-indigo-200 text-indigo-800',
            dashboardCardRed: 'bg-red-100 border-red-200 text-red-800',
            shopItemCard: 'bg-white',
            calendarDay: 'bg-gray-50 border-gray-200',
            calendarDayCurrentMonth: 'bg-white',
            skillNode: 'bg-blue-100 border-blue-400',
            skillNodeUnlocked: 'bg-green-100 border-green-400',
            skillNodeActive: 'bg-yellow-100 border-yellow-400',
        }
    },
    {
        id: 'fantasy',
        name: 'Enchanted Forest',
        description: 'Transform your academy into a magical, ancient woodland.',
        isUnlocked: false, // This theme needs to be unlocked or purchased
        cost: 200, // Example cost in gold
        cssClasses: {
            body: '',
            appContainer: 'from-green-700 to-teal-800', // Darker, earthy gradient
            sidebar: 'bg-green-900',
            playerSummary: 'bg-green-800',
            avatarDisplay: 'bg-green-700 border-yellow-500 text-green-300',
            navButtonActive: 'bg-green-800',
            viewBackground: 'bg-green-50', // Lighter earthy tone for content
            dashboardCardBlue: 'bg-blue-200 border-blue-300 text-blue-900', // Adjusted for fantasy palette
            dashboardCardYellow: 'bg-yellow-200 border-yellow-300 text-yellow-900',
            dashboardCardGreen: 'bg-green-200 border-green-300 text-green-900',
            dashboardCardPurple: 'bg-purple-200 border-purple-300 text-purple-900',
            dashboardCardIndigo: 'bg-indigo-200 border-indigo-300 text-indigo-900',
            dashboardCardRed: 'bg-red-200 border-red-300 text-red-900',
            shopItemCard: 'bg-green-100',
            calendarDay: 'bg-emerald-50 border-emerald-200',
            calendarDayCurrentMonth: 'bg-white',
            skillNode: 'bg-lime-100 border-lime-400',
            skillNodeUnlocked: 'bg-emerald-100 border-emerald-400',
            skillNodeActive: 'bg-amber-100 border-amber-400',
        }
    },
    {
        id: 'sci-fi',
        name: 'Cosmic Nexus',
        description: 'Immerse yourself in a futuristic, space-age learning environment.',
        isUnlocked: false,
        cost: 250, // Example cost
        cssClasses: {
            body: '',
            appContainer: 'from-gray-900 to-indigo-900', // Dark, cosmic gradient
            sidebar: 'bg-gray-950',
            playerSummary: 'bg-gray-900',
            avatarDisplay: 'bg-gray-800 border-cyan-400 text-gray-500',
            navButtonActive: 'bg-gray-900',
            viewBackground: 'bg-gray-800', // Dark content areas
            dashboardCardBlue: 'bg-blue-900 border-blue-800 text-blue-200', // Darker cards, lighter text
            dashboardCardYellow: 'bg-yellow-900 border-yellow-800 text-yellow-200',
            dashboardCardGreen: 'bg-green-900 border-green-800 text-green-200',
            dashboardCardPurple: 'bg-purple-900 border-purple-800 text-purple-200',
            dashboardCardIndigo: 'bg-indigo-900 border-indigo-800 text-indigo-200',
            dashboardCardRed: 'bg-red-900 border-red-800 text-red-200',
            shopItemCard: 'bg-gray-700',
            calendarDay: 'bg-gray-700 border-gray-600',
            calendarDayCurrentMonth: 'bg-gray-800',
            skillNode: 'bg-blue-700 border-blue-500',
            skillNodeUnlocked: 'bg-emerald-700 border-emerald-500',
            skillNodeActive: 'bg-amber-700 border-amber-500',
        }
    }
    // Add more themes as desired
];
