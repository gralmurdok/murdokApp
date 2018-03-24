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
      case 'getNextWaterMan':
        // return Database.getFromCollection('test', {})
        //   .then(response => MessageService.formatMessage(response[0].command));
        return getNextWaterCouple.resolveAction({channel: reqProps.channelId})
          .then(waterCouple => MessageService.formatUsers(waterCouple));
    }
  }
}

export default QueryService;