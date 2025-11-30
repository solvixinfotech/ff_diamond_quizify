import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
} from "firebase/auth";
import { doc, setDoc, getDoc, query, collection, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface FreeFireApiResponse {
  [key: string]: any; // Store the entire API response
}

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  freeFireId?: string;
  region?: string;
  freeFireData?: FreeFireApiResponse;
  createdAt?: string;
  totalCoins?: number;
  quizzesCompleted?: number;
}

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signupWithFreeFire: (freeFireId: string, region: string) => Promise<void>;
  loginWithFreeFire: (freeFireId: string, region: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (user: User) => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        setUserData(userDoc.data() as UserData);
      } else {
        // Create initial user data if it doesn't exist
        const newUserData: UserData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: new Date().toISOString(),
          totalCoins: 0,
          quizzesCompleted: 0,
        };
        await setDoc(userDocRef, newUserData);
        setUserData(newUserData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const refreshUserData = async () => {
    if (currentUser) {
      await fetchUserData(currentUser);
    }
  };

  // Verify Free Fire ID with API
  const verifyFreeFireId = async (uid: string, region: string): Promise<FreeFireApiResponse> => {
    try {
      const response = await fetch(
        `https://info-ob49.vercel.app/api/account/?uid=${uid}&region=${region}`
      );
      
      if (!response.ok) {
        throw new Error(`API verification failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error("Free Fire API verification error:", error);
      throw new Error(error.message || "Failed to verify Free Fire ID");
    }
  };

  // Sign up with Free Fire ID and region
  const signupWithFreeFire = async (freeFireId: string, region: string) => {
    // Check if user with this Free Fire ID already exists
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("freeFireId", "==", freeFireId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      throw new Error("Free Fire ID already registered");
    }

    // Verify Free Fire ID with API
    const freeFireData = await verifyFreeFireId(freeFireId, region);

    // Create anonymous user
    const userCredential = await signInAnonymously(auth);
    
    // Create user document in Firestore with Free Fire data
    const userDocRef = doc(db, "users", userCredential.user.uid);
    await setDoc(userDocRef, {
      uid: userCredential.user.uid,
      email: null,
      displayName: freeFireData.basicInfo?.nickname || freeFireId,
      photoURL: null,
      freeFireId: freeFireId,
      region: region,
      freeFireData: freeFireData,
      createdAt: new Date().toISOString(),
      totalCoins: 0,
      quizzesCompleted: 0,
    });
  };

  // Login with Free Fire ID and region
  const loginWithFreeFire = async (freeFireId: string, region: string) => {
    // Verify Free Fire ID with API
    const freeFireData = await verifyFreeFireId(freeFireId, region);

    // Find user by Free Fire ID
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("freeFireId", "==", freeFireId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error("Free Fire ID not found. Please sign up first.");
    }

    const userDoc = querySnapshot.docs[0];
    const existingUserData = userDoc.data() as UserData;

    // Verify region matches
    if (existingUserData.region !== region) {
      throw new Error("Region does not match. Please use the correct region.");
    }

    // Sign in anonymously first
    const userCredential = await signInAnonymously(auth);
    const newUid = userCredential.user.uid;

    // If the UID matches, just update the data
    if (userDoc.id === newUid) {
      await setDoc(
        doc(db, "users", newUid),
        {
          ...existingUserData,
          freeFireData: freeFireData,
          displayName: freeFireData.basicInfo?.nickname || freeFireId,
        },
        { merge: true }
      );
    } else {
      // If UIDs don't match, copy data to new anonymous user's document
      // This handles the case where anonymous auth creates a new user each time
      const newUserDocRef = doc(db, "users", newUid);
      await setDoc(newUserDocRef, {
        ...existingUserData,
        uid: newUid,
        freeFireData: freeFireData,
        displayName: freeFireData.basicInfo?.nickname || freeFireId,
      });
    }
  };

  const signup = async (email: string, password: string, displayName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with display name
    await updateProfile(userCredential.user, { displayName });
    
    // Create user document in Firestore
    const userDocRef = doc(db, "users", userCredential.user.uid);
    await setDoc(userDocRef, {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: displayName,
      photoURL: userCredential.user.photoURL,
      createdAt: new Date().toISOString(),
      totalCoins: 0,
      quizzesCompleted: 0,
    });
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    
    // Check if user document exists, if not create it
    const userDocRef = doc(db, "users", userCredential.user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
        createdAt: new Date().toISOString(),
        totalCoins: 0,
        quizzesCompleted: 0,
      });
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUserData(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserData(user);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userData,
    loading,
    signup,
    login,
    loginWithGoogle,
    signupWithFreeFire,
    loginWithFreeFire,
    logout,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};


