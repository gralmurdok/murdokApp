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
        return this.getNext(action)
          .then(nextCouple => {
            messageAttachment.data = nextCouple;
            return messageAttachment;
          });
      default:
        return this.getLastCreationCouple(action)
          .then(currentCouple => {
            messageAttachment.pretext = 'Current couple selected to grab ioet\'s water are:';
            messageAttachment.data = currentCouple;
            return messageAttachment;
          });
    }
  }

  static getNext(action) {
    return this.getLastCreationTime(action)
      .then((timestamp = 0) => {
        console.log('AAAAA => ', timestamp);
        const duration = moment.duration(1, 'hour').valueOf();
        const lastTime = moment(timestamp);
        const now = moment();
        const diff = now.diff(lastTime);

        if(diff < duration) {
          return Promise.resolve(`<@${action.reqProps.userId}> don't be a cheater, the chosen couple `+
            `cannot be changed at least in ${moment.duration(duration - diff).humanize()}`);
        }

        return this.getNextCouple(action.channel, action.reqProps.channelName);
      });
  }

  static getNextCouple(channel, channelName) {

    const getUsers = channelName === 'privategroup' ? ChannelActions.getGroupUsers : ChannelActions.getChannelUsers;

    return getUsers(channel)
      .then(users => {
        return Database.getFromCollection(`ioetWaterPeople_${channel}`)
          .then((chosenOnes = []) => {
            console.log('users => ', users);
            console.log('choosen => ', chosenOnes);
            const couples = chosenOnes.map(item => item.couple);
            const existingIds = couples.reduce((a, b) => a.concat(b), []);
            console.log('existingIds => ', existingIds);
            const validUsers = users.filter(usr => existingIds.indexOf(usr) === -1);
            const newCouple = this.getRandomCouple(validUsers).filter(x => !!x);

            if(newCouple.length) {
              return Database.saveToCollection(`ioetWaterPeople_${channel}`,
                {couple: newCouple, timestamp: moment().valueOf()})
                .then(() => newCouple);
            }

            return Database.dumpCollection(`ioetWaterPeople_${channel}`)
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

  static getLastCreationEntry(channel) {
    return Database.getFromCollection(`ioetWaterPeople_${channel}`)
      .then(chosenOnes => {
        return chosenOnes.sort((a, b) => b.timestamp - a.timestamp)[0] || {};
      });
  }

  static getLastCreationCouple(action) {
    return this.getLastCreationEntry(action.channel)
      .then(result => result.couple ||
        `There is no a couple selected yet, pls run \`${action.reqProps.slashCommand} water getNext\``);
  }

  static getLastCreationTime(action) {
    return this.getLastCreationEntry(action.channel)
      .then(result => result.timestamp || 0);
  }
}

export default getNextWaterCouple;
