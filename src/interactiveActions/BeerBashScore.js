import Store from '../store/Store'

class BeerBashScore {

  static executeAction(payload) {
    const {user} = payload
    const timestamp = payload['message_ts']
    const action = payload.actions[0]
    let replacement = payload.original_message
    let beerBashRates = Store[`beerBashRates_${timestamp}`] || (Store[`beerBashRates_${timestamp}`] = [])
    let pretext = 'Current users that submitted their votes were:'
    let actionToResolve
    const minVotes = 10

    console.log(payload)

    if(action.name === 'rate_value') {
      const rate = (beerBashRates.find(rates => rates.id === user.id))
      if(!rate) {
        beerBashRates.push({id: user.id, rate: parseInt(action.value)})
      } else {
        rate.rate = parseInt(action.value)
      }

      actionToResolve = Promise.resolve(beerBashRates)
      if(beerBashRates.length >= minVotes) replacement.attachments[1] = {
        text: '',
        'callback_id': 'beerbashScore_button',
        actions: [
          {
            name: 'rate',
            text: 'Rate',
            style: 'primary',
            type: 'button',
            value: '0'
          }
        ]
      }
    }

    if(action.name === 'rate') {
      if(beerBashRates.length <= minVotes) return Promise.resolve()
      const score = beerBashRates
        .reduce((a,b) => a + b.rate, 0) / beerBashRates.length
      actionToResolve = Promise.resolve()
      pretext = `Last BeerBash score was \`${Math.round(score)}\` of ${beerBashRates.length} votes.`
      if(replacement.attachments[0].actions) {
        delete replacement.attachments[0].actions
      }
      if(replacement.attachments[1].actions) {
        delete replacement.attachments[1].actions
      }
    }

    return actionToResolve
      .then(() => {
        const text = beerBashRates.map(rate => `:white_check_mark: <@${rate.id}>`).join('\n')
        replacement.attachments[0].text = text
        replacement.attachments[0].pretext = pretext
        return replacement
      })
  }
}

export default BeerBashScore
