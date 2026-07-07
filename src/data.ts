import {
    collection,
    doc,
    getDocs,
    setDoc,
    writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import { Project } from './types';

export const INITIAL_PROJECTS: Project[] = [];

const PROJECTS_COLLECTION = 'projects';
const MESSAGES_COLLECTION = 'messages';
const ANALYTICS_COLLECTION = 'analytics';

// Hapus semua field bernilai undefined sebelum dikirim ke Firestore
// (Firestore menolak field undefined, beda dengan localStorage/JSON biasa)
const sanitize = (obj: any) => JSON.parse(JSON.stringify(obj));

// ============ PROJECTS ============
export const loadProjects = async (): Promise<Project[]> => {
  try {
    const snapshot = await getDocs(collection(db, PROJECTS_COLLECTION));
    if (snapshot.empty) return INITIAL_PROJECTS;
    return snapshot.docs.map((d) => d.data() as Project);
  } catch (e) {
    console.error('Error loading projects from Firestore', e);
    return INITIAL_PROJECTS;
  }
};

export const saveProjects = async (projects: Project[]) => {
  try {
    const snapshot = await getDocs(collection(db, PROJECTS_COLLECTION));
    const batch = writeBatch(db);
    snapshot.docs.forEach((d) => batch.delete(d.ref));
    projects.forEach((p) => {
      batch.set(doc(db, PROJECTS_COLLECTION, p.id), sanitize(p));
    });
    await batch.commit();
  } catch (e) {
    console.error('Error saving projects to Firestore', e);
  }
};

// ============ MESSAGES ============
export const loadMessages = async (): Promise<any[]> => {
  try {
    const snapshot = await getDocs(collection(db, MESSAGES_COLLECTION));
    return snapshot.docs.map((d) => d.data());
  } catch (e) {
    console.error('Error loading messages from Firestore', e);
    return [];
  }
};

export const saveMessages = async (messages: any[]) => {
  try {
    const snapshot = await getDocs(collection(db, MESSAGES_COLLECTION));
    const batch = writeBatch(db);
    snapshot.docs.forEach((d) => batch.delete(d.ref));
    messages.forEach((m) => {
      batch.set(doc(db, MESSAGES_COLLECTION, m.id), sanitize(m));
    });
    await batch.commit();
  } catch (e) {
    console.error('Error saving messages to Firestore', e);
  }
};

export const saveMessage = async (msg: any) => {
  try {
    await setDoc(doc(db, MESSAGES_COLLECTION, msg.id), sanitize(msg));
  } catch (e) {
    console.error('Error saving message to Firestore', e);
  }
};

// ============ ANALYTICS ============
export const loadAnalyticsEvents = async (): Promise<any[]> => {
  try {
    const snapshot = await getDocs(collection(db, ANALYTICS_COLLECTION));
    return snapshot.docs.map((d) => d.data());
  } catch (e) {
    console.error('Error loading analytics events from Firestore', e);
    return [];
  }
};

export const saveAnalyticsEvent = async (event: any) => {
  try {
    await setDoc(doc(db, ANALYTICS_COLLECTION, event.id), sanitize(event));

    // Batasi jumlah dokumen analytics — hapus yang paling lama kalau sudah lebih dari 200
    const snapshot = await getDocs(collection(db, ANALYTICS_COLLECTION));
    if (snapshot.size > 5) {
      const sorted = snapshot.docs.sort((a, b) => {
        const aId = a.id;
        const bId = b.id;
        return aId.localeCompare(bId);
      });
      const excess = sorted.slice(0, snapshot.size - 200);
      const batch = writeBatch(db);
      excess.forEach((d) => batch.delete(d.ref));
      await batch.commit();
    }
  } catch (e) {
    console.error('Error saving analytics event to Firestore', e);
  }
};
