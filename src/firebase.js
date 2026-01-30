import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, onValue, push } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
};

// Check if Firebase is configured
export const isFirebaseConfigured = () => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.databaseURL
  );
};

// Initialize Firebase only if configured
let app = null;
let database = null;

if (isFirebaseConfigured()) {
  app = initializeApp(firebaseConfig);
  database = getDatabase(app);
}

// Generate a random couple code
export const generateCoupleCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Create a new couple room
export const createCoupleRoom = async (coupleCode, partnerName) => {
  if (!database) throw new Error('Firebase not configured');

  const coupleRef = ref(database, `couples/${coupleCode}`);
  const snapshot = await get(coupleRef);

  if (snapshot.exists()) {
    throw new Error('Code already exists. Try a different one.');
  }

  await set(coupleRef, {
    createdAt: Date.now(),
    partner1: {
      name: partnerName,
      joinedAt: Date.now(),
    },
    partner2: null,
    settings: {
      anniversaryDate: null,
      nextVisitDate: null,
    },
    games: {},
    scores: {
      partner1: 0,
      partner2: 0,
    },
  });

  return { partnerId: 'partner1' };
};

// Join an existing couple room
export const joinCoupleRoom = async (coupleCode, partnerName) => {
  if (!database) throw new Error('Firebase not configured');

  const coupleRef = ref(database, `couples/${coupleCode}`);
  const snapshot = await get(coupleRef);

  if (!snapshot.exists()) {
    throw new Error('Invalid code. Please check and try again.');
  }

  const data = snapshot.val();

  if (data.partner2) {
    throw new Error('This room is already full.');
  }

  await set(ref(database, `couples/${coupleCode}/partner2`), {
    name: partnerName,
    joinedAt: Date.now(),
  });

  return { partnerId: 'partner2' };
};

// Get couple data
export const getCoupleData = async (coupleCode) => {
  if (!database) return null;

  const coupleRef = ref(database, `couples/${coupleCode}`);
  const snapshot = await get(coupleRef);

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.val();
};

// Subscribe to couple data changes
export const subscribeToCoupleData = (coupleCode, callback) => {
  if (!database) return () => {};

  const coupleRef = ref(database, `couples/${coupleCode}`);
  return onValue(coupleRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    }
  });
};

// Save game result
export const saveGameResult = async (coupleCode, partnerId, gameType, dateKey, result) => {
  if (!database) return;

  const gameRef = ref(database, `couples/${coupleCode}/games/${gameType}/${dateKey}/${partnerId}`);
  await set(gameRef, {
    ...result,
    timestamp: Date.now(),
  });
};

// Update settings
export const updateSettings = async (coupleCode, settings) => {
  if (!database) return;

  const settingsRef = ref(database, `couples/${coupleCode}/settings`);
  await set(settingsRef, settings);
};

// Update scores
export const updateScores = async (coupleCode, scores) => {
  if (!database) return;

  const scoresRef = ref(database, `couples/${coupleCode}/scores`);
  await set(scoresRef, scores);
};

export { database, ref, onValue, get };
