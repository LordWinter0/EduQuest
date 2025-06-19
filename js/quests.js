// js/quests.js

/**
 * @fileoverview Defines all the quests available in the EduQuest application.
 * Quests include main story arcs, side activities, and daily challenges.
 * Each quest has properties like ID, title, description, subject, XP/gold rewards,
 * due dates, and flags for tracking progress and completion.
 */

import { GAME_CONSTANTS } from './constants.js';

export const QUESTS = [
    // --- ONBOARDING / INTRODUCTORY QUESTS ---
    {
        id: 'onboarding_customize_avatar',
        title: 'First Steps: Customize Your Scholar',
        description: 'Personalize your avatar and choose a name to begin your journey!',
        type: GAME_CONSTANTS.QUEST_TYPES.MAIN,
        subject: null, // No specific subject
        xpReward: 20,
        goldReward: 10,
        dueDate: null, // No strict due date
        prerequisites: [], // No prerequisites
        isRepeatable: false,
        isHidden: true, // This quest is managed by the onboarding system
        completionCondition: {
            type: 'avatar_customized', // Special condition for avatar customization
            targetValue: 1, // Any customization counts as completion
        },
        progress: 0, // Current progress
        targetProgress: 1, // Required progress for completion
        isCompleted: false,
        dateCompleted: null,
    },
    {
        id: 'onboarding_explore_dashboard',
        title: 'Exploration: Your Hub of Knowledge',
        description: 'Familiarize yourself with your Scholar Dashboard to see your progress.',
        type: GAME_CONSTANTS.QUEST_TYPES.MAIN,
        subject: null,
        xpReward: 15,
        goldReward: 5,
        dueDate: null,
        prerequisites: ['onboarding_customize_avatar'],
        isRepeatable: false,
        isHidden: true,
        completionCondition: {
            type: 'view_visited',
            targetValue: 'dashboard', // Visit dashboard view
        },
        progress: 0,
        targetProgress: 1,
        isCompleted: false,
        dateCompleted: null,
    },
    {
        id: 'onboarding_check_quests',
        title: 'The Call to Adventure: Check Your Quest Log',
        description: 'Head to the Quest Log to see your first assignments and challenges.',
        type: GAME_CONSTANTS.QUEST_TYPES.MAIN,
        subject: null,
        xpReward: 15,
        goldReward: 5,
        dueDate: null,
        prerequisites: ['onboarding_explore_dashboard'],
        isRepeatable: false,
        isHidden: true,
        completionCondition: {
            type: 'view_visited',
            targetValue: 'quests', // Visit quests view
        },
        progress: 0,
        targetProgress: 1,
        isCompleted: false,
        dateCompleted: null,
    },
    // --- MAIN QUESTS ---
    {
        id: 'math_fundamentals_1',
        title: 'Algebraic Ascent: Foundations',
        description: 'Conquer the basics of algebraic expressions and equations.',
        type: GAME_CONSTANTS.QUEST_TYPES.MAIN,
        subject: GAME_CONSTANTS.SUBJECTS.MATH,
        xpReward: 100,
        goldReward: 25,
        dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(), // Due in 7 days
        prerequisites: [],
        isRepeatable: false,
        isChained: true, // Part of a quest chain
        chain: 'algebraic_ascent',
        stage: 1,
        completionCondition: {
            type: 'quiz_score',
            targetValue: 70, // Score 70% or more on Algebra Fundamentals quiz
            quizId: 'algebra_quiz_1', // Reference to a specific quiz
        },
        progress: 0,
        targetProgress: 1,
        isCompleted: false,
        dateCompleted: null,
    },
    {
        id: 'math_fundamentals_2',
        title: 'Algebraic Ascent: Solving Equations',
        description: 'Master solving linear equations with single variables.',
        type: GAME_CONSTANTS.QUEST_TYPES.MAIN,
        subject: GAME_CONSTANTS.SUBJECTS.MATH,
        xpReward: 120,
        goldReward: 30,
        dueDate: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString(), // Due in 14 days
        prerequisites: ['math_fundamentals_1'],
        isRepeatable: false,
        isChained: true,
        chain: 'algebraic_ascent',
        stage: 2,
        completionCondition: {
            type: 'problems_solved',
            targetValue: 10, // Solve 10 specific problems
            problemSetId: 'algebra_problems_2',
        },
        progress: 0,
        targetProgress: 10,
        isCompleted: false,
        dateCompleted: null,
    },
    {
        id: 'history_ancient_civilizations',
        title: 'Echoes of the Past: Ancient Empires',
        description: 'Explore the rise and fall of ancient civilizations.',
        type: GAME_CONSTANTS.QUEST_TYPES.MAIN,
        subject: GAME_CONSTANTS.SUBJECTS.HISTORY,
        xpReward: 110,
        goldReward: 20,
        dueDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
        prerequisites: [],
        isRepeatable: false,
        completionCondition: {
            type: 'reading_completed',
            targetValue: 'ancient_civ_textbook', // Read a specific section or textbook
        },
        progress: 0,
        targetProgress: 1,
        isCompleted: false,
        dateCompleted: null,
    },
    {
        id: 'science_scientific_method',
        title: 'Scientific Pursuit: The Core Process',
        description: 'Understand and apply the scientific method in a practical experiment.',
        type: GAME_CONSTANTS.QUEST_TYPES.MAIN,
        subject: GAME_CONSTANTS.SUBJECTS.SCIENCE,
        xpReward: 130,
        goldReward: 35,
        dueDate: new Date(new Date().setDate(new Date().getDate() + 20)).toISOString(),
        prerequisites: [],
        isRepeatable: false,
        completionCondition: {
            type: 'project_submission',
            targetValue: 'scientific_method_report', // Submit a report/project
        },
        progress: 0,
        targetProgress: 1,
        isCompleted: false,
        dateCompleted: null,
    },
    // --- SIDE QUESTS ---
    {
        id: 'math_practice_decimals',
        title: 'Decimal Drills: Quick Calculations',
        description: 'Practice your decimal addition and subtraction skills.',
        type: GAME_CONSTANTS.QUEST_TYPES.SIDE,
        subject: GAME_CONSTANTS.SUBJECTS.MATH,
        xpReward: 30,
        goldReward: 5,
        dueDate: null,
        prerequisites: [],
        isRepeatable: true, // Can be repeated for more XP/gold
        completionCondition: {
            type: 'problems_solved',
            targetValue: 20,
            problemSetId: 'decimal_practice_set',
        },
        progress: 0,
        targetProgress: 20,
        isCompleted: false,
        dateCompleted: null,
    },
    {
        id: 'english_vocabulary_builder',
        title: 'Word Weaver: Expand Your Lexicon',
        description: 'Learn 10 new vocabulary words and their definitions.',
        type: GAME_CONSTANTS.QUEST_TYPES.SIDE,
        subject: GAME_CONSTANTS.SUBJECTS.ENGLISH,
        xpReward: 40,
        goldReward: 8,
        dueDate: null,
        prerequisites: [],
        isRepeatable: true,
        completionCondition: {
            type: 'flashcards_mastered',
            targetValue: 10,
            flashcardSetId: 'vocabulary_set_1',
        },
        progress: 0,
        targetProgress: 10,
        isCompleted: false,
        dateCompleted: null,
    },
    {
        id: 'art_sketch_challenge',
        title: 'Artistic Expression: Daily Sketch',
        description: 'Create a quick sketch inspired by a prompt (e.g., "a floating island").',
        type: GAME_CONSTANTS.QUEST_TYPES.SIDE,
        subject: GAME_CONSTANTS.SUBJECTS.ART,
        xpReward: 25,
        goldReward: 7,
        dueDate: null,
        prerequisites: [],
        isRepeatable: true,
        completionCondition: {
            type: 'user_action', // Requires user to mark as complete, or upload (placeholder)
            targetValue: 'sketch_done',
        },
        progress: 0,
        targetProgress: 1,
        isCompleted: false,
        dateCompleted: null,
    },
    // --- DAILY QUESTS (generated daily, reset on completion or next day) ---
    // These quests will typically be generated dynamically by gameLogic based on a template,
    // but we can define their base structure here.
    {
        id: 'daily_math_review',
        title: 'Daily Drill: Math Review',
        description: 'Solve 5 quick math problems to keep your skills sharp.',
        type: GAME_CONSTANTS.QUEST_TYPES.DAILY,
        subject: GAME_CONSTANTS.SUBJECTS.MATH,
        xpReward: 20,
        goldReward: 5,
        dueDate: null, // Handled by daily reset logic
        prerequisites: [],
        isRepeatable: true, // Can be done once per day
        completionCondition: {
            type: 'problems_solved',
            targetValue: 5,
            problemSetId: 'daily_math_set', // Dynamic problem set
        },
        progress: 0,
        targetProgress: 5,
        isCompleted: false,
        dateCompleted: null,
    },
    {
        id: 'daily_read_article',
        title: 'Daily Digest: Read an Article',
        description: 'Read a short educational article on a random topic.',
        type: GAME_CONSTANTS.QUEST_TYPES.DAILY,
        subject: null, // Can be random or general
        xpReward: 25,
        goldReward: 6,
        dueDate: null,
        prerequisites: [],
        isRepeatable: true,
        completionCondition: {
            type: 'reading_completed',
            targetValue: 'daily_article',
        },
        progress: 0,
        targetProgress: 1,
        isCompleted: false,
        dateCompleted: null,
    },
    {
        id: 'daily_study_focus',
        title: 'Daily Focus: Study for 15 Minutes',
        description: 'Spend 15 minutes focusing on any subject of your choice.',
        type: GAME_CONSTANTS.QUEST_TYPES.DAILY,
        subject: null,
        xpReward: 30,
        goldReward: 7,
        dueDate: null,
        prerequisites: [],
        isRepeatable: true,
        completionCondition: {
            type: 'time_spent',
            targetValue: 15, // Time in minutes
            trackingSubject: null, // Track any subject
        },
        progress: 0,
        targetProgress: 15,
        isCompleted: false,
        dateCompleted: null,
    },
    // --- BATTLE-RELATED QUESTS (for future expansion) ---
    {
        id: 'battle_misconception_quadratic',
        title: 'Concept Battle: Quadratic Guardian',
        description: 'Challenge the misconception around quadratic equations.',
        type: GAME_CONSTANTS.QUEST_TYPES.MAIN, // Can be a main quest or side
        subject: GAME_CONSTANTS.SUBJECTS.MATH,
        xpReward: 150,
        goldReward: 40,
        dueDate: null,
        prerequisites: ['math_fundamentals_2'],
        isRepeatable: false,
        isHidden: false,
        completionCondition: {
            type: 'battle_won',
            targetValue: 'quadratic_equation_guardian',
        },
        progress: 0,
        targetProgress: 1,
        isCompleted: false,
        dateCompleted: null,
    },
    // --- EXAMPLE QUEST CHAIN ---
    {
        id: 'literary_journey_1',
        title: 'Literary Journey: Introduction to Narrative',
        description: 'Explore the elements of a compelling story structure.',
        type: GAME_CONSTANTS.QUEST_TYPES.MAIN,
        subject: GAME_CONSTANTS.SUBJECTS.ENGLISH,
        xpReward: 80,
        goldReward: 15,
        dueDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
        prerequisites: [],
        isRepeatable: false,
        isChained: true,
        chain: 'literary_journey',
        stage: 1,
        completionCondition: {
            type: 'quiz_score',
            targetValue: 60,
            quizId: 'narrative_elements_quiz',
        },
        progress: 0,
        targetProgress: 1,
        isCompleted: false,
        dateCompleted: null,
    },
    {
        id: 'literary_journey_2',
        title: 'Literary Journey: Character Development',
        description: 'Analyze how characters are built and evolve in literature.',
        type: GAME_CONSTANTS.QUEST_TYPES.MAIN,
        subject: GAME_CONSTANTS.SUBJECTS.ENGLISH,
        xpReward: 90,
        goldReward: 20,
        dueDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
        prerequisites: ['literary_journey_1'],
        isRepeatable: false,
        isChained: true,
        chain: 'literary_journey',
        stage: 2,
        completionCondition: {
            type: 'writing_task',
            targetValue: 'character_analysis_paragraph',
            wordCount: 150,
        },
        progress: 0,
        targetProgress: 1,
        isCompleted: false,
        dateCompleted: null,
    },
    {
        id: 'literary_journey_3_branch_a', // Example of a branching quest
        title: 'Literary Journey: Poetry Analysis',
        description: 'Delve into the nuances of poetic devices and forms.',
        type: GAME_CONSTANTS.QUEST_TYPES.SIDE, // Can be a main quest if it's a major fork
        subject: GAME_CONSTANTS.SUBJECTS.ENGLISH,
        xpReward: 110,
        goldReward: 25,
        dueDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(),
        prerequisites: ['literary_journey_2'],
        isRepeatable: false,
        isChained: true,
        chain: 'literary_journey',
        stage: 3,
        branch: 'poetry', // This quest is part of the 'poetry' branch
        completionCondition: {
            type: 'reading_completed',
            targetValue: 'poetry_anthology_section',
        },
        progress: 0,
        targetProgress: 1,
        isCompleted: false,
        dateCompleted: null,
    },
    {
        id: 'literary_journey_3_branch_b', // Example of another branch
        title: 'Literary Journey: Prose & Novel Study',
        description: 'Analyze the structure and themes of a short novel or novella.',
        type: GAME_CONSTANTS.QUEST_TYPES.SIDE,
        subject: GAME_CONSTANTS.SUBJECTS.ENGLISH,
        xpReward: 110,
        goldReward: 25,
        dueDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(),
        prerequisites: ['literary_journey_2'],
        isRepeatable: false,
        isChained: true,
        chain: 'literary_journey',
        stage: 3,
        branch: 'prose', // This quest is part of the 'prose' branch
        completionCondition: {
            type: 'reading_completed',
            targetValue: 'short_novel_study',
        },
        progress: 0,
        targetProgress: 1,
        isCompleted: false,
        dateCompleted: null,
    },
];

// Function to get daily quests for a given day (example of how it might work)
export function getDailyQuestsForToday() {
    // In a real app, this would check localStorage for last daily reset date
    // and potentially regenerate if it's a new day.
    // For now, it just returns the daily quest templates.
    return QUESTS.filter(quest => quest.type === GAME_CONSTANTS.QUEST_TYPES.DAILY);
}
