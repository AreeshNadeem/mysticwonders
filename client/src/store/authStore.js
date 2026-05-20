import { create } from 'zustand';
import { auth, db } from '../lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  initAuth: () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const docRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            set({ user: { uid: firebaseUser.uid, email: firebaseUser.email, ...docSnap.data() }, loading: false });
          } else {
            set({ user: { uid: firebaseUser.uid, email: firebaseUser.email }, loading: false });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          set({ user: { uid: firebaseUser.uid, email: firebaseUser.email }, loading: false });
        }
      } else {
        set({ user: null, loading: false });
      }
    });
  },

  signUp: async (email, password, fullName) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    // Create firestore profile record
    await setDoc(doc(db, 'users', user.uid), {
      fullName,
      email,
      createdAt: new Date().toISOString(),
      savedItems: []
    });
    return user;
  },

  signIn: async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  },

  logout: async () => {
    await signOut(auth);
  }
}));

export default useAuthStore;
