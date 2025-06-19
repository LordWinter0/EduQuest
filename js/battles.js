// js/battles.js

/**
 * @fileoverview Defines the structure and content for "Concept Battles" and quizzes
 * within the EduQuest application. This includes various types of challenges,
 * questions, correct answers, and potential hints.
 */

import { GAME_CONSTANTS } from './constants.js';

export const BATTLES = {
    // --- QUIZZES (used for quest completion conditions) ---
    algebra_quiz_1: {
        id: 'algebra_quiz_1',
        name: 'Algebra Fundamentals Quiz',
        subject: GAME_CONSTANTS.SUBJECTS.MATH,
        type: 'quiz',
        description: 'Test your understanding of basic algebraic expressions.',
        questions: [
            {
                id: 'q1_algebra_1',
                text: 'What is the value of \'x\' in the equation: $2x + 5 = 15$?',
                options: ['A) 5', 'B) 10', 'C) 2', 'D) 7'],
                correctAnswer: 'A) 5',
                explanation: 'Subtract 5 from both sides: $2x = 10$. Then divide by 2: $x = 5$.',
                hint: 'First, isolate the term with \'x\'.',
            },
            {
                id: 'q2_algebra_1',
                text: 'Simplify the expression: $3a + 2b - a + 4b$',
                options: ['A) $3a + 6b$', 'B) $2a + 6b$', 'C) $4a + 2b$', 'D) $2a + 2b$'],
                correctAnswer: 'B) $2a + 6b$',
                explanation: 'Combine like terms: $(3a - a) + (2b + 4b) = 2a + 6b$.',
                hint: 'Group the \'a\' terms together and the \'b\' terms together.',
            },
            {
                id: 'q3_algebra_1',
                text: 'If $y = 3x - 1$, what is $y$ when $x = 4$?',
                options: ['A) 11', 'B) 12', 'C) 13', 'D) 10'],
                correctAnswer: 'A) 11',
                explanation: 'Substitute $x=4$ into the equation: $y = 3(4) - 1 = 12 - 1 = 11$.',
                hint: 'Replace the variable with its given value.',
            },
            {
                id: 'q4_algebra_1',
                text: 'Solve for p: $p/3 = 7$',
                options: ['A) 21', 'B) 10', 'C) 4', 'D) 14'],
                correctAnswer: 'A) 21',
                explanation: 'Multiply both sides by 3: $p = 7 \times 3 = 21$.',
                hint: 'What is the opposite operation of division?',
            },
            {
                id: 'q5_algebra_1',
                text: 'Which expression is equivalent to $4(x + 2)$?',
                options: ['A) $4x + 2$', 'B) $x + 8$', 'C) $4x + 8$', 'D) $6x$'],
                correctAnswer: 'C) $4x + 8$',
                explanation: 'Use the distributive property: $4 \times x + 4 \times 2 = 4x + 8$.',
                hint: 'Remember to multiply the number outside the parentheses by *both* terms inside.',
            },
        ],
    },
    narrative_elements_quiz: {
        id: 'narrative_elements_quiz',
        name: 'Narrative Elements Quiz',
        subject: GAME_CONSTANTS.SUBJECTS.ENGLISH,
        type: 'quiz',
        description: 'Identify key components of storytelling.',
        questions: [
            {
                id: 'q1_narrative_1',
                text: 'What is the term for the main problem or struggle in a story?',
                options: ['A) Setting', 'B) Character', 'C) Conflict', 'D) Resolution'],
                correctAnswer: 'C) Conflict',
                explanation: 'Conflict is the central struggle between two opposing forces in a story.',
                hint: 'It\'s what drives the plot forward and creates tension.',
            },
            {
                id: 'q2_narrative_1',
                text: 'The time and place in which a story happens is called the:',
                options: ['A) Plot', 'B) Theme', 'C) Setting', 'D) Climax'],
                correctAnswer: 'C) Setting',
                explanation: 'The setting establishes where and when the story takes place.',
                hint: 'Think about when and where you are right now.',
            },
        ],
    },
    // --- CONCEPT BATTLES (more interactive, possibly with "health" bars) ---
    quadratic_equation_guardian: {
        id: 'quadratic_equation_guardian',
        name: 'Guardian of Quadratics',
        subject: GAME_CONSTANTS.SUBJECTS.MATH,
        type: 'battle',
        description: 'Defeat the Guardian of Quadratics by solving problems and understanding concepts.',
        bossHealth: 100, // Example boss health
        stages: [
            {
                stageName: 'Factoring Fundamentals',
                questions: [
                    {
                        id: 'bq1_quad_1',
                        text: 'Factor the expression: $x^2 + 5x + 6$',
                        options: ['A) $(x+2)(x+3)$', 'B) $(x+1)(x+6)$', 'C) $(x-2)(x-3)$', 'D) $(x+5)(x+1)$'],
                        correctAnswer: 'A) $(x+2)(x+3)$',
                        explanation: 'Find two numbers that multiply to 6 and add to 5.',
                        hint: 'Look for two numbers that sum to the middle coefficient and multiply to the last term.',
                        damage: 20, // Damage dealt to boss on correct answer
                    },
                    {
                        id: 'bq2_quad_1',
                        text: 'What are the roots of $x^2 - 4 = 0$?',
                        options: ['A) 2', 'B) -2', 'C) $\pm 2$', 'D) 4'],
                        correctAnswer: 'C) $\pm 2$',
                        explanation: 'This is a difference of squares. $(x-2)(x+2) = 0$, so $x=2$ or $x=-2$.',
                        hint: 'Consider both positive and negative solutions for the square root.',
                        damage: 25,
                    },
                ],
            },
            {
                stageName: 'Quadratic Formula Application',
                questions: [
                    {
                        id: 'bq3_quad_2',
                        text: 'Use the quadratic formula to solve $x^2 + x - 2 = 0$. (Hint: $x = [-b \pm \sqrt{b^2-4ac}] / 2a$)',
                        options: ['A) $x=1, x=-2$', 'B) $x=-1, x=2$', 'C) $x=1, x=2$', 'D) $x=-1, x=-2$'],
                        correctAnswer: 'A) $x=1, x=-2$',
                        explanation: 'For $a=1, b=1, c=-2$: $x = [-1 \pm \sqrt{1^2-4(1)(-2)}] / 2(1) = [-1 \pm \sqrt{1+8}] / 2 = [-1 \pm \sqrt{9}] / 2 = [-1 \pm 3] / 2$. So $x = 2/2 = 1$ or $x = -4/2 = -2$.',
                        hint: 'Carefully substitute the values of a, b, and c into the formula.',
                        damage: 30,
                    },
                ],
            },
            // More stages can be added
        ],
    },
};

