import { MODULE } from './constants.js'

/**
 * Register module settings
 * Called by Token Action HUD Core to register Token Action HUD system module settings
 * @param {function} coreUpdate Token Action HUD Core update function
 */
export function register (coreUpdate) {
    game.settings.register(MODULE.ID, 'displayUnequipped', {
        name: game.i18n.localize('tokenActionHud.twodsix.settings.displayUnequipped.name'),
        hint: game.i18n.localize('tokenActionHud.twodsix.settings.displayUnequipped.hint'
        ),
        scope: 'client',
        config: true,
        type: Boolean,
        default: true,
        onChange: (value) => {
            coreUpdate(value)
        }
    })
    game.settings.register(MODULE.ID, 'sortByType', {
        name: game.i18n.localize('tokenActionHud.twodsix.settings.sortByType.name'),
        hint: game.i18n.localize('tokenActionHud.twodsix.settings.sortByType.hint'
        ),
        scope: 'client',
        config: true,
        type: Boolean,
        default: false,
        onChange: (value) => {
            coreUpdate(value)
        }
    })
}
