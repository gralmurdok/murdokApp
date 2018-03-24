import {WebClient} from '@slack/client';
import config from './config';

const slackClient = new WebClient(config.TOKEN);

export default slackClient;