import express from 'express';
import bodyParser from 'body-parser';
import TokenizerService from './services/TokenizerService';
import QueryService from './services/QueryService';
import slackClient from './slackClient';
import LanguageActions from './actions/LanguageActions';
import Database from './database/Database';
import CoffeeInteractiveActions from './interactiveActions/CoffeeInteractiveActions';
import config from './config';
import fetch from 'node-fetch';
import {WebClient} from '@slack/client';
import Store from './store/Store';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;

app.get('/auth', (req, res) => {

  const {query} = req;
  const {code} = query || {};
  const redirectUri = 'http://6de97cb5.ngrok.io/auth';
  const url = `https://slack.com/api/oauth.access/?client_id=${config.clientId}`+
    `&client_secret=${config.clientSecret}&code=${code}&redirect_uri=${redirectUri}`;

  if(code) {
    console.log(code)
    fetch(url)
      .then(res => res.json())
      .then(json => {
        return Database.saveToCollection('workSpaceAccess', {
          token: json.access_token,
          teamId: json.team_id
        })
          .then(() => res.send('auth success'));
      })
      .catch(error => {
        console.error(`url: ${url}`, error)
        return Promise.reject()
          .then(() => res.send('auth failed'));
      })
  }

});

app.post('/', (req, res) => {

  let authVerify = Promise.resolve();

  if(!Store[`${req.body.team_id}_access`]) {
    authVerify = Database.getFromCollection('workSpaceAccess')
      .then(accessTokens => {
        const access = accessTokens.find(at => at.teamId === req.body.team_id);
        const {token} = access || {};

        if(token) {
          return Store[`${access.teamId}_access`] = token;
        }
      });
  }

  console.log('BODY => ', req.body);

  const query = TokenizerService.resolveTokens(req.body.text);
  const reqProps = {
    channelName: req.body.channel_name,
    channelId: req.body.channel_id,
    userId: req.body.user_id,
    slashCommand: req.body.command
  }

  console.log(query);

  res.send();

  const dRes = slackClient.delayedResponse(req.body.response_url);

  return authVerify
    .then(() => {
      slackClient.web = new WebClient(Store[`${req.body.team_id}_access`]);
    })
    .then(() => QueryService.resolveQuery(query, reqProps))
    .then(response => dRes.send(response, (err, response) => {
      if(err) {
        return console.log(err);
      }

      console.log('Message sent back successfully')
      return response;
    }));
});

app.get('/', (req, res) => {
  res.send('hello this is murdokApp');
})

//Events API

app.use('/slack/events', slackClient.slackEvents.expressMiddleware());

slackClient.slackEvents.on('message', event => {

  console.log(event);
  console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);

  return LanguageActions.detectLanguageInput(event.text)
    .then(language => {
      const isEnglish = language === 'en';
      const {user, channel, text} = event;

      if(isEnglish) {
        Database.saveToCollection(`englishSentences_${channel}`, {user, text});
      }
    });
});

// Interactive messages API

app.use('/slack/actions', slackClient.interactiveMessages.expressMiddleware());

slackClient.interactiveMessages.action('coffee_button', payload => {
  return CoffeeInteractiveActions.executeAction(payload)
    .then(replacement => replacement);
});

app.listen(port);
console.log('Murdok app bothering you on port ' + port);
