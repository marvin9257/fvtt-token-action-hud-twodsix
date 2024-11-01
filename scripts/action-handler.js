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
            } else if (this.actorType === 'ship') {
                await this.#buildShipPositions()
            }
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
        #buildInventory () {
            if (this.items.size === 0) return

            const actionTypeId = 'item'
            const inventoryMap = new Map()

            for (const [itemId, itemData] of this.items) {
                let type = itemData.type
                const equipped = (itemData.system.equipped === 'equipped' || ['skills', 'trait', 'spell', 'psiAbility'].includes(itemData.type))

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
         * Return first selected actor when multiple are selected - kludge fix for not handling multiple actors
         * @private
         * @returns {object}
         */
        _getActors () {
            return this.actors?.[0] ?? undefined
        }

        /**
         * Build characteristics
         * @private
         */
        #buildCharacteristics () {
            const actionTypeId = 'characteristics'
            const groupData = { id: 'characteristics', type: 'system' }
            // const charShown = game.settings.get('twodsix', 'showAlternativeCharacteristics')

            // Get actions
            const actions = []
            for (const char in this.actor.system.characteristics) {
                if (shouldDisplayChar(char)) {
                    const id = char
                    const name = this.actor.system.characteristics[char].displayShortLabel
                    const actionTypeName = coreModule.api.Utils.i18n(ACTION_TYPE[actionTypeId])
                    const listName = `${actionTypeName ? `${actionTypeName}: ` : ''}${name}`
                    const encodedValue = [actionTypeId, id].join(this.delimiter)
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

        /**
        * Build ship positions
        * @private
        */
        #buildShipPositions () {
            const actionTypeId = 'ship_position'
            const parentGroupData = { id: 'shipPosition', type: 'system' }
            // Get positions
            for (const position of this.actor.itemTypes.ship_position) {
                const newPosition = {
                    id: position.id,
                    name: position.name,
                    listName: `Group: ${position.name}`,
                    type: 'system-derived'
                }
                this.addGroup(newPosition, parentGroupData)
                const actions = []
                for (const shipActionId of Object.keys(position.system.actions)) {
                    const action = position.system.actions[shipActionId]
                    actions.push({
                        id: shipActionId,
                        name: action.name,
                        img: action.icon,
                        encodedValue: [actionTypeId, position.id, shipActionId].join(this.delimiter)
                    })
                }
                this.addActions(actions, newPosition)
            }
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
        return !['alternate', 'core'].includes(charsShown)
    case 'alternative1':
        return !['base', 'core'].includes(charsShown)
    case 'alternative2':
        return !['base', 'core'].includes(charsShown)
    case 'alternative3':
        return ['all'].includes(charsShown)
    case 'lifeblood':
        return false
    case 'stamina':
        return false
    default:
        return false
    }
}

/**
 * Function to return a camel case version of a string
 * @param {string} string to be converted
 * @returns {object} a camel case version of input string
 * @export
 */
export function camelCase (string) {
    return string.trim().toLowerCase().replace(/\W+(.)/g, (m, chr) => chr.toUpperCase())
}
