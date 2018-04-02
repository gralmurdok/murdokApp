import {IncomingWebhook} from '@slack/client';
import {createSlackEventAdapter} from '@slack/events-api';
import {createMessageAdapter} from '@slack/interactive-messages';
import config from './config';

const {VERIFICATION_TOKEN} = config;

let slackClient = {
  web: {},
  delayedResponse: url => new IncomingWebhook(url),
  slackEvents: createSlackEventAdapter(VERIFICATION_TOKEN),
  interactiveMessages: createMessageAdapter(VERIFICATION_TOKEN)
}

export default slackClient;
