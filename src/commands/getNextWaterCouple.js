import ChannelActions from '../actions/ChannelActions';
import Database from '../database/Database';
import moment from 'moment';

class getNextWaterCouple {

  static resolveAction(action) {

    let messageAttachment = {
      pretext: 'Next couple selected to grab ioet\'s water are:',
      color: '#439FE0'
    };

    switch(action.subCommand) {
      case 'getNext':
        return this.getNext(action.channel)
          .then(nextCouple => {
            messageAttachment.data = nextCouple;
            return messageAttachment;
          });
      default:
        return this.getCurrentCouple()
          .then(currentCouple => {
            messageAttachment.pretext = 'Current couple selected to grab ioet\'s water are:';
            messageAttachment.data = currentCouple.couple;
            return messageAttachment;
          });
    }
  }

  static getNext(channel) {
    return this.getCurrentCouple()
      .then((currentCouple = {timestamp: 0}) => {
        console.log('AAAAA => ', currentCouple);
        const duration = moment.duration(1, 'day').valueOf();
        const lastTime = moment(currentCouple.timestamp);
        const now = moment();
        const diff = now.diff(lastTime);

        if(diff < duration) {
          return Promise.resolve('Don\'t be a cheater, the chosen couple '+
            `cannot be changed at least in ${moment.duration(duration - diff).humanize()}`);
        }
        
        return this.getNextCouple(channel);
      });
  }

  static getNextCouple(channel) {
    return ChannelActions.getChannelUsers(channel)
      .then(users => {
        return Database.getFromCollection('ioetWaterPeople')
          .then((chosenOnes = []) => {
            console.log('choosen => ', chosenOnes);
            const couples = chosenOnes.map(item => item.couple);
            const existingIds = couples.reduce((a, b) => a.concat(b), []);
            console.log('existingIds => ', existingIds);
            const validUsers = users.filter(usr => existingIds.indexOf(usr) === -1);
            const newCouple = this.getRandomCouple(validUsers).filter(x => !!x); 

            if(newCouple.length) {
              return Database.saveToCollection('ioetWaterPeople', {couple: newCouple, timestamp: moment().valueOf()})
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

  static getCurrentCouple() {
    return Database.getFromCollection('ioetWaterPeople')
      .then(chosenOnes => {
        return chosenOnes.sort((a, b) => b-a)[0];
      });
  }
}

export default getNextWaterCouple;
