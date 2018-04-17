import ChannelActions from '../actions/ChannelActions';
import MessageService from './MessageService';
import getNextWaterCouple from '../commands/getNextWaterCouple';
import Store from '../store/Store';


class QueryService {
  static resolveQuery(query, reqProps) {
    const {command = ''} = query;
    let mainCommand, subCommand;

    if(typeof command !== 'string') {
      mainCommand = command[0];
      subCommand = command
        .slice(1, command.length)
        .join(' ');
    }

    switch(mainCommand || command) {
      case 'threeInLine':
        Store['threeInLinePlayer'] = reqProps.userId
        return Promise.resolve(MessageService.formatMessage('', {
          pretext: `<@${reqProps.userId}> wants someone to challenge him`,
          'callback_id': 'three_in_line_game',
          actions: [
            {
              name: 'challenge_accepted',
              text: 'I want to challenge you',
              type: 'button',
              value: '0'
            }
          ]
        }));
      case 'addOption':
        let options = Store[`options_${reqProps.channelId}`];
        if(options) {
          options.push(subCommand);
          return Promise.resolve({
            text: `you just added \`${subCommand}\` press \`Refresh Options\` to your changes to take effect`
          });
        }
        return Promise.resolve({text: 'there is no an active poll running'});
      case 'killSimplePoll':

        Store[`channelChoices_${reqProps.channelId}`] = []
        Store[`options_${reqProps.channelId}`] = []

        return Promise.resolve(MessageService.formatMessage('', {
          pretext: 'What do our team wants?',
          'callback_id': 'channel_wants_this',
          actions: [
            {
              name: 'refresh',
              text: 'Refresh Options',
              type: 'button',
              value: 'refresh'
            }
          ]
        }));
      case 'beerBashScore':
        return Promise.resolve(MessageService.formatMessage('', {
          pretext: 'Please rate last beerBash, It will help us to improve future beerbash schedules.',
          'callback_id': 'beerbashScore_button',
          actions: [1,2,3,4,5]
            .map(num => {
              return {
                name: 'rate_value',
                text: `${num}`,
                type: 'button',
                value: `${num}`
              }
            })
        }));
      case 'coffee':
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
          text: `\`${reqProps.slashCommand} coffee\` => use it instead of using \`@channel coffee?\`\n` +
            `\`${reqProps.slashCommand} water\` => gets current couple selected to grab water\n` +
            `\`${reqProps.slashCommand} water getNext\` => gets next couple selected to grab water\n` +
            `\`${reqProps.slashCommand} beerBashScore\` => call vote to rate last beerbash\n` +
            `\`${reqProps.slashCommand} killSimplePoll\` => call a dynamic poll\n` +
            `\`${reqProps.slashCommand} addOption text\` => add an option to vote\n` +
            `\`${reqProps.slashCommand} threeInLine\` => play three-in-line against ` +
              'another member of technical staff\n'
        }));
    }
  }
}

export default QueryService;
