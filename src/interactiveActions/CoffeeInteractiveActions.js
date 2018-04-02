//import Database from '../database/Database';

class CoffeeInteractiveActions {

  static executeAction(payload) {
    console.log(`The user ${payload.user.name} in team ${payload.team.domain} pressed the welcome button`);

    const {user} = payload;
    const action = payload.actions[0];
    let replacement = payload.original_message;
    let usersThatWantCoffee = (replacement.attachments[0].text || '')
      .match(/\w+/g) || [];
    let pretext = 'Current users that want coffee are:';

    if(action.value === 'i_want_coffee' && (usersThatWantCoffee.indexOf(user.id) === -1)) {
      usersThatWantCoffee.push(user.id);
    }

    if(action.value === 'ready_for_coffee') {
      const selectedPos = Math.floor((Math.random() * usersThatWantCoffee.length - 1) + 1);
      const selected = usersThatWantCoffee[selectedPos];

      if(replacement.attachments[0].actions) {
        delete replacement.attachments[0].actions;
      }

      pretext = `<@${selected}> was selected to make ${usersThatWantCoffee.length} cups of coffee :coffee: for: \n`;
    }

    const text = usersThatWantCoffee.map(user => `<@${user}>`).join('\n');

    console.log(`The button had name ${action.name} and value ${action.value}`);
    replacement.attachments[0].text = text;
    replacement.attachments[0].pretext = pretext;

    return replacement;
  }
}

export default CoffeeInteractiveActions;
