// netlify/functions/getLastSearch.js

const admin = require('firebase-admin');

// DEBUG: Affichage des variables d'environnement dans les logs Netlify
console.log("=== FIREBASE CONFIG DEBUG ===");
console.log("FIREBASE_PROJECT_ID:", process.env.FIREBASE_PROJECT_ID);
console.log("FIREBASE_CLIENT_EMAIL:", process.env.FIREBASE_CLIENT_EMAIL);
console.log("FIREBASE_PRIVATE_KEY is defined:", !!process.env.FIREBASE_PRIVATE_KEY);
console.log("=============================");

// Initialisation Firebase Admin avec les variables d'environnement
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

exports.handler = async function(event, context) {
  try {
    const doc = await db.collection("searches").doc("last").get();
    if (!doc.exists) {
      return { statusCode: 404, body: 'Not found' };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ text: doc.data().text }),
    };
  } catch (e) {
    console.error("FIREBASE FUNCTION ERROR:", e);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }
};
