// js/shopItems.js

/**
 * @fileoverview Defines all the items available for purchase in the Scholar's Emporium.
 * Items can include avatar customization parts, temporary power-ups, virtual study
 * space decorations, and crafting blueprints. Each item has a unique ID, name,
 * description, type, cost, and potentially effects or associated data.
 */

// Import necessary constants if any, like item types
// import { GAME_CONSTANTS } from './constants.js';

export const SHOP_ITEMS = [
    // --- AVATAR GEAR ---
    {
        id: 'avatar_robe_blue',
        name: 'Blue Scholar Robe',
        description: 'A classic blue robe for the aspiring scholar.',
        type: 'avatar_gear',
        category: 'top', // Specifies which avatar part it replaces/equips
        cost: 20,
        icon: 'fas fa-tshirt', // Font Awesome icon for display in shop
        assetId: 'robe_blue', // Reference to an asset in avatars.js
        isLimitedOffer: false,
    },
    {
        id: 'avatar_glasses_round',
        name: 'Round Glasses',
        description: 'Look extra studious with these spectacles.',
        type: 'avatar_gear',
        category: 'accessory',
        cost: 15,
        icon: 'fas fa-glasses',
        assetId: 'glasses_round',
        isLimitedOffer: false,
    },
    {
        id: 'avatar_hair_spiky',
        name: 'Spiky Hairdo',
        description: 'For scholars with a sharp mind and sharp style.',
        type: 'avatar_gear',
        category: 'hair',
        cost: 25,
        icon: 'fas fa-cut',
        assetId: 'hair_spiky',
        isLimitedOffer: true, // Example of a limited offer item
    },
    {
        id: 'avatar_hat_wizard',
        name: 'Wizard Hat',
        description: 'Don the cap of a true knowledge wizard!',
        type: 'avatar_gear',
        category: 'head',
        cost: 50,
        icon: 'fas fa-hat-wizard',
        assetId: 'hat_wizard',
        isLimitedOffer: false,
    },
    // --- POWER-UPS ---
    {
        id: 'powerup_xp_boost_small',
        name: 'Small XP Potion',
        description: 'Grants +20% bonus XP on your next completed quest.',
        type: 'power_up',
        cost: 30,
        icon: 'fas fa-flask',
        effect: {
            type: 'xp_boost',
            value: 0.20, // 20% bonus
            duration: 1, // Applies to next single quest
        },
        isLimitedOffer: false,
    },
    {
        id: 'powerup_focus_elixir',
        name: 'Focus Elixir',
        description: 'Instantly restores 50 Focus Meter points.',
        type: 'power_up',
        cost: 40,
        icon: 'fas fa-mug-hot',
        effect: {
            type: 'focus_restore',
            value: 50,
        },
        isLimitedOffer: false,
    },
    {
        id: 'powerup_quiz_hint',
        name: 'Quiz Hint Scroll',
        description: 'Reveals a hint for one question in a concept battle or quiz.',
        type: 'power_up',
        cost: 25,
        icon: 'fas fa-lightbulb',
        effect: {
            type: 'quiz_hint',
            value: 1, // Provides one hint
        },
        isLimitedOffer: true, // Could be a limited-time valuable item
    },
    // --- STUDY DECORATIONS ---
    {
        id: 'deco_globe',
        name: 'Ancient Globe',
        description: 'A vintage globe to inspire your geography quests.',
        type: 'decoration',
        cost: 35,
        icon: 'fas fa-globe-americas',
        assetId: 'decoration_globe', // Reference to a visual asset
        isLimitedOffer: false,
    },
    {
        id: 'deco_bookshelf',
        name: 'Towering Bookshelf',
        description: 'Fill your virtual space with endless knowledge!',
        type: 'decoration',
        cost: 60,
        icon: 'fas fa-book-reader',
        assetId: 'decoration_bookshelf',
        isLimitedOffer: false,
    },
    {
        id: 'deco_plant_small',
        name: 'Potted Plant',
        description: 'Adds a touch of nature and tranquility to your study area.',
        type: 'decoration',
        cost: 10,
        icon: 'fas fa-leaf',
        assetId: 'decoration_plant_small',
        isLimitedOffer: false,
    },
    // --- BLUEPRINTS (for crafting system - future expansion) ---
    {
        id: 'blueprint_advanced_compass',
        name: 'Blueprint: Advanced Compass',
        description: 'Allows you to craft the "Advanced Compass" item (reduces quest completion time).',
        type: 'blueprint',
        cost: 80,
        icon: 'fas fa-compass',
        craftsItemId: 'crafted_advanced_compass', // ID of the item this blueprint crafts
        materialsNeeded: [ // Example materials needed
            { id: 'logic_fragment', quantity: 5 },
            { id: 'metal_scrap', quantity: 3 },
        ],
        isLimitedOffer: false,
    },
    {
        id: 'blueprint_speed_quill',
        name: 'Blueprint: Speed Quill',
        description: 'Allows you to craft the "Speed Quill" item (boosts writing quest progress).',
        type: 'blueprint',
        cost: 70,
        icon: 'fas fa-feather-alt',
        craftsItemId: 'crafted_speed_quill',
        materialsNeeded: [
            { id: 'narrative_thread', quantity: 4 },
            { id: 'feather', quantity: 2 },
        ],
        isLimitedOffer: true, // Could be a rare blueprint on offer
    },
];

// Helper function to get shop items by category
export function getShopItemsByCategory(category) {
    return SHOP_ITEMS.filter(item => item.type === category);
}

// Helper function to get limited offer items
export function getLimitedOfferItems() {
    return SHOP_ITEMS.filter(item => item.isLimitedOffer);
}

// Helper function to get a shop item by ID
export function getShopItemById(id) {
    return SHOP_ITEMS.find(item => item.id === id);
}