// Helper function to get a battle/quiz by ID
export function getBattleById(battleId) {
    return BATTLES[battleId] || null;
}

// Function to generate a random daily math problem set
export function generateDailyMathProblems(numProblems = 5) {
    const problems = [];
    const availableProblems = BATTLES.algebra_quiz_1.questions; // Using existing quiz questions as a source

    // Simple random selection (ensure no duplicates for small numProblems)
    while (problems.length < numProblems && problems.length < availableProblems.length) {
        const randomIndex = Math.floor(Math.random() * availableProblems.length);
        const problem = availableProblems[randomIndex];
        if (!problems.some(p => p.id === problem.id)) { // Avoid duplicates
            problems.push(problem);
        }
    }
    return problems;
}

// Function to check if a quest's completion condition is met
// This is a placeholder and will be called by gameLogic.js
export function checkCompletionCondition(questCondition, playerData, currentProgress) {
    switch (questCondition.type) {
        case 'quiz_score':
            // For a quiz, `currentProgress` might be the score achieved (0-100)
            return currentProgress >= questCondition.targetValue;
        case 'problems_solved':
            // `currentProgress` is the count of problems solved
            return currentProgress >= questCondition.targetValue;
        case 'reading_completed':
            // `currentProgress` is a boolean or a count of sections read
            return currentProgress >= questCondition.targetValue;
        case 'project_submission':
            // `currentProgress` is a boolean indicating submission
            return currentProgress >= questCondition.targetValue;
        case 'battle_won':
            // `currentProgress` is a boolean indicating battle won
            return currentProgress >= questCondition.targetValue;
        case 'user_action':
            // For simple tasks, user manually marks complete
            return currentProgress >= questCondition.targetValue;
        case 'time_spent':
            // `currentProgress` is time spent in minutes
            return currentProgress >= questCondition.targetValue;
        case 'avatar_customized':
            // `currentProgress` is a boolean or 1 if customized
            return currentProgress >= questCondition.targetValue;
        case 'view_visited':
            // `currentProgress` is a boolean or 1 if visited
            return currentProgress >= questCondition.targetValue;
        default:
            return false;
    }
}
