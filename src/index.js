const { IncomingWebhook } = require('@slack/client');
const url = 'https://hooks.slack.com/services/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';
const webhook = new IncomingWebhook(url);
 
// Send simple text to the webhook channel
webhook.send('Hello there', function(err, res) {
    if (err) {
        console.log('Error:', err);
    } else {
        console.log('Message sent: ', res);
    }
});

