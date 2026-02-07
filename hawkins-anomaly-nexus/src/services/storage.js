import { openDB } from 'idb';
import { createAnomalyInFirestore } from './firestoreService';

const DB_NAME = 'hanex-db';
const STORE_ANOMALIES = 'anomalies';
const STORE_PENDING = 'pending_sync';

// Bumped version to 3 to ensure schema is fresh and correct
const dbPromise = openDB(DB_NAME, 3, {
    upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_ANOMALIES)) {
            db.createObjectStore(STORE_ANOMALIES, { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains(STORE_PENDING)) {
            db.createObjectStore(STORE_PENDING, { keyPath: 'id', autoIncrement: true });
        }
    },
});

export const saveAnomalyLocally = async (anomaly) => {
    const db = await dbPromise;

    // Create a copy of data to avoid mutating the original passed object unexpectedly
    const data = { ...anomaly };

    // Logic: 
    // If the anomaly object already has an 'id', we are updating it -> use 'put'.
    // If it does NOT have an 'id', we are creating it -> use 'add'. 
    // 'add' will let the DB generate the ID via autoIncrement.

    let id;

    if (data.id) {
        // Update existing
        await db.put(STORE_ANOMALIES, { ...data, syncStatus: 'pending' });
        id = data.id;
    } else {
        // Create new
        id = await db.add(STORE_ANOMALIES, { ...data, syncStatus: 'pending' });
    }

    // Add to pending queue with the confirmed ID (or just the data if we want to sync the *action*)
    // For the queue, we want a unique ID for the queue item itself, so we use 'add' there too.
    await db.add(STORE_PENDING, {
        ...data,
        // If we just generated an ID, we might want to attach it so the sync knows "which" local item this refers to
        localId: id,
        type: 'CREATE_ANOMALY',
        timestamp: Date.now()
    });
};

export const syncPendingItems = async (currentUserUid) => {
    if (!currentUserUid || !navigator.onLine) return;

    const db = await dbPromise;
    const pendingItems = await db.getAll(STORE_PENDING);

    for (const item of pendingItems) {
        try {
            if (item.type === 'CREATE_ANOMALY') {
                // Prepare data for Firestore (exclude local DB specific fields)
                const { id, type, localId, syncStatus, ...data } = item;

                await createAnomalyInFirestore(data, currentUserUid);

                // Remove from queue on success
                await db.delete(STORE_PENDING, id);

                // Update local cache status
                // We use 'localId' if we stored it, or fallback to trying to find it
                const targetId = localId || item.id;
                const localItem = await db.get(STORE_ANOMALIES, targetId);

                if (localItem) {
                    await db.put(STORE_ANOMALIES, { ...localItem, syncStatus: 'synced' });
                }
            }
        } catch (error) {
            console.error('Sync failed for item:', item, error);
        }
    }
};

export const getLocalAnomalies = async () => {
    const db = await dbPromise;
    return db.getAll(STORE_ANOMALIES);
};
