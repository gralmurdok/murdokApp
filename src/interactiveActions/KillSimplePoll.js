import Store from '../store/Store'

class KillSimplePoll {

  static executeAction(payload) {
    const {user, channel} = payload
    const action = payload.actions[0]
    let replacement = payload.original_message
    let channelChoices = Store[`channelChoices_${channel.id}`] ||
      (Store[`channelChoices_${channel.id}`] = this.getPreviousData(replacement))
    Store[`options_${channel.id}`] = Store[`options_${channel.id}`] ||
      (Store[`options_${channel.id}`] = this.getPreviousData(replacement)
        .map(data => data.choice))

    let actionToResolve

    console.log(channelChoices)

    if(action.name === 'i_want_this') {
      const choice = (channelChoices.find(a => a.id === user.id))
      if(!choice) {
        channelChoices.push({id: user.id, choice: action.value})
      } else {
        choice.choice = action.value
      }

      this.refresh(replacement, channel)
      actionToResolve = Promise.resolve(replacement)
    }

    if(action.name === 'refresh') {
      this.refresh(replacement, channel)
      actionToResolve = Promise.resolve(replacement)
    }

    if(action.name === 'finish') {
      this.finish(replacement, channel)
      actionToResolve = Promise.resolve(replacement)
    }

    return actionToResolve
      .then(() => {
        return replacement
      })
  }

  static refresh(replacement, channel) {
    let options = Store[`options_${channel.id}`]
    let channelChoices = Store[`channelChoices_${channel.id}`]

    replacement.attachments = options.map(opt => ({
      text: channelChoices
        .filter(ch => ch.choice === opt)
        .map(ch => `<@${ch.id}>`)
        .join('\n'),
      pretext: `People that wants *${opt}*:`,
      'callback_id': 'channel_wants_this',
      actions: [
        {
          name: 'i_want_this',
          text: `I want ${opt}`,
          type: 'button',
          value: opt
        }
      ]
    }))
      .concat([
        {
          text: '',
          'callback_id': 'channel_wants_this',
          actions: [
            {
              name: 'refresh',
              text: 'Refresh Options',
              type: 'button',
              value: 'refresh'
            }
          ]
        },
        {
          text: '',
          'callback_id': 'channel_wants_this',
          actions: [
            {
              name: 'finish',
              text: 'Finish',
              type: 'button',
              value: 'finish'
            }
          ]
        }
      ])
  }

  static getPreviousData(replacement) {
    return (replacement.attachments || [])
      .filter(att => !!att.text)
      .map(att => {
        return att.text
          .match(/\w+/g)
          .map(id => ({id, choice: att.actions[0].value}))
      })
      .reduce((a,b) => a.concat(b), [])
  }

  static finish(replacement, channel) {
    delete Store[`channelChoices_${channel.id}`]
    delete Store[`options${channel.id}`]

    return (replacement.attachments || [])
      .foreach(att => delete att.actions)
  }
}

export default KillSimplePoll
