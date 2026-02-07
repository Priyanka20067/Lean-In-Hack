import { openDB } from 'idb';
import { createAnomalyInFirestore } from './firestoreService';

const DB_NAME = 'hanex-db';
const STORE_ANOMALIES = 'anomalies';
const STORE_PENDING = 'pending_sync';

// Bumped version to 4 to ensure schema is fresh and correct
const dbPromise = openDB(DB_NAME, 4, {
    upgrade(db) {
        if (db.objectStoreNames.contains(STORE_ANOMALIES)) {
            db.deleteObjectStore(STORE_ANOMALIES);
        }
        if (db.objectStoreNames.contains(STORE_PENDING)) {
            db.deleteObjectStore(STORE_PENDING);
        }
        db.createObjectStore(STORE_ANOMALIES, { keyPath: 'id', autoIncrement: true });
        db.createObjectStore(STORE_PENDING, { keyPath: 'id', autoIncrement: true });
    },
});

export const saveAnomalyLocally = async (anomaly) => {
    const db = await dbPromise;

    // Create a copy and remove id to ensure auto-increment kicks in
    const { id: _, ...data } = anomaly;

    let localId;

    if (anomaly.id) {
        // Update existing (if it already has a valid ID)
        await db.put(STORE_ANOMALIES, { ...anomaly, syncStatus: 'pending' });
        localId = anomaly.id;
    } else {
        // Create new
        localId = await db.add(STORE_ANOMALIES, { ...data, syncStatus: 'pending' });
    }

    // Add to pending queue without the 'id' field to let it auto-increment its own key
    await db.add(STORE_PENDING, {
        ...data,
        localId: localId,
        type: 'CREATE_ANOMALY',
        timestamp: Date.now()
    });

    return localId;
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
