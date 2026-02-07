import React, { useState, useEffect } from 'react';
import { saveAnomaly, getPendingAnomalies, getAllAnomalies } from '../services/storage';
import { analyzeAnomaly } from '../services/ai';
import { useNavigate } from 'react-router-dom';

export default function ReportPage() {
    const [description, setDescription] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [status, setStatus] = useState('');
    const [recentAnomalies, setRecentAnomalies] = useState([]);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const navigate = useNavigate();

    useEffect(() => {
        loadAnomalies();

        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const loadAnomalies = async () => {
        const all = await getAllAnomalies();
        setRecentAnomalies(all.reverse()); // Show newest first
    };

    const handleVoiceInput = () => {
        setIsRecording(true);
        setTimeout(() => {
            setDescription((prev) => prev + " The lights are flickering in the gym and it's getting cold. ");
            setIsRecording(false);
        }, 2000); // Mock delay
    };

    const handleSubmit = async () => {
        if (!description.trim()) return;

        setStatus('Analyzing...');

        // AI Analysis
        const analysis = analyzeAnomaly(description);

        const newAnomaly = {
            id: Date.now(),
            description,
            ...analysis,
            synced: 0, // Not synced yet
            timestamp: Date.now()
        };

        // Save Offline
        await saveAnomaly(newAnomaly);

        setStatus('Anomaly Logged (Offline)');
        setDescription('');

        // Refresh list
        await loadAnomalies();

        // Mock Sync attempt (if online)
        if (isOnline) {
            setStatus('Syncing to Nexus...');
            setTimeout(() => {
                setStatus('Transmitted Successfully.');
            }, 1000);
        }
    };

    return (
        <div className="container">
            <h2 className="glow-text" style={{ textAlign: 'center' }}>REPORT ANOMALY</h2>

            <div style={{
                background: 'var(--color-bg-panel)',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #333',
                marginBottom: '20px'
            }}>
                <div style={{ marginBottom: '10px', fontSize: '0.9rem', color: isOnline ? '#4caf50' : '#f44336' }}>
                    CONNECTION STATUS: {isOnline ? 'ONLINE' : 'OFFLINE (Local Mode)'}
                </div>

                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the strange event..."
                    style={{
                        width: '100%',
                        height: '100px',
                        background: '#000',
                        color: '#fff',
                        border: '1px solid #444',
                        padding: '10px',
                        fontSize: '1rem',
                        marginBottom: '10px'
                    }}
                />

                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <button
                        type="button"
                        onClick={handleVoiceInput}
                        style={{
                            flex: 1,
                            background: isRecording ? 'red' : '#333',
                            color: 'white',
                            border: 'none',
                            padding: '10px'
                        }}
                    >
                        {isRecording ? 'LISTENING...' : '🎤 VOICE INPUT'}
                    </button>
                </div>

                <button onClick={handleSubmit} className="btn-primary" style={{ width: '100%' }}>
                    SUBMIT REPORT
                </button>

                {status && <p style={{ marginTop: '10px', color: 'var(--color-primary)' }}>[{status}]</p>}
            </div>

            <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>RECENT LOGS</h3>
            <div>
                {recentAnomalies.length === 0 ? (
                    <p style={{ color: '#666' }}>No anomalies reported recently.</p>
                ) : (
                    recentAnomalies.map((a) => (
                        <div key={a.id} style={{
                            marginBottom: '10px',
                            padding: '10px',
                            borderLeft: `4px solid ${a.urgency === 'Code Red' || a.urgency === 'Critical' ? 'red' : 'orange'}`,
                            background: '#111'
                        }}>
                            <div style={{ fontWeight: 'bold' }}>{a.type} <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>({a.urgency})</span></div>
                            <div style={{ fontSize: '0.9rem', color: '#ccc' }}>{a.description}</div>
                            <div style={{ fontSize: '0.8rem', color: '#555' }}>
                                {new Date(a.timestamp).toLocaleTimeString()} - {a.synced ? 'Synced' : 'Local'}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
