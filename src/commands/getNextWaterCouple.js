import ChannelActions from '../actions/ChannelActions';

class getNextWaterCouple {
  static resolveAction(action) {
    if(!action.subcommand) {
      return this.getNextCouple(action.channel);
    }
  }

  static getNextCouple(channel) {
    return ChannelActions.getChannelUsers(channel)
      .then(users => this.getRandomCouple(users));
  }

  static getRandomCouple(users, teamResult) {
    const teammate = Math.floor((Math.random() * users.length - 1) + 1);
    let newTeamResult = teamResult || [];
    newTeamResult.push(users.splice(teammate, 1)[0]);
    if(newTeamResult.length === 2) {
      return [].concat(newTeamResult);
    } else {
      return this.getRandomCouple(users, newTeamResult);
    }
  }
}

export default getNextWaterCouple;