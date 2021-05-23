addEventListener('push', e => {
    const msg = e.data.json();

    self.registration.showNotification(msg.title, {
        body : msg.body
    });
});