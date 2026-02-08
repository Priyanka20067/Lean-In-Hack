import { db } from './firebase';
import {
    collection,
    addDoc,
    setDoc,
    doc,
    query,
    where,
    getDocs,
    getDoc,
    orderBy,
    serverTimestamp,
    onSnapshot,
    updateDoc,
    increment,
    arrayUnion
} from 'firebase/firestore';

// 🟦 JOB SUGGESTIONS
export const saveJobSuggestion = async (anomalyId, suggestion) => {
    try {
        await setDoc(doc(db, 'jobSuggestions', anomalyId), {
            ...suggestion,
            createdAt: serverTimestamp()
        });
    } catch (e) {
        console.error("Error saving job suggestion:", e);
        throw e;
    }
};

export const getJobSuggestion = async (anomalyId) => {
    try {
        const docRef = doc(db, 'jobSuggestions', anomalyId);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() : null;
    } catch (e) {
        console.error("Error getting job suggestion:", e);
        return null;
    }
};

// 🟦 LEARNING PATHS
export const getLearningPath = async (skill) => {
    try {
        const q = query(collection(db, 'learningPaths'), where('skill', '==', skill));
        const snapshot = await getDocs(q);
        return snapshot.empty ? null : snapshot.docs[0].data();
    } catch (e) {
        console.error("Error getting learning path:", e);
        return null;
    }
};

export const saveUserLearningProgress = async (userId, skill, stepIndex, completed) => {
    try {
        const progressRef = doc(db, 'userLearningProgress', `${userId}_${skill}`);
        await setDoc(progressRef, {
            userId,
            skill,
            [`steps.${stepIndex}`]: completed,
            updatedAt: serverTimestamp()
        }, { merge: true });
    } catch (e) {
        console.error("Error saving learning progress:", e);
    }
};

// 🟦 CODING CHALLENGES
export const getChallengesBySkill = async (skill) => {
    try {
        const q = query(collection(db, 'codingChallenges'), where('skill', '==', skill));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
        console.error("Error getting challenges:", e);
        return [];
    }
};

export const saveChallengeResult = async (userId, result) => {
    try {
        await addDoc(collection(db, 'challengeResults'), {
            userId,
            ...result,
            completedAt: serverTimestamp()
        });

        // Also update global user skills/points
        const userSkillRef = doc(db, 'userSkills', userId);

        // Use setDoc with merge to ensure document exists
        await setDoc(userSkillRef, {
            skills: {
                [result.skill]: increment(result.score)
            },
            points: increment(result.score),
            lastUpdated: serverTimestamp()
        }, { merge: true });

    } catch (e) {
        console.error("Error saving challenge result:", e);
    }
};

// 🟦 MOCK INTERVIEWS
export const getInterviewQuestions = async (role) => {
    try {
        const q = query(collection(db, 'interviewQuestions'), where('role', '==', role));
        const snapshot = await getDocs(q);
        return snapshot.empty ? [] : snapshot.docs[0].data().questions;
    } catch (e) {
        console.error("Error getting interview questions:", e);
        return [];
    }
};

export const saveInterviewScore = async (userId, role, score) => {
    try {
        await addDoc(collection(db, 'interviewScores'), {
            userId,
            role,
            score,
            completedAt: serverTimestamp()
        });

        // Update User Profile with Interview Score (Weighted)
        const userSkillRef = doc(db, 'userSkills', userId);
        await setDoc(userSkillRef, {
            points: increment(score),
            badges: arrayUnion('Interview Passed'), // Requires arrayUnion import
            lastUpdated: serverTimestamp()
        }, { merge: true });

    } catch (e) {
        console.error("Error saving interview score:", e);
    }
};

// 🟦 SKILL PROFILE
export const getUserSkillProfile = async (userId) => {
    try {
        const docRef = doc(db, 'userSkills', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            // Return empty structure instead of null to prevent UI errors
            return { skills: {}, badges: [], points: 0, level: 'Recruit' };
        }
    } catch (e) {
        console.error("Error getting user skill profile:", e);
        return { skills: {}, badges: [], points: 0, level: 'Recruit' };
    }
};

// 🟦 GEEK ROOM (CHAT)
export const subscribeToGeekRoom = (skill, callback) => {
    const q = query(
        collection(db, `geekRooms/${skill}/messages`),
        orderBy('timestamp', 'asc')
    );
    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(messages);
    }, (error) => {
        console.log("Geek Room sync paused (offline):", error.code);
        // Suppress network errors in console
    });
};

export const sendMessageToGeekRoom = async (skill, message) => {
    try {
        await addDoc(collection(db, `geekRooms/${skill}/messages`), {
            ...message,
            timestamp: serverTimestamp()
        });
    } catch (e) {
        console.error("Error sending message:", e);
    }
};
