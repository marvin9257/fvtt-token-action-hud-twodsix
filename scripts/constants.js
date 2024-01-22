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
export const REQUIRED_CORE_MODULE_VERSION = '1.5'

/**
 * Action types
 */
export const ACTION_TYPE = {
    item: 'tokenActionHud.twodsix.item',
    characteristics: 'TWODSIX.Damage.Characteristics',
    utility: 'tokenActionHud.utility',
    shipPosition: 'TYPES.Item.ship_position'
}

/**
 * Groups
 */
export const GROUP = {
    armor: { id: 'armor', name: 'TYPES.Item.armor', type: 'system' },
    augment: { id: 'augment', name: 'TYPES.Item.augmentPl', type: 'system' },
    characteristics: { id: 'characteristics', name: 'TWODSIX.Damage.Characteristics', type: 'system' },
    equipment: { id: 'equipment', name: 'TYPES.Item.equipmentPl', type: 'system' },
    consumable: { id: 'consumable', name: 'TYPES.Item.consumablePl', type: 'system' },
    backpack: { id: 'backpack', name: 'TWODSIX.Actor.Items.LocationState.backpack', type: 'system' },
    ship: { id: 'ship', name: 'TWODSIX.Actor.Items.LocationState.ship', type: 'system' },
    base: { id: 'base', name: 'TWODSIX.Actor.Items.LocationState.base', type: 'system' },
    vehicle: { id: 'vehicle', name: 'TWODSIX.Actor.Items.LocationState.vehicle', type: 'system' },
    skills: { id: 'skills', name: 'TYPES.Item.skillPl', type: 'system' },
    spell: { id: 'spell', name: 'TYPES.Item.spellPl', type: 'system' },
    weapons: { id: 'weapons', name: 'TYPES.Item.weaponPl', type: 'system' },
    combat: { id: 'combat', name: 'tokenActionHud.combat', type: 'system' },
    token: { id: 'token', name: 'tokenActionHud.token', type: 'system' },
    tool: { id: 'tool', name: 'TYPES.Item.toolPl', type: 'system' },
    trait: { id: 'trait', name: 'TYPES.Item.traitPl', type: 'system' },
    utility: { id: 'utility', name: 'tokenActionHud.utility', type: 'system' },
    shipPosition: { id: 'shipPosition', name: 'TYPES.Item.ship_positionPl', type: 'system' },
    shipActions: { id: 'shipActions', name: 'Ship Actions', type: 'system' }
}

/**
 * Item types
 */
export const ITEM_TYPE = {
    armor: { groupId: 'armor' },
    augment: { groupId: 'augment' },
    backpack: { groupId: 'backpack' },
    consumable: { groupId: 'consumable' },
    computer: { groupId: 'equipment' },
    equipment: { groupId: 'equipment' },
    ship: { groupId: 'ship' },
    vehicle: { groupId: 'vehicle' },
    base: { groupId: 'base' },
    skills: { groupId: 'skills' },
    spell: { groupId: 'spell' },
    treasure: { groupId: 'treasure' },
    trait: { groupId: 'trait' },
    tool: { groupId: 'equipment' },
    junk: { groupId: 'equipment' },
    weapon: { groupId: 'weapons' },
    shipPosition: { groupId: 'shipPosition' }
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
    alternative2: 'ALT2',
    alternative3: 'ALT3'
}
