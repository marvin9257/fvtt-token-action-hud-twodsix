
export let RollHandler = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    /**
     * Extends Token Action HUD Core's RollHandler class and handles action events triggered when an action is clicked
     */
    RollHandler = class RollHandler extends coreModule.api.RollHandler {
        /**
         * Handle action click
         * Called by Token Action HUD Core when an action event is left or right-clicked
         * @override
         * @param {object} event        The event
         * @param {string} encodedValue The encoded value
         */
        async handleActionClick (event, encodedValue) {
            const payload = encodedValue.split('|')

            if (payload.length < 2) {
                super.throwInvalidValueErr()
            }

            const actionTypeId = payload[0]
            const actionId = payload[1]

            const renderable = ['item', 'ship_position']

            if (renderable.includes(actionTypeId) && this.isRenderItem()) {
                return this.renderItem(this.actor, actionId)
            }

            if (actionTypeId === 'ship_position') {
                const subActionId = payload[2]
                await this.#handleShipAction(event, this.actor, actionId, subActionId)
            } else {
                const knownCharacters = ['traveller', 'animal', 'robot']

                // If single actor is selected
                if (this.actor) {
                    await this.#handleAction(event, this.actor, this.token, actionTypeId, actionId)
                    return
                }

                const controlledTokens = canvas.tokens.controlled
                    .filter((token) => knownCharacters.includes(token.actor?.type))

                // If multiple actors are selected
                for (const token of controlledTokens) {
                    const actor = token.actor
                    await this.#handleAction(event, actor, token, actionTypeId, actionId)
                }
            }
        }

        /**
         * Handle action hover
         * Called by Token Action HUD Core when an action is hovered on or off
         * @override
         * @param {object} event        The event
         * @param {string} encodedValue The encoded value
         */
        async handleActionHover (event, encodedValue) {}

        /**
         * Handle group click
         * Called by Token Action HUD Core when a group is right-clicked while the HUD is locked
         * @override
         * @param {object} event The event
         * @param {object} group The group
         */
        async handleGroupClick (event, group) {}

        /**
         * Handle action
         * @private
         * @param {object} event        The event
         * @param {object} actor        The actor
         * @param {object} token        The token
         * @param {string} actionTypeId The action type id
         * @param {string} actionId     The actionId
         */
        async #handleAction (event, actor, token, actionTypeId, actionId) {
            switch (actionTypeId) {
            case 'item':
                this.#handleItemAction(event, actor, actionId)
                break
            case 'characteristics':
                this.#handleCharacteristicAction(event, actor, actionId)
                break
            case 'utility':
                this.#handleUtilityAction(token, actionId)
                break
            }
        }

        /**
         * Handle item action
         * @private
         * @param {object} event    The event
         * @param {object} actor    The actor
         * @param {string} actionId The action id
         */
        async #handleItemAction (_event, actor, actionId) {
            const item = actor.items.get(actionId)
            if (item.type === 'trait') {
                await this.#sendToChat(item, false)
            } else if (item.type === 'weapon') {
                item.resolveUnknownAutoMode()
            } else if (item.type === 'psiAbility') {
                let diceRoll
                if (item.actor?.system.characteristics.psionicStrength.current <= 0) {
                    ui.notifications.warn(game.i18n.localize('TWODSIX.Warnings.NoPsiPoints'))
                    return
                } else if (!game.settings.get('twodsix', 'psiTalentsRequireRoll')) {
                    await this.#sendToChat(item, true)
                } else {
                    diceRoll = await item.skillRoll(true)
                }

                if (item.type === 'psiAbility') {
                    await item.processPsiAction(diceRoll?.effect ?? 0)
                }
            } else {
                item.skillRoll(true)
            }
        }

        /**
         * Handle send to chat
         * @private
         * @param {object} item    an item
         * @param {boolean} usedForRoll whether item used for roll
         */
        async #sendToChat (item, usedForRoll) {
            const picture = item.img
            const capType = game.i18n.localize(`TYPES.Item.${item.type}`).capitalize()
            let msg = `<div style="display: inline-flex;"><img src="${picture}" alt="" class="chat-image"></img><span style="align-self: center; text-align: center; padding-left: 1ch;">`
            msg += usedForRoll ? `${game.i18n.localize('TWODSIX.Items.Psionics.Used')} ${capType}: ${item.name}</span></div>` : `<strong>${capType}: ${item.name}</strong></span></div><br>${item.system.description}`
            await ChatMessage.create({ content: msg, speaker: ChatMessage.getSpeaker({ actor: item.actor }) })
        }

        /**
         * Handle characteristic action
         * @private
         * @param {object} event    The event
         * @param {object} actor    The actor
         * @param {string} actionId The action id
         */
        #handleCharacteristicAction (_event, actor, actionId) {
            actor.characteristicRoll({ rollModifiers: { characteristic: actor.system.characteristics[actionId].shortLabel } }, true)
        }

        /**
         * Handle characteristic action
         * @private
         * @param {object} event
         * @param {object} ship    The ship
         * @param {string} positionId The ship position id
         * @param {string} actionId The action id
         */
        async #handleShipAction (event, ship, positionId, actionId) {
            const shipPosition = ship.items.get(positionId)
            const action = shipPosition?.system?.actions[actionId]
            if (action) {
                let actor = game.user.character ?? shipPosition.system.actors?.[0]
                if (!actor) {
                    const actorId = Object.keys(ship.system.shipPositionActorIds).find(key => JSON.stringify(ship.system.shipPositionActorIds[key]) === JSON.stringify(positionId))
                    if (actorId) {
                        actor = game.actors.get(actorId)
                    }
                    if (!actor) {
                        ui.notifications.warn(game.i18n.localize('TWODSIX.Ship.NoActorsForAction'))
                        return
                    }
                }

                const component = ship.items.find(item => item.id === action.component)
                const extra = {
                    actor,
                    ship,
                    event,
                    component,
                    actionName: action.name,
                    positionName: shipPosition?.name ?? '',
                    diceModifier: ''
                }
                ship.doShipAction(action, extra)
            }
        }

        /**
         * Handle utility action
         * @private
         * @param {object} token    The token
         * @param {string} actionId The action id
         */
        async #handleUtilityAction (token, actionId) {
            switch (actionId) {
            case 'endTurn':
                if (game.combat?.current?.tokenId === token.id) {
                    await game.combat?.nextTurn()
                }
                break
            }
        }
    }
})
