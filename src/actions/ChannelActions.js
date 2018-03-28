import slackClient from '../slackClient';

class ChannelActions {

  static getChannelsList() {
    return slackClient.web.channels.list()
      .then(res => res.channels)
      .catch(console.error);
  }

  static getChannelInfo(channel) {
    return slackClient.web.channels.info({channel})
      .then(res => res.channel);
  }

  static getGroupInfo(channel) {
    return slackClient.web.groups.info({channel})
      .then(res => res.group);
  }

  static getChannelUsers(channelId) {
    return ChannelActions.getChannelInfo(channelId)
      .then(channel => channel.members)
      .catch(console.error);
  }

  static getGroupUsers(channelId) {
    return ChannelActions.getGroupInfo(channelId)
      .then(group => group.members)
      .catch(console.error);
  }
}

export default ChannelActions;
