import {WebClient, IncomingWebhook} from '@slack/client';
import {createSlackEventAdapter} from '@slack/events-api';
import {createMessageAdapter} from '@slack/interactive-messages';
import config from './config';

const {TOKEN, VERIFICATION_TOKEN} = config;

const slackClient = {
  web: new WebClient(TOKEN),
  delayedResponse: url => new IncomingWebhook(url),
  slackEvents: createSlackEventAdapter(VERIFICATION_TOKEN),
  interactiveMessages: createMessageAdapter(VERIFICATION_TOKEN)
}

export default slackClient;
