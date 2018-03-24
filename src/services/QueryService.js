import ChannelActions from '../actions/ChannelActions';
import MessageService from './MessageService';

class QueryService {
  static resolveQuery(query) {
    const {command} = query;
    
    switch(command) {
      case 'channels':
        return ChannelActions.getChannelsList()
          .then(channels => MessageService.formatArrayMessage(channels.map(ch => ch.id)));
    }
  }
}

export default QueryService;