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
    const [lastReportId, setLastReportId] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);

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
        setIsAnalyzing(true);

        // Simulate AI "Thinking"
        await new Promise(resolve => setTimeout(resolve, 2000));

        const analysis = analyzeAnomaly(description);
        setAnalysisResult(analysis);
        setIsAnalyzing(false);

        const newAnomaly = {
            description,
            locationName: locationName || 'Unknown Sector',
            ...analysis,
            timestamp: Date.now(),
            coordinates: { x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 },
            status: 'open',
            createdBy: userId
        };

        try {
            const savedId = await saveAnomalyLocally(newAnomaly);
            // Store the ID in state for the UI to use
            setLastReportId(savedId);

            if (isOnline && userId) {
                setStatus('[ SYNCING TO CENTRAL NODE... ]');
                await syncPendingItems(userId);
                const { incrementUserPoints } = await import('../services/firestoreService');
                await incrementUserPoints(userId, 10);
            }

            setStatus('[ TRANSMISSION SUCCESSFUL (+10 PTS) ]');
            loadHistory();
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

    if (analysisResult) {
        return (
            <div className="container animate-fade">
                <div className="bg-grid"></div>
                <div className="hud-border" style={{ padding: '2rem', textAlign: 'center' }}>
                    <h2 className="mono glitch" style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>AI ANALYSIS COMPLETE</h2>
                    <div style={{
                        padding: '1.5rem',
                        background: 'rgba(0,0,0,0.5)',
                        border: `2px solid ${analysisResult.color}`,
                        marginBottom: '2rem'
                    }}>
                        <p className="mono" style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>DETECTED FIELD:</p>
                        <h1 className="mono" style={{ color: analysisResult.color, textShadow: `0 0 10px ${analysisResult.color}` }}>
                            {analysisResult.type.toUpperCase()}
                        </h1>
                        <p className="mono" style={{ fontSize: '0.7rem', marginTop: '1rem', opacity: 0.8 }}>
                            CONFIDENCE: {analysisResult.confidence}% | URGENCY: {analysisResult.urgency}
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {analysisResult.type === 'Government' && (
                            <button onClick={() => navigate('/map')} className="btn-primary" style={{ width: '100%', border: `1px solid ${analysisResult.color}` }}>
                                ACCESS GOVERNMENT MAP &rarr;
                            </button>
                        )}
                        {analysisResult.type === 'Job' && (
                            <button
                                onClick={() => navigate(`/jobs/suggestion/${lastReportId}`, { state: { description: description } })}
                                className="btn-primary"
                                style={{ width: '100%', border: `1px solid ${analysisResult.color}` }}
                            >
                                VIEW JOB OPPORTUNITIES &rarr;
                            </button>
                        )}
                        {analysisResult.type === 'Health Tech' && (
                            <button onClick={() => navigate('/health')} className="btn-primary" style={{ width: '100%', border: `1px solid ${analysisResult.color}` }}>
                                ACCESS HEALTHCARE SUPPORT &rarr;
                            </button>
                        )}

                        <div style={{ opacity: 0.5, pointerEvents: 'none' }}>
                            <button disabled className="btn-primary" style={{ width: '100%', filter: 'grayscale(1)', marginBottom: '0.5rem' }}>RESTRICTED ACCESS</button>
                            <button disabled className="btn-primary" style={{ width: '100%', filter: 'grayscale(1)' }}>RESTRICTED ACCESS</button>
                        </div>

                        <button onClick={() => { setAnalysisResult(null); setDescription(''); setLocationName(''); setStatus(''); }} className="btn-primary" style={{ marginTop: '1rem', background: 'transparent', border: '1px solid var(--color-border)' }}>
                            LOG ANOTHER ENTRY
                        </button>
                    </div>
                </div>
            </div>
        );
    }

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
                {isAnalyzing && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0,0,0,0.8)',
                        zIndex: 200,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <div className="loader-ah"></div>
                        <p className="mono glitch" style={{ marginTop: '1rem', color: 'var(--color-primary)' }}>RUNNING GAIA_AI ANALYSIS...</p>
                    </div>
                )}
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
                    <button onClick={handleVoiceInput} disabled={isAnalyzing} className="btn-primary" style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-dim)', background: 'transparent', boxShadow: 'none' }}>
                        🎤 AUDIO_FEED
                    </button>
                    <button onClick={handleSubmit} disabled={isAnalyzing} className="btn-primary">
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
