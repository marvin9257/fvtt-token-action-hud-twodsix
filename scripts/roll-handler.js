
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
            } else if (item.type === 'weapon') {
                resolveUnknownAutoMode(item)
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

function shouldShowCELAutoFireDialog (weapon) {
    const rateOfFire = weapon.system.rateOfFire
    return (
        (game.settings.get('twodsix', 'autofireRulesUsed') === 'CEL') &&
        (Number(rateOfFire) > 1 || (weapon.system.doubleTap && game.settings.get('twodsix', 'ShowDoubleTap')))
    )
}

async function promptForCELROF (weapon) {
    if (weapon.system.doubleTap && game.settings.get('twodsix', 'ShowDoubleTap')) {
        return new Promise((resolve) => {
            new Dialog({
                title: game.i18n.localize('TWODSIX.Dialogs.ROFPickerTitle'),
                content: '',
                buttons: {
                    single: {
                        label: game.i18n.localize('TWODSIX.Dialogs.ROFSingle'),
                        callback: () => {
                            resolve('')
                        }
                    },
                    doubleTap: {
                        label: game.i18n.localize('TWODSIX.Dialogs.ROFDoubleTap'),
                        callback: () => {
                            resolve('double-tap')
                        }
                    }
                },
                default: 'single'
            }).render(true)
        })
    } else {
        return new Promise((resolve) => {
            new Dialog({
                title: game.i18n.localize('TWODSIX.Dialogs.ROFPickerTitle'),
                content: '',
                buttons: {
                    single: {
                        label: game.i18n.localize('TWODSIX.Dialogs.ROFSingle'),
                        callback: () => {
                            resolve('')
                        }
                    },
                    burst: {
                        label: game.i18n.localize('TWODSIX.Dialogs.ROFBurst'),
                        callback: () => {
                            resolve('auto-burst')
                        }
                    },
                    full: {
                        label: game.i18n.localize('TWODSIX.Dialogs.ROFFull'),
                        callback: () => {
                            resolve('auto-full')
                        }
                    }
                },
                default: 'single'
            }).render(true)
        })
    }
}

async function promptAndAttackForCE (modes, item) {
    const buttons = {}

    for (const mode of modes) {
        const number = Number(mode)
        const attackDM = burstAttackDM(number)
        const bonusDamage = burstBonusDamage(number)

        if (number === 1) {
            buttons.single = {
                label: game.i18n.localize('TWODSIX.Dialogs.ROFSingle'),
                callback: () => {
                    item.performAttack('', true, 1)
                }
            }
        } else if (number > 1) {
            let key = game.i18n.localize('TWODSIX.Rolls.AttackDM') + ' +' + attackDM
            buttons[key] = {
                label: key,
                callback: () => {
                    item.performAttack('burst-attack-dm', true, number)
                }
            }

            key = game.i18n.localize('TWODSIX.Rolls.BonusDamage') + ' +' + bonusDamage
            buttons[key] = {
                label: key,
                callback: () => {
                    item.performAttack('burst-bonus-damage', true, number)
                }
            }
        }
    }

    await new Dialog({
        title: game.i18n.localize('TWODSIX.Dialogs.ROFPickerTitle'),
        content: '',
        buttons,
        default: 'single'
    }).render(true)
}

async function resolveUnknownAutoMode (item) {
    let attackType = ''
    const modes = (item.system.rateOfFire ?? '').split(/[-/]/)
    switch (game.settings.get('twodsix', 'autofireRulesUsed')) {
    case 'CEL':
        if (shouldShowCELAutoFireDialog(item)) {
            attackType = await promptForCELROF(item)
        }
        await item.performAttack(attackType, true)
        break
    case 'CE':
        if (modes.length > 1) {
            await promptAndAttackForCE(modes, item)
        } else {
            await item.performAttack('', true, Number(modes[0]))
        }
        break
    default:
        await item.performAttack(attackType, true)
        break
    }
}

function burstAttackDM (number) {
    if (number === null) {
        return 0
    }
    if (number >= 100) {
        return 4
    } else if (number >= 20) {
        return 3
    } else if (number >= 10) {
        return 2
    } else if (number >= 3) {
        return 1
    } else {
        return 0
    }
}

function burstBonusDamage (number) {
    if (number === null) {
        return '0'
    }
    if (number >= 100) {
        return '4d6'
    } else if (number >= 20) {
        return '3d6'
    } else if (number >= 10) {
        return '2d6'
    } else if (number >= 4) {
        return '1d6'
    } else if (number >= 3) {
        return '1'
    } else {
        return '0'
    }
}
