// js/skills.js

/**
 * @fileoverview Defines the skill trees for different subjects in EduQuest.
 * Each subject has a tree of skills (nodes) that students can unlock using skill points.
 * Skills can be passive (always active) or active (usable abilities).
 * This file also defines the connections between skills for rendering the tree.
 */

import { GAME_CONSTANTS } from './constants.js';

export const SKILL_TREES = {
    [GAME_CONSTANTS.SUBJECTS.MATH]: {
        name: GAME_CONSTANTS.SUBJECTS.MATH,
        description: 'Master numerical logic and problem-solving.',
        icon: 'fas fa-calculator',
        nodes: [
            {
                id: 'math_basic_arithmetic',
                name: 'Basic Arithmetic',
                description: 'Increases accuracy in fundamental calculations.',
                type: 'passive',
                cost: 1, // Skill points cost
                prerequisites: [], // No prerequisites for starter skill
                effects: [{ type: 'accuracy_bonus', target: GAME_CONSTANTS.SUBJECTS.MATH, value: 0.05 }],
                position: { x: 200, y: 50 }, // For visual rendering on a canvas or div
            },
            {
                id: 'math_algebra_basics',
                name: 'Algebra Fundamentals',
                description: 'Unlocks understanding of basic equations.',
                type: 'passive',
                cost: 2,
                prerequisites: ['math_basic_arithmetic'],
                effects: [{ type: 'xp_bonus', target: GAME_CONSTANTS.SUBJECTS.MATH, value: 0.10 }],
                position: { x: 200, y: 150 },
            },
            {
                id: 'math_geometry_intro',
                name: 'Intro to Geometry',
                description: 'Grants insight into shapes and spatial reasoning.',
                type: 'passive',
                cost: 2,
                prerequisites: ['math_basic_arithmetic'],
                effects: [{ type: 'xp_bonus', target: GAME_CONSTANTS.SUBJECTS.MATH, value: 0.10 }],
                position: { x: 100, y: 150 },
            },
            {
                id: 'math_equation_mastery',
                name: 'Equation Mastery',
                description: 'Significantly improves speed in solving complex equations. (Active Skill)',
                type: 'active',
                cost: 3,
                prerequisites: ['math_algebra_basics'],
                effects: [{ type: 'speed_boost', target: GAME_CONSTANTS.SUBJECTS.MATH, value: 0.20 }],
                position: { x: 200, y: 250 },
                cooldown: 3600000, // 1 hour cooldown in ms
            },
            {
                id: 'math_problem_solver',
                name: 'Analytical Solver',
                description: 'Provides a hint for one difficult math problem per quest. (Active Skill)',
                type: 'active',
                cost: 3,
                prerequisites: ['math_algebra_basics', 'math_geometry_intro'], // Requires both branches
                effects: [{ type: 'hint_per_quest', target: GAME_CONSTANTS.SUBJECTS.MATH, value: 1 }],
                position: { x: 150, y: 250 },
                cooldown: 7200000, // 2 hour cooldown in ms
            },
            {
                id: 'math_data_analysis',
                name: 'Data Interpretation',
                description: 'Boosts understanding of statistics and data sets.',
                type: 'passive',
                cost: 4,
                prerequisites: ['math_equation_mastery'],
                effects: [{ type: 'xp_bonus', target: GAME_CONSTANTS.SUBJECTS.MATH, value: 0.15 }],
                position: { x: 200, y: 350 },
            },
        ],
        // Defines the visual connections between nodes
        // format: { from: 'skill_id_A', to: 'skill_id_B' }
        connections: [
            { from: 'math_basic_arithmetic', to: 'math_algebra_basics' },
            { from: 'math_basic_arithmetic', to: 'math_geometry_intro' },
            { from: 'math_algebra_basics', to: 'math_equation_mastery' },
            { from: 'math_algebra_basics', to: 'math_problem_solver' },
            { from: 'math_geometry_intro', to: 'math_problem_solver' },
            { from: 'math_equation_mastery', to: 'math_data_analysis' },
        ],
    },
    [GAME_CONSTANTS.SUBJECTS.ENGLISH]: {
        name: GAME_CONSTANTS.SUBJECTS.ENGLISH,
        description: 'Cultivate your communication and literary prowess.',
        icon: 'fas fa-pen-nib',
        nodes: [
            {
                id: 'eng_vocab_builder',
                name: 'Vocabulary Builder',
                description: 'Increases efficiency in learning new words.',
                type: 'passive',
                cost: 1,
                prerequisites: [],
                effects: [{ type: 'vocab_gain_speed', target: GAME_CONSTANTS.SUBJECTS.ENGLISH, value: 0.10 }],
                position: { x: 200, y: 50 },
            },
            {
                id: 'eng_sentence_structure',
                name: 'Sentence Structure',
                description: 'Improves clarity and grammar in writing.',
                type: 'passive',
                cost: 2,
                prerequisites: ['eng_vocab_builder'],
                effects: [{ type: 'accuracy_bonus', target: GAME_CONSTANTS.SUBJECTS.ENGLISH, value: 0.05 }],
                position: { x: 200, y: 150 },
            },
            {
                id: 'eng_literary_analysis',
                name: 'Literary Analysis',
                description: 'Enhances ability to interpret texts.',
                type: 'passive',
                cost: 2,
                prerequisites: ['eng_vocab_builder'],
                effects: [{ type: 'xp_bonus', target: GAME_CONSTANTS.SUBJECTS.ENGLISH, value: 0.10 }],
                position: { x: 100, y: 150 },
            },
            {
                id: 'eng_essay_structuring',
                name: 'Essay Architect',
                description: 'Provides a framework for complex essay structures. (Active Skill)',
                type: 'active',
                cost: 3,
                prerequisites: ['eng_sentence_structure'],
                effects: [{ type: 'writing_assist', target: GAME_CONSTANTS.SUBJECTS.ENGLISH }],
                position: { x: 200, y: 250 },
                cooldown: 4 * 3600000, // 4 hours
            },
            {
                id: 'eng_crit_reading',
                name: 'Critical Reading',
                description: 'Uncovers hidden meanings and biases in texts.',
                type: 'passive',
                cost: 3,
                prerequisites: ['eng_literary_analysis'],
                effects: [{ type: 'comprehension_bonus', target: GAME_CONSTANTS.SUBJECTS.ENGLISH, value: 0.15 }],
                position: { x: 100, y: 250 },
            },
            {
                id: 'eng_persuasive_writing',
                name: 'Persuasive Voice',
                description: 'Boosts effectiveness of argumentative writing.',
                type: 'passive',
                cost: 4,
                prerequisites: ['eng_essay_structuring', 'eng_crit_reading'],
                effects: [{ type: 'writing_quality_bonus', target: GAME_CONSTANTS.SUBJECTS.ENGLISH, value: 0.20 }],
                position: { x: 150, y: 350 },
            },
        ],
        connections: [
            { from: 'eng_vocab_builder', to: 'eng_sentence_structure' },
            { from: 'eng_vocab_builder', to: 'eng_literary_analysis' },
            { from: 'eng_sentence_structure', to: 'eng_essay_structuring' },
            { from: 'eng_literary_analysis', to: 'eng_crit_reading' },
            { from: 'eng_essay_structuring', to: 'eng_persuasive_writing' },
            { from: 'eng_crit_reading', to: 'eng_persuasive_writing' },
        ],
    },
    [GAME_CONSTANTS.SUBJECTS.SCIENCE]: {
        name: GAME_CONSTANTS.SUBJECTS.SCIENCE,
        description: 'Explore the natural world and scientific principles.',
        icon: 'fas fa-atom',
        nodes: [
            {
                id: 'sci_observation',
                name: 'Keen Observation',
                description: 'Improves data collection in experiments.',
                type: 'passive',
                cost: 1,
                prerequisites: [],
                effects: [{ type: 'data_accuracy_bonus', target: GAME_CONSTANTS.SUBJECTS.SCIENCE, value: 0.05 }],
                position: { x: 200, y: 50 },
            },
            {
                id: 'sci_hypothesis_crafting',
                name: 'Hypothesis Crafting',
                description: 'Formulate testable scientific hypotheses.',
                type: 'passive',
                cost: 2,
                prerequisites: ['sci_observation'],
                effects: [{ type: 'xp_bonus', target: GAME_CONSTANTS.SUBJECTS.SCIENCE, value: 0.10 }],
                position: { x: 200, y: 150 },
            },
            {
                id: 'sci_experiment_design',
                name: 'Experiment Design',
                description: 'Learn to structure effective scientific experiments.',
                type: 'passive',
                cost: 2,
                prerequisites: ['sci_observation'],
                effects: [{ type: 'xp_bonus', target: GAME_CONSTANTS.SUBJECTS.SCIENCE, value: 0.10 }],
                position: { x: 100, y: 150 },
            },
            {
                id: 'sci_analytical_thinking',
                name: 'Analytical Thinking',
                description: 'Unlocks deeper understanding of scientific concepts.',
                type: 'passive',
                cost: 3,
                prerequisites: ['sci_hypothesis_crafting', 'sci_experiment_design'],
                effects: [{ type: 'comprehension_bonus', target: GAME_CONSTANTS.SUBJECTS.SCIENCE, value: 0.15 }],
                position: { x: 150, y: 250 },
            },
            {
                id: 'sci_advanced_research',
                name: 'Advanced Research',
                description: 'Gains access to complex research materials.',
                type: 'passive',
                cost: 4,
                prerequisites: ['sci_analytical_thinking'],
                effects: [{ type: 'xp_bonus', target: GAME_CONSTANTS.SUBJECTS.SCIENCE, value: 0.20 }],
                position: { x: 150, y: 350 },
            },
        ],
        connections: [
            { from: 'sci_observation', to: 'sci_hypothesis_crafting' },
            { from: 'sci_observation', to: 'sci_experiment_design' },
            { from: 'sci_hypothesis_crafting', to: 'sci_analytical_thinking' },
            { from: 'sci_experiment_design', to: 'sci_analytical_thinking' },
            { from: 'sci_analytical_thinking', to: 'sci_advanced_research' },
        ],
    },
    // Add more subject skill trees as needed
};

// Helper function to get a skill node by its ID
export function getSkillNodeById(skillId, subject) {
    if (!subject || !SKILL_TREES[subject]) {
        for (const subj in SKILL_TREES) {
            const node = SKILL_TREES[subj].nodes.find(node => node.id === skillId);
            if (node) return node;
        }
        return null;
    }
    return SKILL_TREES[subject].nodes.find(node => node.id === skillId);
}

// Helper function to get a skill tree by subject name
export function getSkillTreeBySubject(subjectName) {
    return SKILL_TREES[subjectName] || null;
}
