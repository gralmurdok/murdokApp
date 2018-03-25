import express from 'express';
import bodyParser from 'body-parser';
import TokenizerService from './services/TokenizerService';
import QueryService from './services/QueryService';
import slackClient from './slackClient';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;

app.post('/', (req, res) => {

  console.log('BODY => ', req.body);

  const query = TokenizerService.resolveTokens(req.body.text);
  const reqProps = {
    channelId: req.body.channel_id
  }

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
