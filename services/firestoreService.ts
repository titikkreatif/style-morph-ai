import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { WebsiteConfig, GenerationResult } from "../types";

// State to track if the database is confirmed to be missing to avoid spamming requests
let isDatabaseMissing = false;

export const firestoreService = {
  // Website Configuration
  async getWebsiteConfig(): Promise<WebsiteConfig | null> {
    if (isDatabaseMissing) return null;

    try {
      const docRef = doc(db, "settings", "main");
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as WebsiteConfig;
      }
      return null;
    } catch (error: any) {
      if (error.code === 'not-found' || error.message?.includes("database (default) does not exist")) {
        isDatabaseMissing = true;
        console.warn("CRITICAL: Firestore database (default) does not exist in project tk-kreatif-studio. Operating in Local Default mode.");
        console.warn("To fix this, visit: https://console.cloud.google.com/datastore/setup?project=tk-kreatif-studio");
      } else {
        console.error("Firestore Error (getWebsiteConfig):", error.message);
      }
      return null;
    }
  },

  async updateWebsiteConfig(config: WebsiteConfig): Promise<void> {
    if (isDatabaseMissing) return;

    try {
      const docRef = doc(db, "settings", "main");
      await setDoc(docRef, config);
    } catch (error: any) {
      console.error("Firestore Error (updateWebsiteConfig):", error.message);
    }
  },

  // User Generations History
  async saveGeneration(userId: string, generation: Omit<GenerationResult, 'id' | 'createdAt'>): Promise<string | null> {
    if (isDatabaseMissing) return null;

    try {
      const colRef = collection(db, "generations");
      const docRef = await addDoc(colRef, {
        ...generation,
        userId,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error: any) {
      console.error("Firestore Error (saveGeneration):", error.message);
      return null;
    }
  },

  async getUserHistory(userId: string): Promise<any[]> {
    if (isDatabaseMissing) return [];

    try {
      const colRef = collection(db, "generations");
      const q = query(
        colRef, 
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: (doc.data() as any).createdAt?.toDate()?.toLocaleDateString() || 'Recently'
      }));
    } catch (error: any) {
      if (error.code === 'not-found' || error.message?.includes("database (default) does not exist")) {
        isDatabaseMissing = true;
      }
      console.error("Firestore Error (getUserHistory):", error.message);
      return [];
    }
  }
};