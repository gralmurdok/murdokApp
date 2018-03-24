import express from 'express';
import bodyParser from 'body-parser';
import channelService from './actions/ChannelService';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = 8080;
var router = express.Router();

app.post('/', (req, res) => {

    console.log(req.body);

    if(req.body.text === 'hola') {
        console.log('juray')
        return res.send({
            response_type: 'in_channel', // public to the channel
            text: '302: Found',
            attachments:[
              {
                image_url: 'https://http.cat/302.jpg'
              }
          ]}
        )
    }

    if(req.body.text === 'channels') {
        channelService.getChannelsList()
            .then(channels => channels.forEach(x => console.log(x.id)));
    }

    if(req.body.text === 'users') {
        console.log(req.body['channel_id'])
        channelService.getChannelUsers(req.body['channel_id'])
            .then(users => console.log(users))
    }

    console.log('asdasdsa');
    return res.send({text: 'malo malo'});   
});

app.listen(port);
console.log('Murdok app bothering you on port ' + port);