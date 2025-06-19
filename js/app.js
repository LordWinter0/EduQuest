// js/app.js

/**
 * @fileoverview Main entry point for the EduQuest application.
 * This script initializes all other modules (data management, UI, game logic)
 * and sets up the initial state and event listeners for the entire application.
 */

import { initializeGameData } from './dataManager.js';
import { initializeUILoaders, startOnboardingTour, showView } from './uiManager.js';
import gameLogic from './gameLogic.js'; // Import the default exported gameLogic object
import { GAME_CONSTANTS } from './constants.js';

/**
 * Initializes the entire EduQuest application.
 * This function is called when the DOM is fully loaded.
 */
function initializeApp() {
    console.log('Initializing EduQuest Application...');

    // 1. Initialize all game data (loads from localStorage or sets defaults)
    initializeGameData();

    // 2. Initialize UI components and attach basic event listeners (e.g., navigation)
    initializeUILoaders();

    // 3. Initialize core game logic (starts intervals, applies theme, checks daily resets)
    //    The gameLogic module internally calls uiManager.setGameLogic(gameLogic) to resolve circular dependencies.
    gameLogic.initializeGameLogic();

    // 4. Start the onboarding tour if it hasn't been completed, otherwise show dashboard
    const onboardingStatus = gameLogic.getOnboardingStatus(); // Use gameLogic's getOnboardingStatus
    if (!onboardingStatus.completed) {
        startOnboardingTour();
    } else {
        // If onboarding is complete, ensure the UI is fully rendered for the current state
        // and then show the default dashboard view.
        gameLogic.applyTheme(GAME_CONSTANTS.DEFAULT_SETTINGS.currentTheme); // Apply stored theme
        gameLogic.checkAndApplyDarkMode(); // Apply dark mode
        showView('dashboard'); // Default view after onboarding
    }

    console.log('EduQuest Application Initialized!');
}

// Ensure the DOM is fully loaded before initializing the app
document.addEventListener('DOMContentLoaded', initializeApp);

