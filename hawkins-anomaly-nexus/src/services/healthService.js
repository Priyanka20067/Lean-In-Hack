import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from 'firebase/firestore';

const GUIDANCE_RULES = [
    {
        symptoms: ['Fever', 'Headache'],
        cause: 'Mild viral or dehydration',
        tips: 'Rest, stay hydrated, and monitor temperature.',
        urgency: 'Low'
    },
    {
        symptoms: ['Chest pain'],
        cause: 'High attention required',
        tips: 'Avoid physical exertion. If pain persists or spreads, seek immediate help.',
        urgency: 'High'
    },
    {
        symptoms: ['Stomach pain'],
        cause: 'Possible food-related issue or indigestion',
        tips: 'Try light meals, stay hydrated, and rest.',
        urgency: 'Medium'
    },
    {
        symptoms: ['Cold / cough'],
        cause: 'Common respiratory irritation',
        tips: 'Warm fluids, rest, and steam inhalation.',
        urgency: 'Low'
    }
];

export const getHealthGuidance = (selectedSymptoms) => {
    let result = {
        causes: [],
        tips: [],
        urgency: 'Low',
        warning: false
    };

    GUIDANCE_RULES.forEach(rule => {
        const match = rule.symptoms.every(s => selectedSymptoms.includes(s)) ||
            (rule.symptoms.length === 1 && selectedSymptoms.includes(rule.symptoms[0]));

        if (match) {
            result.causes.push(rule.cause);
            result.tips.push(rule.tips);
            if (rule.urgency === 'High') result.urgency = 'High';
            else if (rule.urgency === 'Medium' && result.urgency !== 'High') result.urgency = 'Medium';
        }
    });

    if (selectedSymptoms.length > 3 || result.urgency === 'High') {
        result.warning = true;
    }

    // Default if no specific match
    if (result.causes.length === 0) {
        result.causes.push('General malaise');
        result.tips.push('Monitor your condition and rest.');
    }

    return result;
};

export const saveHealthRecord = async (userId, data) => {
    try {
        await addDoc(collection(db, 'healthRecords'), {
            userId,
            ...data,
            createdAt: serverTimestamp()
        });
    } catch (e) {
        console.error("Error saving health record:", e);
        throw e;
    }
};

export const getHealthLogs = async (userId) => {
    try {
        const q = query(
            collection(db, 'healthRecords'),
            where('userId', '==', userId)
        );
        const snapshot = await getDocs(q);
        const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Manual sort to avoid Firebase index requirement
        return logs.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
    } catch (e) {
        console.error("Error fetching health logs:", e);
        return [];
    }
};

export const saveReminder = async (userId, reminder) => {
    try {
        await addDoc(collection(db, 'healthReminders'), {
            userId,
            ...reminder,
            createdAt: serverTimestamp()
        });
    } catch (e) {
        console.error("Error saving reminder:", e);
        throw e;
    }
};

export const getReminders = async (userId) => {
    try {
        const q = query(
            collection(db, 'healthReminders'),
            where('userId', '==', userId)
        );
        const snapshot = await getDocs(q);
        const reminders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Manual sort to avoid Firebase index requirement
        return reminders.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
    } catch (e) {
        console.error("Error fetching reminders:", e);
        return [];
    }
};
