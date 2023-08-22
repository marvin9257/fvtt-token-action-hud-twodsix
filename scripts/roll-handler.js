
export let RollHandler = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    /**
     * Extends Token Action HUD Core's RollHandler class and handles action events triggered when an action is clicked
     */
    RollHandler = class RollHandler extends coreModule.api.RollHandler {
        /**
         * Handle action event
         * Called by Token Action HUD Core when an action event is triggered
         * @override
         * @param {object} event        The event
         * @param {string} encodedValue The encoded value
         */
        async doHandleActionEvent (event, encodedValue) {
            const payload = encodedValue.split('|')

            if (payload.length !== 2) {
                super.throwInvalidValueErr()
            }

            const actionTypeId = payload[0]
            const actionId = payload[1]

            const renderable = ['item']

            if (renderable.includes(actionTypeId) && this.isRenderItem()) {
                return this.doRenderItem(this.actor, actionId)
            }

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
        #handleItemAction (_event, actor, actionId) {
            const item = actor.items.get(actionId)
            if (item.type === 'trait' || item.type === 'spell') {
                const picture = item.img
                const capType = item.type.capitalize()
                const msg = `<div style="display: inline-flex;"><img src="${picture}" alt="" class="chat-image"></img><span style="align-self: center; text-align: center; padding-left: 1ch;"><strong>${capType}: ${item.name}</strong></span></div><br>${item.system.description}`
                ChatMessage.create({ content: msg, speaker: ChatMessage.getSpeaker({ actor: this.actor }) })
            } else {
                item.skillRoll(true)
            }
        }

        /**
         * Handle characteristic action
         * @private
         * @param {object} event    The event
         * @param {object} actor    The actor
         * @param {string} actionId The action id
         */
        #handleCharacteristicAction (event, actor, actionId) {
            actor.characteristicRoll({ rollModifiers: { characteristic: actor.system.characteristics[actionId].shortLabel } }, true)
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
