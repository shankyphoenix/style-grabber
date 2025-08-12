const PUBLIC_KEY = 'BE6q_aLTDDGDPrqX1BphIJSBDLrY59jxnAk16N_69qQZqvnvDK-8GPcVJSv5lWAZTM5gjzFgKlclA6DFJ3HO5p4';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return new Uint8Array([...rawData].map(c => c.charCodeAt(0)));
}

export async function registerPush() {
  const registration = await navigator.serviceWorker.register('/service-worker.js');
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(PUBLIC_KEY),
  });
  return subscription;
}
