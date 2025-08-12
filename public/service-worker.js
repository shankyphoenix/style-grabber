self.addEventListener('push', function (event) {
  console.log('Push event data:', event.data ? event.data.text() : 'No data');

  let payload = { title: 'No Title', body: 'No Body' };

  try {
    if (event.data) {
      payload = event.data.json();
    }
  } catch (e) {
    console.error('Error parsing push data', e);
    payload.body = event.data.text();
  }

  event.waitUntil(
    self.registration.showNotification(payload.title || 'Default Title', {
      body: payload.body || 'No Body',
      icon: '/icon.png',
      badge: '/badge.png'
    })
  );
});
