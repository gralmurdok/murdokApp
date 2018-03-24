import ChannelActions from '../actions/ChannelActions';
import Database from '../database/Database';

class getNextWaterCouple {
  static resolveAction(action) {
    if(!action.subcommand) {
      return this.getNextCouple(action.channel);
    }
  }

  static getNextCouple(channel) {
    return ChannelActions.getChannelUsers(channel)
      .then(users => {
        return Database.getFromCollection('ioetWaterPeople')
          .then((choosenOnes = []) => {
            console.log(choosenOnes);
            const existingIds = choosenOnes.map(usr => usr.usr);
            const validUsers = users.filter(usr => existingIds.indexOf(usr) === -1);
            const newCouple = this.getRandomCouple(validUsers).filter(x => !!x); 

            if(newCouple.length) {
              return Promise.all(newCouple.map(usr => Database.saveToCollection('ioetWaterPeople', {usr})))
                .then(() => newCouple);
            }

            return Database.dumpCollection('ioetWaterPeople')
              .then(() => this.getNextCouple(channel));
          });
      });
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