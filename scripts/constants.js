/**
 * Module-based constants
 */
export const MODULE = {
    ID: 'token-action-hud-twodsix'
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
    utility: 'tokenActionHud.utility'
}

/**
 * Groups
 */
export const GROUP = {
    armor: { id: 'armor', name: 'tokenActionHud.twodsix.armor', type: 'system' },
    equipment: { id: 'equipment', name: 'tokenActionHud.twodsix.equipment', type: 'system' },
    consumables: { id: 'consumables', name: 'tokenActionHud.twodsix.consumables', type: 'system' },
    containers: { id: 'containers', name: 'tokenActionHud.twodsix.containers', type: 'system' },
    treasure: { id: 'treasure', name: 'tokenActionHud.twodsix.treasure', type: 'system' },
    weapons: { id: 'weapons', name: 'tokenActionHud.twodsix.weapons', type: 'system' },
    combat: { id: 'combat', name: 'tokenActionHud.combat', type: 'system' },
    token: { id: 'token', name: 'tokenActionHud.token', type: 'system' },
    utility: { id: 'utility', name: 'tokenActionHud.utility', type: 'system' }
}

/**
 * Item types
 */
export const ITEM_TYPE = {
    armor: { groupId: 'armor' },
    backpack: { groupId: 'containers' },
    consumable: { groupId: 'consumables' },
    equipment: { groupId: 'equipment' },
    treasure: { groupId: 'treasure' },
    weapon: { groupId: 'weapons' }
}
