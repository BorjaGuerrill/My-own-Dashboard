self.addEventListener('push', (event) => {
  let data = { title: 'Notificación', message: 'Tienes un nuevo mensaje.' };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (err) {
      data.message = event.data.text();
    }
  }

  const options = {
    body: data.message,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [100, 50, 100],
    data: { timestamp: Date.now() },
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow('/');
    })
  );
});