import slackClient from '../slackClient';

class ChannelActions {

  static getChannelsList() {
    return slackClient.channels.list()
      .then(res => res.channels)
      .catch(console.error);
  }

  static getChannelInfo(channel) {
    return slackClient.channels.info({channel})
      .then(res => res.channel);
  }

  static getChannelUsers(channelId) {
    return this.getChannelInfo(channelId)
      .then(channel => channel.members)
      .catch(console.error);
  }
}

export default ChannelActions;