import { openDB } from 'idb';

const DB_NAME = 'hanex-db';
const STORE_NAME = 'anomalies';

const dbPromise = openDB(DB_NAME, 1, {
    upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
            const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            store.createIndex('synced', 'synced');
        }
    },
});

export const saveAnomaly = async (anomaly) => {
    const db = await dbPromise;
    return db.put(STORE_NAME, anomaly);
};

export const getPendingAnomalies = async () => {
    const db = await dbPromise;
    return db.getAllFromIndex(STORE_NAME, 'synced', 0); // 0 = false (not synced)
};

export const markSynced = async (id) => {
    const db = await dbPromise;
    const anomaly = await db.get(STORE_NAME, id);
    if (anomaly) {
        anomaly.synced = 1; // 1 = true
        await db.put(STORE_NAME, anomaly);
    }
};

export const getAllAnomalies = async () => {
    const db = await dbPromise;
    return db.getAll(STORE_NAME);
};
