import {WebClient} from '@slack/client';
import config from '../config';

const token = config.TOKEN;
const web = new WebClient(token);
console.log(token);
class ChannelService {

  static getChannelsList() {
    return web.channels.list()
      .then(res => res.channels)
      .catch(console.error);
  }

  static getChannelInfo(channel) {
    return web.channels.info({channel})
      .then(res => res.channel);
  }

  static getChannelUsers(channelId) {
    return this.getChannelInfo(channelId)
      .then(channel => channel.members)
      .catch(console.error);
  }
}

export default ChannelService;