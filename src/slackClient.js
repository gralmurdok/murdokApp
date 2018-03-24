import {WebClient, IncomingWebhook} from '@slack/client';
import config from './config';

const slackClient = {
  web: new WebClient(config.TOKEN),
  delayedResponse: url => new IncomingWebhook(url)
}

export default slackClient;