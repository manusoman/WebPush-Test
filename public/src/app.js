(function() { 'use strict';

function requestNotifyPermission(e) {
    e.stopPropagation();

    if(!('Notification' in window)) {
        console.log('This browser does not support notification');
        return;
    }

    if(Notification.permission !== 'denied') {
        Notification.requestPermission()
        .then(permission => {
            permission === 'granted' && console.log('Granted notify permission');
        });
    }
}


window.getPushSubOpts = () => {
    return new Promise((res, rej) => {
        fetch('http://localhost:8080/vapid', { method : 'GET' })
        .then(response => response.json())
        .then(data => {
            res({
                userVisibleOnly : true,
                applicationServerKey : data.publicKey
            });
        })
        .catch(rej);
    });
};


window.managePushSubscription = (sub) => {
    console.log(sub);
    
    fetch('http://localhost:8080/subscription', {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(sub)
    })
    .then(response => response.json())
    .then(console.log)
    .catch(console.log);
};


window.sendPushNotification = (title, body) => {
    fetch('http://localhost:8080/pushNotify', {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({title, body})
    })
    .then(response => response.json())
    .then(console.log)
    .catch(console.log);
};


document.getElementById('AN').addEventListener('click', requestNotifyPermission, true);


})();