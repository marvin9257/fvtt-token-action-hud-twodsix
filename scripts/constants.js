/**
 * Module-based constants
 */
export const MODULE = {
    ID: 'fvtt-token-action-hud-twodsix'
}

/**
 * Core module
 */
export const CORE_MODULE = {
    ID: 'token-action-hud-core'
}

/**
 * Core module version required by the system module
 */
export const REQUIRED_CORE_MODULE_VERSION = '1.4'

/**
 * Action types
 */
export const ACTION_TYPE = {
    item: 'tokenActionHud.twodsix.item',
    characteristic: 'tokenActionHud.twodsix.characteristic',
    utility: 'tokenActionHud.utility'
}

/**
 * Groups
 */
export const GROUP = {
    armor: { id: 'armor', name: 'tokenActionHud.twodsix.armor', type: 'system' },
    augment: { id: 'augment', name: 'tokenActionHud.twodsix.augment', type: 'system' },
    characteristics: { id: 'characteristics', name: 'tokenActionHud.twodsix.characteristics', type: 'system' },
    equipment: { id: 'equipment', name: 'tokenActionHud.twodsix.equipment', type: 'system' },
    consumable: { id: 'consumable', name: 'tokenActionHud.twodsix.consumables', type: 'system' },
    containers: { id: 'containers', name: 'tokenActionHud.twodsix.containers', type: 'system' },
    skills: { id: 'skills', name: 'tokenActionHud.twodsix.skills', type: 'system' },
    spell: { id: 'spell', name: 'tokenActionHud.twodsix.spell', type: 'system' },
    treasure: { id: 'treasure', name: 'tokenActionHud.twodsix.treasure', type: 'system' },
    weapons: { id: 'weapons', name: 'tokenActionHud.twodsix.weapons', type: 'system' },
    combat: { id: 'combat', name: 'tokenActionHud.combat', type: 'system' },
    token: { id: 'token', name: 'tokenActionHud.token', type: 'system' },
    tool: { id: 'tool', name: 'tokenActionHud.twodsix.tool', type: 'system' },
    trait: { id: 'trait', name: 'tokenActionHud.twodsix.trait', type: 'system' },
    utility: { id: 'utility', name: 'tokenActionHud.utility', type: 'system' }
}

/**
 * Item types
 */
export const ITEM_TYPE = {
    armor: { groupId: 'armor' },
    augment: { groupId: 'augment' },
    backpack: { groupId: 'containers' },
    consumable: { groupId: 'consumables' },
    computer: { groupId: 'equipment' },
    equipment: { groupId: 'equipment' },
    skills: { groupId: 'skills' },
    spell: { groupId: 'spell' },
    treasure: { groupId: 'treasure' },
    trait: { groupId: 'trait' },
    tool: { groupId: 'equipment' },
    junk: { groupId: 'equipment' },
    weapon: { groupId: 'weapons' }
}

/**
 * Characteristics
 */
export const CHARACTERISTICS = {
    strength: 'STR',
    dexterity: 'DEX',
    endurance: 'END',
    intelligence: 'INT',
    education: 'EDU',
    socialStanding: 'SOC',
    psionicStrength: 'PSI',
    stamina: 'STA',
    lifeblood: 'LFB',
    alternative1: 'ALT1',
    alternative2: 'ALT2'
}
