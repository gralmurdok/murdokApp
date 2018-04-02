import ChannelActions from '../actions/ChannelActions';
import MessageService from './MessageService';
import getNextWaterCouple from '../commands/getNextWaterCouple';


class QueryService {
  static resolveQuery(query, reqProps) {
    const {command = ''} = query;
    let mainCommand, subCommand;

    if(typeof command !== 'string') {
      mainCommand = command[0];
      subCommand = command[1];
    }

    switch(mainCommand || command) {
      case 'welcome':
        return Promise.resolve(MessageService.formatMessage('', {
          pretext: 'What do you want?',
          'callback_id': 'coffee_button',
          actions: [
            {
              name: 'coffee',
              text: 'I want coffee',
              type: 'button',
              value: 'i_want_coffee'
            },
            {
              name: 'not_coffee',
              text: 'I don\'t want coffee',
              style: 'danger',
              type: 'button',
              value: 'i_dont_want_coffee'
            },
            {
              name: 'ready',
              text: 'Ready for coffee',
              style: 'primary',
              type: 'button',
              value: 'ready_for_coffee'
            }
          ]
        }));
      case 'channels':
        return ChannelActions.getChannelsList()
          .then(channels => MessageService.formatChannels(channels.map(ch => ch.id)));
      case 'water':
        return getNextWaterCouple.resolveAction({channel: reqProps.channelId, subCommand, reqProps})
          .then(messageInfo => {
            return MessageService.formatWaterCoupleUsers(messageInfo.data, messageInfo);
          });
      default:
        return Promise.resolve(MessageService.formatMessage('', {
          pretext: 'These are the commands available for murdokApp:',
          text: `\`${reqProps.slashCommand} channels\` => retrieve a list of all channels in slack\n` +
            `\`${reqProps.slashCommand} water\` => gets current couple selected to grab ioet's water\n` +
            `\`${reqProps.slashCommand} water getNext\` => gets next couple selected to grab ioet's water\n`
        }));
    }
  }
}

export default QueryService;
