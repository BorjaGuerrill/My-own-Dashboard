const notifyBtn = document.getElementById('notify-btn');

async function setRandomWikimediaPainting() {
  const landscapeCategories = [
    'Category:Landscape paintings',
    'Category:Landscape art',
    'Category:Seascapes',
    'Category:Sunrise paintings',
    'Category:Snow paintings',
    'Category:Fog paintings',
    'Category:Clouds in art',
    'Category:River paintings',
    'Category:Village paintings',
    'Category:Impressionist paintings'
  ];
  const preferredKeywords = [
    'landscape',
    'sky',
    'cloud',
    'sunrise',
    'sunset',
    'storm',
    'snow',
    'fog',
    'river',
    'lake',
    'mountain',
    'forest',
    'field',
    'meadow',
    'coast',
    'seascape',
    'harbor',
    'village',
    'countryside',
    'road'
  ];

  try {
    const categoryPool = [];

    for (const category of landscapeCategories) {
      const categoryEndpoint = `https://commons.wikimedia.org/w/api.php?origin=*&action=query&list=categorymembers&cmtitle=${encodeURIComponent(category)}&cmlimit=300&cmtype=file&format=json`;
      const categoryResponse = await fetch(categoryEndpoint);
      if (!categoryResponse.ok) continue;

      const categoryData = await categoryResponse.json();
      const members = categoryData.query?.categorymembers || [];
      const imageMembers = members.filter((member) => {
        const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(member.title);
        const matchesKeyword = preferredKeywords.some((keyword) => new RegExp(keyword, 'i').test(member.title));
        return isImage && matchesKeyword;
      });
      categoryPool.push(...imageMembers);
    }

    if (!categoryPool.length) {
      throw new Error('No landscape-style painting images were found in Wikimedia Commons.');
    }

    const randomMember = categoryPool[Math.floor(Math.random() * categoryPool.length)];
    const imageInfoEndpoint = `https://commons.wikimedia.org/w/api.php?origin=*&action=query&titles=${encodeURIComponent(randomMember.title)}&prop=imageinfo&iiprop=url&iiurlwidth=1600&format=json`;
    const imageResponse = await fetch(imageInfoEndpoint);

    if (!imageResponse.ok) {
      throw new Error('Unable to fetch the selected painting image.');
    }

    const imageData = await imageResponse.json();
    const pages = imageData.query?.pages;
    const firstPage = pages ? Object.values(pages)[0] : null;
    const imageUrl = firstPage?.imageinfo?.[0]?.thumburl || firstPage?.imageinfo?.[0]?.url;

    if (!imageUrl) {
      throw new Error('No image URL returned by Wikimedia Commons.');
    }

    document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.37), rgba(0, 0, 0, 0.37)), url("${imageUrl}")`;
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
  } catch (error) {
    console.error(error);
    document.body.style.backgroundImage = 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7))';
  }
}

setRandomWikimediaPainting();

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