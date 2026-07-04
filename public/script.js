const notifyBtn = document.getElementById('notify-btn');

async function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = atob(base64);

  return Uint8Array.from(rawData, c => c.charCodeAt(0));
}

async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service workers are not supported in this browser.');
  }
  return await navigator.serviceWorker.register('/sw.js');
}

const apiBase = '/api';

async function subscribeUser(registration) {
  const response = await fetch(`${apiBase}/vapid-public-key`);
  if (!response.ok) {
    throw new Error('Unable to fetch VAPID public key.');
  }
  console.log(response)
  const data = await response.json();
  console.log('data:')
  console.log(data)
  console.log('data.publicKey:')
  console.log(data.publicKey)
  const applicationServerKey = data.publicKey;
  console.log(applicationServerKey)

  return await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey,
  });
}

async function sendSubscriptionToServer(subscription) {
  const response = await fetch(`${apiBase}/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subscription),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || 'Failed to save subscription on server.');
  }
}

notifyBtn.addEventListener('click', async () => {
  notifyBtn.disabled = true;

  try {
    const registration = await registerServiceWorker();
    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      throw new Error('Notification permission denied.');
    }

    const subscription = await subscribeUser(registration);
    await sendSubscriptionToServer(subscription);


    alert('Notifications enabled successfully.');
  } catch (error) {
    console.error(error);
    notifyBtn.textContent = 'Enable Notifications';
    alert(`Error enabling notifications: ${error.message}`);
  } finally {
    notifyBtn.disabled = false;
  }
});