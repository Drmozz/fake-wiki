const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "mozzduo-f4988",
      clientEmail: "firebase-adminsdk@mozzduo-f4988.iam.gserviceaccount.com",
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
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
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }
};