import {WebClient, IncomingWebhook} from '@slack/client';
import {createSlackEventAdapter} from '@slack/events-api';
import config from './config';

const slackClient = {
  web: new WebClient(config.TOKEN),
  delayedResponse: url => new IncomingWebhook(url),
  slackEvents: createSlackEventAdapter(config.VERIFICATION_TOKEN)
}

export default slackClient;
