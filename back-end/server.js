
// const express = require('express');
import express from "express"
// const webpush = require('web-push');
import webpush from "web-push"
// const path = require('path');
import path from "path"
// const fs = require('fs');
import fs from "fs"
// const mysql = require('mysql2/promise');
import mysql from "mysql2/promise"
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const db = mysql.createPool({
  //this information i cannot show
});


app.use(express.json());
// Do not expose server files or the parent web root through Express.
// app.use(express.static(path.join(__dirname, '../')));
const directorioPublico = '../public'
//Sirve solo la carpeta public y nada mas!
app.use(express.static(path.join(__dirname, directorioPublico)));
let publikCey
let privateCey
async function guardarVapid() {
  const [colum] =
    await db.execute(
      'SELECT * FROM vapid'
    )

  publikCey = colum[0].public;
  privateCey = colum[0].private;
}
await guardarVapid()

const vapidKeys = {
  publicKey: publikCey,
  privateKey: privateCey
}

// function loadVapidKeys() {
//esta funcion ya no esta en uso, creo que consigue las keys por un archivo de .env
//   if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
//     return {
//       publicKey: process.env.VAPID_PUBLIC_KEY,
//       privateKey: process.env.VAPID_PRIVATE_KEY,
//     };
//   }

//   const fileContent = fs.readFileSync(vapidFilePath, 'utf8');
//   const json = JSON.parse(fileContent);
//   if (!json.publicKey || !json.privateKey) {
//     throw new Error('Invalid VAPID JSON format');
//   }
//   return json;
// }

// const vapidKeys = loadVapidKeys();

// if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
//   console.warn('No VAPID keys found in environment. Using generated ephemeral keys.');
// }

// if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
//   console.warn('No VAPID keys found in environment. Using generated ephemeral keys.');
// }

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:example@yourdomain.org',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const subscriptions = [];

function isSubscriptionValid(subscription) {
  return subscription && subscription.endpoint && subscription.keys && subscription.keys.auth && subscription.keys.p256dh;
}

app.get('/api/vapid-public-key', (req, res) => {
  res.json({ publicKey: vapidKeys.publicKey });
});

app.post('/api/subscribe', async (req, res) => {
  const subscription = req.body;

  if (!isSubscriptionValid(subscription)) {
    return res.status(400).json({ error: 'Invalid subscription object' });
  }

  await db.execute(
    `
    INSERT INTO subscriptions
    (endpoint, auth, p256dh, expiration_time)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      auth = VALUES(auth),
      p256dh = VALUES(p256dh),
      expiration_time = VALUES(expiration_time)
    `,
    [
      subscription.endpoint,
      subscription.keys.auth,
      subscription.keys.p256dh,
      /* ?? null porque algunos browsers mandan expirationTime como undefined y mysql2 se rehusa a aceptar undefined
      como un parametro de sql*/
      subscription.expirationTime ?? null
    ]
  );

  console.log('Saved subscription:', subscription.endpoint);

  res.status(201).json({ success: true });
});

app.post('/api/send-notification', async (req, res) => {
  const { title = 'Notificación', message = 'Tienes un nuevo mensaje.' } = req.body;
  const payload = JSON.stringify({ title, message });



  const results = [];
  const [rows] =
    await db.execute(
      'SELECT * FROM subscriptions'
    );


  // row es solo un "apodo" de rows
  for (const row of rows) {

    const subscription = {
      endpoint: row.endpoint,
      keys: {
        auth: row.auth,
        p256dh: row.p256dh
      }
    };

    try {

      await webpush.sendNotification(
        subscription,
        payload
      );

      results.push({
        endpoint: subscription.endpoint,
        success: true
      });

    } catch (error) {

      results.push({
        endpoint: subscription.endpoint,
        success: false,
        error: error.message
      });

      console.error('Failed notification:', error.message);

      if (error.statusCode === 410 || error.statusCode === 404) {

        await db.execute(
          'DELETE FROM subscriptions WHERE endpoint = ?',
          [subscription.endpoint]
        );

        console.log(
          'Removed expired subscription:',
          subscription.endpoint
        );
      }
    }
  }

  res.json({ results });
});
const RSS_FEEDS = {
  hn: "https://hnrss.org/frontpage"
};

app.get("/api/rss/:feed", async (req, res) => {
  try {
    const feedName = req.params.feed;
    const feedUrl = RSS_FEEDS[feedName];

    if (!feedUrl) {
      return res.status(404).json({ error: "RSS feed not found" });
    }

    const response = await fetch(feedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 RSS Reader"
      }
    });

    if (!response.ok) {
      throw new Error(`RSS fetch failed: ${response.status}`);
    }

    const xml = await response.text();

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=300");

    res.send(xml);
  } catch (error) {
    console.error("Error fetching RSS:", error);
    res.status(500).json({ error: "Error fetching RSS feed" });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`VAPID public key: ${vapidKeys.publicKey}`);
  console.log(`VAPID private key: ${vapidKeys.privateKey}`)
  console.log(`Archivos publicos servidos en ${directorioPublico}`)
});