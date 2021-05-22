const express = require('express'),
    webpush = require('web-push'),
    app = express(),
    PORT = 8080;

const STORE = {
    vapid : webpush.generateVAPIDKeys(),
    subscription : null
};

webpush.setVapidDetails(
    'mailto:test@test.com',
    STORE.vapid.publicKey,
    STORE.vapid.privateKey
);
  

app.use(express.static('public'));
app.use(express.urlencoded({ extended : true }));
app.use(express.json());

app.get('/vapid', getVAPID);
app.post('/subscription', storeSubscription);
app.post('/pushNotify', sendPush);

app.listen(PORT, () => console.log(`Listening on ${PORT}`));



// Router Funcs ************************************************************

function getVAPID(req, res) {
    res.set('Content-Type', 'application/json');
    res.end(JSON.stringify({ publicKey : STORE.vapid.publicKey }));
}

function storeSubscription(req, res) {
    STORE.subscription = req.body;
    res.set('Content-Type', 'application/json');
    res.end(JSON.stringify({ value : "success" }));
}

function sendPush(req, res) {
    webpush.sendNotification(STORE.subscription, JSON.stringify(req.body))
    .then(() => {
        res.set('Content-Type', 'application/json');
        res.end(JSON.stringify({ value : "success" }));
    })
    .catch(err => {
        res.set('Content-Type', 'application/json');
        res.end(JSON.stringify(err));
    });
}