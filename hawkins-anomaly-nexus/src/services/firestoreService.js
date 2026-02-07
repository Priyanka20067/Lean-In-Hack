import {
    collection,
    addDoc,
    updateDoc,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

// Anomalies
export const createAnomalyInFirestore = async (anomalyData, uid) => {
    return await addDoc(collection(db, 'anomalies'), {
        ...anomalyData,
        createdBy: uid,
        createdAt: serverTimestamp(),
        status: 'open'
    });
};

export const incrementUserPoints = async (userId, amount) => {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        const currentPoints = userSnap.data().points || 0;
        await updateDoc(userRef, { points: currentPoints + amount });
    }
};

export const subscribeToAnomalies = (callback) => {
    const q = query(collection(db, 'anomalies'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(data);
    });
};

export const updateAnomalyStatus = async (anomalyId, status) => {
    const ref = doc(db, 'anomalies', anomalyId);
    await updateDoc(ref, { status });
};

// Chat
export const sendMessageToFirestore = async (anomalyId, messageData) => {
    return await addDoc(collection(db, `chats/${anomalyId}/messages`), {
        ...messageData,
        timestamp: serverTimestamp()
    });
};

export const subscribeToMessages = (anomalyId, callback) => {
    const q = query(collection(db, `chats/${anomalyId}/messages`), orderBy('timestamp', 'asc'));
    return onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(data);
    });
};

export const getAnomalyCountForUser = async (uid) => {
    const q = query(collection(db, 'anomalies'), where('createdBy', '==', uid));
    const snap = await getDocs(q);
    return snap.size;
};
