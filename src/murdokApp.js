import express from 'express';
import bodyParser from 'body-parser';
import ChannelActions from './actions/ChannelActions';
import TokenizerService from './services/TokenizerService';
import QueryService from './services/QueryService';
import slackClient from './slackClient';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = 8080;
var router = express.Router();

app.post('/', (req, res) => {
  const query = TokenizerService.resolveTokens(req.body.text);
  const reqProps = {
    channelId: req.body.channel_id
  }

  res.send();

  const dRes = slackClient.delayedResponse(req.body.response_url);

  return QueryService.resolveQuery(query, reqProps)
    .then(response => dRes.send(response, (err, res) => {
      if(err) {
        return console.log(err);
      }

      return console.log(`Message sent back successfully`);
    }));
});

app.listen(port);
console.log('Murdok app bothering you on port ' + port);