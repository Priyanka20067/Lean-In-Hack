import React, { useState, useEffect } from 'react';
import { saveAnomalyLocally, getLocalAnomalies, syncPendingItems } from '../services/storage';
import { analyzeAnomaly } from '../services/ai';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { deleteDB } from 'idb';

export default function ReportPage() {
    const navigate = useNavigate();
    const { userId } = useAuth();
    const [description, setDescription] = useState('');
    const [locationName, setLocationName] = useState('');
    const [status, setStatus] = useState('');
    const [recentLogs, setRecentLogs] = useState([]);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleStatusChange = () => {
            setIsOnline(navigator.onLine);
            if (navigator.onLine && userId) {
                syncPendingItems(userId);
            }
        };
        window.addEventListener('online', handleStatusChange);
        window.addEventListener('offline', handleStatusChange);

        loadHistory();

        return () => {
            window.removeEventListener('online', handleStatusChange);
            window.removeEventListener('offline', handleStatusChange);
        };
    }, [userId]);

    const loadHistory = async () => {
        const logs = await getLocalAnomalies();
        setRecentLogs(logs.reverse().slice(0, 5));
    };

    const handleVoiceInput = () => {
        setDescription("Detected massive fluctuation in electromagnetic fields near the starcourt ruins.");
    };

    const handleSubmit = async () => {
        if (!description.trim()) return;

        setStatus('[ ANALYZING DATA... ]');

        const analysis = analyzeAnomaly(description);

        const newAnomaly = {
            description,
            locationName: locationName || 'Unknown Sector',
            ...analysis,
            timestamp: Date.now(),
            coordinates: { x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 }
        };

        try {
            await saveAnomalyLocally(newAnomaly);

            if (isOnline && userId) {
                setStatus('[ SYNCING TO CENTRAL NODE... ]');
                await syncPendingItems(userId);
            }

            setStatus('[ TRANSMISSION SUCCESSFUL ]');
            setDescription('');
            setLocationName('');
            loadHistory();

            setTimeout(() => {
                navigate('/map');
            }, 1500);
        } catch (e) {
            console.error(e);
            setStatus(`[ ERROR: ${e.message.toUpperCase()} ]`);
        }
    };

    const handleHardReset = async () => {
        if (confirm("THIS WILL WIPE THE LOCAL SECURE DATABASE. CONTINUE?")) {
            await deleteDB('hanex-db');
            window.location.reload();
        }
    };

    return (
        <div className="container animate-fade">
            <div className="bg-grid"></div>

            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h2 className="mono" style={{ color: 'var(--color-primary)', fontSize: '1.2rem', marginBottom: '0.2rem' }}>
                        FIELD_LOG_ENTRY
                    </h2>
                    <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--color-secondary)' }}>
                        OPERATOR: AGENT_{userId?.substring(0, 5).toUpperCase()}
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div className="mono" style={{ fontSize: '0.6rem', color: isOnline ? 'var(--color-secondary)' : 'var(--color-danger)' }}>
                        LINK: {isOnline ? 'ENCRYPTED' : 'OFFLINE'}
                    </div>
                </div>
            </div>

            <div className="hud-border" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                {/* Classified Stamp */}
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    border: '2px solid var(--color-danger)',
                    color: 'var(--color-danger)',
                    padding: '2px 8px',
                    fontSize: '0.6rem',
                    fontWeight: 'bold',
                    transform: 'rotate(15deg)',
                    opacity: 0.5,
                    pointerEvents: 'none',
                    fontFamily: 'JetBrains Mono'
                }}>
                    CLASSIFIED
                </div>

                <p className="mono" style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)', marginBottom: '0.5rem' }}>
                    SPECIFY LOCATION / SECTOR:
                </p>
                <input
                    type="text"
                    style={{
                        width: '100%',
                        background: 'rgba(0,0,0,0.5)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text)',
                        padding: '0.75rem',
                        fontFamily: 'JetBrains Mono',
                        fontSize: '0.8rem',
                        marginBottom: '1rem',
                        outline: 'none',
                    }}
                    placeholder="e.g. Starcourt Mall, Sector 7-G..."
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                />

                <p className="mono" style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)', marginBottom: '0.5rem' }}>
                    DESCRIBE DETECTED PHENOMENON:
                </p>

                <textarea
                    style={{
                        width: '100%',
                        background: 'rgba(0,0,0,0.5)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text)',
                        padding: '1rem',
                        fontFamily: 'JetBrains Mono',
                        fontSize: '0.9rem',
                        resize: 'none',
                        marginBottom: '1.5rem',
                        outline: 'none',
                        minHeight: '120px'
                    }}
                    placeholder="Input data stream..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <button onClick={handleVoiceInput} className="btn-primary" style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-dim)', background: 'transparent', boxShadow: 'none' }}>
                        🎤 AUDIO_FEED
                    </button>
                    <button onClick={handleSubmit} className="btn-primary">
                        TRANSMIT &rarr;
                    </button>
                </div>
            </div>

            {status && (
                <div className="mono" style={{
                    marginTop: '1.5rem',
                    textAlign: 'center',
                    fontSize: '0.8rem',
                    color: status.includes('ERROR') ? 'var(--color-danger)' : 'var(--color-primary)'
                }}>
                    {status}
                </div>
            )}

            {/* Database Summary Section */}
            <div style={{ marginTop: '3rem' }}>
                <h3 className="mono" style={{ fontSize: '0.8rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--color-text-dim)' }}>
                    RECENT_TRANSMISSIONS
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {recentLogs.map((log, i) => (
                        <div key={i} className="mono" style={{
                            fontSize: '0.7rem',
                            padding: '0.5rem',
                            background: 'rgba(30, 41, 59, 0.2)',
                            borderLeft: `2px solid ${log.urgency === 'High' ? 'var(--color-danger)' : 'var(--color-secondary)'}`,
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}>
                            <div>
                                <span style={{ color: 'var(--color-text-dim)' }}>[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                                <span style={{ marginLeft: '1rem' }}>{log.type}/{log.urgency}</span>
                            </div>
                            <div style={{ color: log.syncStatus === 'synced' ? 'var(--color-secondary)' : 'var(--color-accent)' }}>
                                {log.syncStatus === 'synced' ? 'SYNCED' : 'PENDING'}
                            </div>
                        </div>
                    ))}
                    {recentLogs.length === 0 && <p className="mono" style={{ fontSize: '0.7rem', color: '#444' }}>NO PREVIOUS DATA FOUND</p>}
                </div>
            </div>

            <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                <button onClick={handleHardReset} className="btn-primary btn-danger" style={{ fontSize: '0.6rem', padding: '0.4rem 1rem' }}>
                    WIPE_LOCAL_DATAVAULT
                </button>
            </div>

        </div>
    );
}
