import ChannelActions from '../actions/ChannelActions';
import MessageService from './MessageService';
import Database from '../database/database';

class QueryService {
  static resolveQuery(query) {
    const {command} = query;
    
    switch(command) {
      case 'channels':
        return ChannelActions.getChannelsList()
          .then(channels => MessageService.formatChannels(channels.map(ch => ch.id)));
      case 'getNextWaterMan':
        return Database.getFromCollection('test', {})
          .then(response => MessageService.formatMessage(response[0].command));
    }
  }
}

export default QueryService;