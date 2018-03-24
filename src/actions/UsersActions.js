import slackClient from '../slackClient';

class ChannelActions {

  static getUsers() {
    return slackClient.users.list()
      .then(res => res.users)
      .catch(console.error);
  }
}

export default ChannelActions;