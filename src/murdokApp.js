import express from 'express';
import bodyParser from 'body-parser';
import ChannelActions from './actions/ChannelActions';
import TokenizerService from './services/TokenizerService';
import QueryService from './services/QueryService';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = 8080;
var router = express.Router();

app.post('/', (req, res) => {
  const query = TokenizerService.resolveTokens(req.body.text);
  return QueryService.resolveQuery(query)
    .then(response => res.send(response));
});

app.listen(port);
console.log('Murdok app bothering you on port ' + port);