import { GROUP } from './constants.js'
/**
 * Default layout and groups
 */
export let DEFAULTS = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    const groups = GROUP
    Object.values(groups).forEach(group => {
        group.name = coreModule.api.Utils.i18n(group.name)
        group.listName = `Group: ${coreModule.api.Utils.i18n(group.listName ?? group.name)}`
    })
    const groupsArray = Object.values(groups)
    DEFAULTS = {
        layout: [
            {
                nestId: 'inventory',
                id: 'inventory',
                name: coreModule.api.Utils.i18n('TWODSIX.Items.Items.Inventory'),
                groups: [
                    { ...groups.weapons, nestId: 'inventory_weapons' },
                    { ...groups.armor, nestId: 'inventory_armor' },
                    { ...groups.augment, nestId: 'inventory_augment' },
                    { ...groups.equipment, nestId: 'inventory_equipment' },
                    { ...groups.consumable, nestId: 'inventory_consumable' },
                    { ...groups.tool, nestId: 'inventory_tool' },
                    { ...groups.backpack, nestId: 'inventory_backpack' },
                    { ...groups.vehicle, nestId: 'inventory_vehicle' },
                    { ...groups.ship, nestId: 'inventory_ship' },
                    { ...groups.base, nestId: 'inventory_base' }
                ]
            },
            {
                nestId: 'skills',
                id: 'skills',
                name: coreModule.api.Utils.i18n('TYPES.Item.skillPl'),
                groups: [
                    { ...groups.skills, nestId: 'skills_skills' }
                ]
            },
            {
                nestId: 'characteristics',
                id: 'characteristics',
                name: coreModule.api.Utils.i18n('TWODSIX.Damage.Characteristics'),
                groups: [
                    { ...groups.characteristics, nestId: 'characteristics_characteristics' }
                ]
            },
            {
                nestId: 'trait',
                id: 'trait',
                name: coreModule.api.Utils.i18n('TYPES.Item.traitPl'),
                groups: [
                    { ...groups.trait, nestId: 'trait_trait' }
                ]
            },
            {
                nestId: 'psiAbility',
                id: 'psiAbility',
                name: coreModule.api.Utils.i18n('TYPES.Item.psiAbilityPl'),
                groups: [
                    { ...groups.psiAbility, nestId: 'psiAbility_psiAbility' }
                ]
            },
            {
                nestId: 'spell',
                id: 'spell',
                name: coreModule.api.Utils.i18n('TYPES.Item.spellPl'),
                groups: [
                    { ...groups.spell, nestId: 'spell_spell' }
                ]
            },
            {
                nestId: 'shipActions',
                id: 'shipActions',
                name: 'Ship Actions',
                groups: [
                    { ...groups.shipPosition, nestId: 'shipActions_shipPosition' }
                ]
            },
            {
                nestId: 'utility',
                id: 'utility',
                name: coreModule.api.Utils.i18n('tokenActionHud.utility'),
                groups: [
                    { ...groups.combat, nestId: 'utility_combat' },
                    { ...groups.token, nestId: 'utility_token' },
                    { ...groups.rests, nestId: 'utility_rests' },
                    { ...groups.utility, nestId: 'utility_utility' }
                ]
            }
        ],
        groups: groupsArray
    }
})
