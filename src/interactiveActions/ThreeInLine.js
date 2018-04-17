import Store from '../store/Store'

class ThreeInLine {

  static executeAction(payload) {
    const {user} = payload
    const timestamp = payload['message_ts']
    const action = payload.actions[0]
    let replacement = payload.original_message
    let game = Store[`threeInLine_${timestamp}`] ||
      (Store[`threeInLine_${timestamp}`] = [0,0,0,0,0,0,0,0,0])
    let actionToResolve
    const player1 = Store[`threeInLine_player1_${timestamp}`] = Store['threeInLinePlayer']
    let player2 = Store[`threeInLine_player2_${timestamp}`]
    let currentPlayer = Store[`currentPlayer_${timestamp}`] || (Store[`currentPlayer_${timestamp}`] = player1)

    console.log(payload)

    if(action.name === 'challenge_accepted') {
      if(user.id === player1) {
        return Promise.resolve(replacement)
      }
      player2 = Store[`threeInLine_player2_${timestamp}`] = user.id
      replacement.attachments = this.generateGameButtons(game)
        .concat([
          {
            text: `<@${currentPlayer}>'s turn`
          }
        ])
      actionToResolve = Promise.resolve(replacement)
    }

    if(action.name === 'set_value') {
      let token

      if(currentPlayer === player1) {
        Store[`currentPlayer_${timestamp}`] = player2
        token = 'x'
      } else {
        Store[`currentPlayer_${timestamp}`] = player1
        token = 'o'
      }

      const value = action.value

      if(game[value] || currentPlayer !== user.id) {
        return Promise.resolve(replacement)
      }

      currentPlayer = Store[`currentPlayer_${timestamp}`]
      game[value] = token
      const gameState = this.evaluateGame(game, token)

      replacement.attachments = this.generateGameButtons(game)
        .concat([
          {
            text: gameState === 'winner' ? `<@${currentPlayer}> has won the match` :
              gameState === 'draw' ? 'DRAW' : `<@${currentPlayer}>'s turn`
          }
        ])
      actionToResolve = Promise.resolve(replacement)
    }

    return actionToResolve
      .then(() => {
        const text = `<@${player1}> vs <@${player2}>`
        replacement.text = text
        return replacement
      })
  }

  static generateGameButtons(game) {
    let gameButtons = [game.slice(0, 3), game.slice(3, 6), game.slice(6, 9)]
    return gameButtons.map((gameSet, row) => ({
      text: '',
      'callback_id': 'three_in_line_game',
      actions: gameSet.map((num, col) => ({
        name: 'set_value',
        text: `${num || '#'}`,
        type: 'button',
        style: num === 'x' ? 'danger' : num === 'o' ? 'primary' : 'default',
        value: `${(row * 3) + col}`
      }))
    }))
  }

  static evaluateGame(game, token) {
    const solutions = ['012', '036', '048', '147', '246', '258', '345', '678']
    const gameSet = game
      .map((num, index) => num === token ? index : null)
      .filter(x => !!x)
      .join('')

    let gameState = '';

    if(solutions.some(sol => gameSet.includes(sol))) {
      gameState = 'winner'
    }

    if(game.filter(x => !!x).length === 9) {
      gameState = 'draw'
    }

    return gameState
  }
}

export default ThreeInLine
