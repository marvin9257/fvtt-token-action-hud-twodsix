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
                name: coreModule.api.Utils.i18n('tokenActionHud.twodsix.Inventory'),
                groups: [
                    { ...groups.weapons, nestId: 'inventory_weapons' },
                    { ...groups.armor, nestId: 'inventory_armor' },
                    { ...groups.augment, nestId: 'inventory_augment' },
                    { ...groups.equipment, nestId: 'inventory_equipment' },
                    { ...groups.consumable, nestId: 'inventory_consumable' },
                    { ...groups.tool, nestId: 'inventory_tool' }
                ]
            },
            {
                nestId: 'skills',
                id: 'skills',
                name: coreModule.api.Utils.i18n('tokenActionHud.twodsix.skills'),
                groups: [
                    { ...groups.skills, nestId: 'skills_skills' }
                ]
            },
            {
                nestId: 'trait',
                id: 'trait',
                name: coreModule.api.Utils.i18n('tokenActionHud.twodsix.trait'),
                groups: [
                    { ...groups.trait, nestId: 'trait_trait' }
                ]
            },
            {
                nestId: 'spell',
                id: 'spell',
                name: coreModule.api.Utils.i18n('tokenActionHud.twodsix.spell'),
                groups: [
                    { ...groups.spell, nestId: 'spell_spell' }
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
