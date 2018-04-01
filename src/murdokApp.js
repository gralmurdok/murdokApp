import express from 'express';
import bodyParser from 'body-parser';
import TokenizerService from './services/TokenizerService';
import QueryService from './services/QueryService';
import slackClient from './slackClient';
import LanguageActions from './actions/LanguageActions';
import Database from './database/Database';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;

app.post('/', (req, res) => {

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

  return QueryService.resolveQuery(query, reqProps)
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

app.listen(port);
console.log('Murdok app bothering you on port ' + port);

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

slackClient.slackEvents.start(3000).then(() => {
  console.log(`server listening on port ${port}`);
});
