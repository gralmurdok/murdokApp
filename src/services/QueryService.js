import ChannelActions from '../actions/ChannelActions';
import MessageService from './MessageService';
import Database from '../database/database';
import getNextWaterCouple from '../commands/getNextWaterCouple';


class QueryService {
  static resolveQuery(query, reqProps) {
    const {command} = query;

    switch(command) {
      case 'channels':
        return ChannelActions.getChannelsList()
          .then(channels => MessageService.formatChannels(channels.map(ch => ch.id)));
      case 'water':
        const messageProps = {
          pretext: 'The next couple selected to grab ioet\'s water are:',
          color: '#439FE0'
        }

        return getNextWaterCouple.resolveAction({channel: reqProps.channelId})
          .then(waterCouple => MessageService.formatWaterCoupleUsers(waterCouple, messageProps));
    }
  }
}

export default QueryService;