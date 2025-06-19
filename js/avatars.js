// js/avatars.js

/**
 * @fileoverview Defines all the customizable avatar parts for the EduQuest application.
 * Each part belongs to a specific category (layer) and has a unique ID, name,
 * and a visual asset identifier (e.g., Font Awesome class, or a path/base64 for images).
 * This data is used for avatar customization and for rendering the player's avatar.
 */

// Import constants if needed, e.g., for layer definitions
import { GAME_CONSTANTS } from './constants.js';

export const AVATAR_PARTS = {
    // Body parts - generally the base layer
    body: [
        {
            id: 'body_default',
            name: 'Default Body',
            icon: 'fas fa-male', // Placeholder icon for a generic body shape
            asset: { type: 'icon', value: 'fas fa-male' }, // How this part is rendered
            isDefault: true,
        },
        {
            id: 'body_athletic',
            name: 'Athletic Build',
            icon: 'fas fa-user',
            asset: { type: 'icon', value: 'fas fa-user' },
            isDefault: false,
            unlockCost: 50, // Example: could be unlocked via achievement or shop
        },
        // More body types (e.g., different genders, body shapes)
    ],
    // Head parts - overall head shape/face base
    head: [
        {
            id: 'head_round',
            name: 'Round Head',
            icon: 'fas fa-circle', // Placeholder
            asset: { type: 'icon', value: 'fas fa-circle' },
            isDefault: true,
        },
        {
            id: 'head_oval',
            name: 'Oval Head',
            icon: 'fas fa-egg', // Placeholder
            asset: { type: 'icon', value: 'fas fa-egg' },
            isDefault: false,
            unlockCost: 20,
        },
    ],
    // Eyes
    eyes: [
        {
            id: 'eyes_standard',
            name: 'Standard Eyes',
            icon: 'fas fa-eye',
            asset: { type: 'icon', value: 'fas fa-eye' },
            isDefault: true,
        },
        {
            id: 'eyes_sleepy',
            name: 'Sleepy Eyes',
            icon: 'fas fa-moon', // Representing a sleepy look
            asset: { type: 'icon', value: 'fas fa-moon' },
            isDefault: false,
            unlockCost: 10,
        },
        {
            id: 'eyes_sparkle',
            name: 'Sparkling Eyes',
            icon: 'fas fa-star',
            asset: { type: 'icon', value: 'fas fa-star' },
            isDefault: false,
            unlockCost: 30,
        },
    ],
    // Mouth
    mouth: [
        {
            id: 'mouth_smile',
            name: 'Smile',
            icon: 'fas fa-smile',
            asset: { type: 'icon', value: 'fas fa-smile' },
            isDefault: true,
        },
        {
            id: 'mouth_neutral',
            name: 'Neutral',
            icon: 'fas fa-minus', // Representing a straight line mouth
            asset: { type: 'icon', value: 'fas fa-minus' },
            isDefault: false,
            unlockCost: 5,
        },
        {
            id: 'mouth_laugh',
            name: 'Laughing',
            icon: 'fas fa-laugh',
            asset: { type: 'icon', value: 'fas fa-laugh' },
            isDefault: false,
            unlockCost: 15,
        },
    ],
    // Hair
    hair: [
        {
            id: 'hair_short_brown',
            name: 'Short Brown Hair',
            icon: 'fas fa-male', // Generic person for hair
            asset: { type: 'icon', value: 'fas fa-male' },
            isDefault: true,
        },
        {
            id: 'hair_long_blonde',
            name: 'Long Blonde Hair',
            icon: 'fas fa-female', // Generic person for hair
            asset: { type: 'icon', value: 'fas fa-female' },
            isDefault: false,
            unlockCost: 20,
        },
        {
            id: 'hair_spiky', // Matches shop item
            name: 'Spiky Hairdo',
            icon: 'fas fa-bolt', // Representing spiky
            asset: { type: 'icon', value: 'fas fa-bolt' },
            isDefault: false,
            unlockCost: 25,
        },
    ],
    // Top clothing
    top: [
        {
            id: 'top_plain_shirt',
            name: 'Plain Shirt',
            icon: 'fas fa-tshirt',
            asset: { type: 'icon', value: 'fas fa-tshirt' },
            isDefault: true,
        },
        {
            id: 'robe_blue', // Matches shop item
            name: 'Blue Scholar Robe',
            icon: 'fas fa-graduation-cap', // Academic gown icon
            asset: { type: 'icon', value: 'fas fa-graduation-cap' },
            isDefault: false,
            unlockCost: 20, // Should match cost in shopItems.js if bought
        },
        {
            id: 'top_hoodie_green',
            name: 'Green Hoodie',
            icon: 'fas fa-hood-un', // A hood
            asset: { type: 'icon', value: 'fas fa-hood-un' },
            isDefault: false,
            unlockCost: 30,
        },
    ],
    // Bottom clothing
    bottom: [
        {
            id: 'bottom_jeans',
            name: 'Blue Jeans',
            icon: 'fas fa-shoe-prints', // Generic leg icon
            asset: { type: 'icon', value: 'fas fa-shoe-prints' },
            isDefault: true,
        },
        {
            id: 'bottom_skirt',
            name: 'Black Skirt',
            icon: 'fas fa-child', // Generic child icon
            asset: { type: 'icon', value: 'fas fa-child' },
            isDefault: false,
            unlockCost: 15,
        },
    ],
    // Accessories (hats, glasses, etc.)
    accessory: [
        {
            id: 'accessory_none',
            name: 'None',
            icon: 'fas fa-times-circle', // No accessory icon
            asset: { type: 'icon', value: 'fas fa-times-circle' },
            isDefault: true,
        },
        {
            id: 'glasses_round', // Matches shop item
            name: 'Round Glasses',
            icon: 'fas fa-glasses',
            asset: { type: 'icon', value: 'fas fa-glasses' },
            isDefault: false,
            unlockCost: 15, // Should match cost in shopItems.js if bought
        },
        {
            id: 'hat_wizard', // Matches shop item
            name: 'Wizard Hat',
            icon: 'fas fa-hat-wizard',
            asset: { type: 'icon', value: 'fas fa-hat-wizard' },
            isDefault: false,
            unlockCost: 50,
        },
        {
            id: 'accessory_backpack',
            name: 'School Backpack',
            icon: 'fas fa-backpack',
            asset: { type: 'icon', value: 'fas fa-backpack' },
            isDefault: false,
            unlockCost: 25,
        },
    ],
};

// Helper function to get avatar parts by category
export function getAvatarPartsByCategory(category) {
    return AVATAR_PARTS[category] || [];
}

// Helper function to get an avatar part by ID and category
export function getAvatarPartById(partId, category) {
    if (!AVATAR_PARTS[category]) return null;
    return AVATAR_PARTS[category].find(part => part.id === partId);
}

// Function to get the default avatar configuration
export function getDefaultAvatar() {
    const defaultAvatar = {};
    for (const layer of GAME_CONSTANTS.AVATAR_PART_LAYERS) {
        const defaultPart = AVATAR_PARTS[layer]?.find(part => part.isDefault);
        if (defaultPart) {
            defaultAvatar[layer] = defaultPart.id;
        } else if (AVATAR_PARTS[layer]?.length > 0) {
            // Fallback to the first item if no default is explicitly marked
            defaultAvatar[layer] = AVATAR_PARTS[layer][0].id;
        }
    }
    return defaultAvatar;
}
