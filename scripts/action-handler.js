// System Module Imports
import { ACTION_TYPE, ITEM_TYPE } from './constants.js'
import { Utils } from './utils.js'

export let ActionHandler = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    /**
     * Extends Token Action HUD Core's ActionHandler class and builds system-defined actions for the HUD
     */
    ActionHandler = class ActionHandler extends coreModule.api.ActionHandler {
        /**
         * Build system actions
         * Called by Token Action HUD Core
         * @override
         * @param {array} groupIds
         */
        async buildSystemActions (groupIds) {
            // Set actor and token variables
            this.actors = (!this.actor) ? this._getActors() : [this.actor]
            this.actorType = this.actor?.type

            // Settings
            this.displayUnequipped = Utils.getSetting('displayUnequipped')
            this.sortByType = Utils.getSetting('sortByType')

            // Set items variable
            if (this.actor) {
                let items = this.actor.items
                items = coreModule.api.Utils.sortItemsByName(items)
                this.items = items
            }

            if (['traveller', 'robot', 'animal'].includes(this.actorType)) {
                this.#buildCharacterActions()
            } /* else if (!this.actor) {
                this.#buildMultipleTokenActions()
            } */
        }

        /**
         * Build character actions
         * @private
         */
        #buildCharacterActions () {
            this.#buildInventory()
            this.#buildCharacteristics()
        }

        /**
         * Build multiple token actions
         * @private
         * @returns {object}
         */
        #buildMultipleTokenActions () {
        }

        /**
         * Build inventory
         * @private
         */
        async #buildInventory () {
            if (this.items.size === 0) return

            const actionTypeId = 'item'
            const inventoryMap = new Map()

            for (const [itemId, itemData] of this.items) {
                let type = itemData.type
                const equipped = (itemData.system.equipped === 'equipped' || ['skills', 'trait', 'spells'].includes(itemData.type))

                if (equipped || this.displayUnequipped) {
                    if (!equipped && !this.sortByType) {
                        type = itemData.system.equipped
                    }
                    const typeMap = inventoryMap.get(type) ?? new Map()
                    typeMap.set(itemId, itemData)
                    inventoryMap.set(type, typeMap)
                }
            }

            for (const [type, typeMap] of inventoryMap) {
                const groupId = ITEM_TYPE[type]?.groupId

                if (!groupId) continue

                const groupData = { id: groupId, type: 'system' }

                // Get actions
                const actions = [...typeMap].map(([itemId, itemData]) => {
                    const id = itemId
                    const name = itemData.name
                    const actionTypeName = coreModule.api.Utils.i18n(ACTION_TYPE[actionTypeId])
                    const listName = `${actionTypeName ? `${actionTypeName}: ` : ''}${name}`
                    const encodedValue = [actionTypeId, id].join(this.delimiter)
                    const img = itemData.img

                    return {
                        id,
                        name,
                        img,
                        listName,
                        encodedValue
                    }
                })

                // TAH Core method to add actions to the action list
                this.addActions(actions, groupData)
            }
        }

        /**
         * Build characteristics
         * @private
         */
        async #buildCharacteristics () {
            const actionTypeId = 'characteristics'
            const groupData = { id: 'characteristics', type: 'system' }
            // const charShown = game.settings.get('twodsix', 'showAlternativeCharacteristics')

            // Get actions
            const actions = []
            for (const char in this.actor.system.characteristics) {
                const id = char
                const name = this.actor.system.characteristics[char].displayShortLabel
                const actionTypeName = coreModule.api.Utils.i18n(ACTION_TYPE[actionTypeId])
                const listName = `${actionTypeName ? `${actionTypeName}: ` : ''}${name}`
                const encodedValue = [actionTypeId, id].join(this.delimiter)
                if (shouldDisplayChar(id)) {
                    actions.push({
                        id,
                        name,
                        listName,
                        encodedValue
                    })
                }
            }
            // TAH Core method to add actions to the action list
            this.addActions(actions, groupData)
        }
    }
})

function shouldDisplayChar (char) {
    const charsShown = game.settings.get('twodsix', 'showAlternativeCharacteristics')
    switch (char) {
    case 'strength':
        return true
    case 'dexterity':
        return true
    case 'endurance':
        return true
    case 'intelligence':
        return true
    case 'education':
        return true
    case 'socialStanding':
        return true
    case 'psionicStrength':
        return charsShown !== 'alternate'
    case 'alternative1':
        return charsShown !== 'base'
    case 'alternative2':
        return charsShown !== 'base'
    case 'lifeblood':
        return false
    case 'stamina':
        return false
    default:
        return false
    }
}
