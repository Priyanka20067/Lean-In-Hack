import React, { createContext, useContext, useEffect, useState } from 'react';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Check if user doc exists, if not create it
                const userRef = doc(db, 'users', user.uid);
                const userSnap = await getDoc(userRef);

                if (!userSnap.exists()) {
                    await setDoc(userRef, {
                        uid: user.uid,
                        role: 'citizen',
                        trustScore: 10,
                        points: 0,
                        joinedAt: serverTimestamp(),
                        lastActive: serverTimestamp()
                    });
                }
                setCurrentUser(user);
            } else {
                // Auto sign-in anonymously
                try {
                    await signInAnonymously(auth);
                } catch (error) {
                    console.error("Error signing in anonymously:", error);
                }
                setCurrentUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userId: currentUser?.uid
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
