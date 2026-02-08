import React, { useState, useEffect } from 'react';
import { saveAnomalyLocally, getLocalAnomalies, syncPendingItems } from '../services/storage';
import { analyzeAnomaly } from '../services/ai';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { deleteDB } from 'idb';
import Scene3D from '../components/Scene3D';

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

        setStatus('_INITIALIZING GAIA_AI ANALYSIS');
        setIsAnalyzing(true);
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
            setLastReportId(savedId);

            if (isOnline && userId) {
                setStatus('_SYNCING TO CENTRAL_VIRTUALIZATION_NODE');
                await syncPendingItems(userId);
                const { incrementUserPoints } = await import('../services/firestoreService');
                await incrementUserPoints(userId, 10);
                setStatus('_TRANSMISSION COMPLETE (+10 XP)');
            } else {
                setStatus('_DATA STORED LOCALLY');
            }
            loadHistory();
        } catch (e) {
            console.error(e);
            setStatus(`_CRITICAL FAILURE: ${e.message.toUpperCase()}`);
        }
    };

    const handleHardReset = async () => {
        if (confirm("Wipe all local secure data? This cannot be undone.")) {
            await deleteDB('hanex-db');
            window.location.reload();
        }
    };

    if (analysisResult) {
        return (
            <>
                <Scene3D variant="gov" />
                <div className="container animate-fade" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '2rem' }}>
                    <div className="glass-panel" style={{ maxWidth: '600px', width: '100%', borderTop: `4px solid ${analysisResult.color}` }}>
                        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                            <div style={{ fontSize: '0.8rem', color: '#94a3b8', letterSpacing: '4px', marginBottom: '1rem' }}>NEURAL ANALYSIS COMPLETE</div>
                            <h2 style={{ fontSize: '2.5rem', color: 'white', marginBottom: '0.5rem' }}>SIGNATURE IDENTIFIED</h2>
                        </div>

                        <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', border: `1px solid ${analysisResult.color}`, marginBottom: '2.5rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.8rem', color: analysisResult.color, marginBottom: '0.5rem', fontWeight: 'bold', textTransform: 'uppercase' }}>DETECTED CLASS</div>
                            <h1 style={{ fontSize: '3rem', color: 'white', textShadow: `0 0 20px ${analysisResult.color}` }}>{analysisResult.type.toUpperCase()}</h1>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1.5rem', color: '#cbd5e1', fontSize: '0.85rem' }}>
                                <span>CONFIDENCE: {analysisResult.confidence}%</span>
                                <span>URGENCY: {analysisResult.urgency?.toUpperCase()}</span>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {analysisResult.type === 'Government' && (
                                <button onClick={() => navigate('/map')} className="btn-3d" style={{ background: analysisResult.color, borderColor: analysisResult.color }}>OPEN TACTICAL MAP</button>
                            )}
                            {analysisResult.type === 'Job' && (
                                <button onClick={() => navigate(`/jobs/suggestion/${lastReportId}`, { state: { description } })} className="btn-3d" style={{ background: analysisResult.color, borderColor: analysisResult.color }}>EXPLORE CAREER PATHS</button>
                            )}
                            {analysisResult.type === 'Health Tech' && (
                                <button onClick={() => navigate('/health')} className="btn-3d" style={{ background: analysisResult.color, borderColor: analysisResult.color }}>INITIATE MEDICAL SCAN</button>
                            )}

                            <button onClick={() => { setAnalysisResult(null); setDescription(''); setLocationName(''); setStatus(''); }} className="btn-3d" style={{ opacity: 0.6 }}>NEW FIELD REPORT</button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Scene3D variant="gov" />
            <div className="container animate-fade" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: '2rem' }}>

                <header style={{ marginBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1.5rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--theme-gov)', letterSpacing: '4px', fontWeight: 'bold', marginBottom: '0.5rem' }}>OPERATIVE FIELD LOG</div>
                    <h1 style={{ fontSize: '2.5rem', color: 'white' }}>DATA_INGESTION</h1>
                    <div style={{ fontSize: '0.7rem', color: isOnline ? '#10b981' : '#f87171', marginTop: '0.5rem' }}>
                        SECURE_LINK: {isOnline ? 'ESTABLISHED' : 'LOCAL_VIRTUALIZATION_ONLY'}
                    </div>
                </header>

                <div className="glass-panel" style={{ maxWidth: '800px', width: '100%', margin: '0 auto', padding: '3rem', position: 'relative' }}>
                    {isAnalyzing && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.9)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '16px' }}>
                            <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid var(--theme-gov)', borderTopColor: 'transparent', borderRadius: '50%', marginBottom: '1.5rem' }}></div>
                            <p style={{ color: 'var(--theme-gov)', letterSpacing: '2px', fontWeight: 'bold' }}>RUNNING NEURAL ANALYSIS...</p>
                        </div>
                    )}

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'bold', display: 'block', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Sector Identification</label>
                        <input
                            type="text"
                            value={locationName}
                            onChange={(e) => setLocationName(e.target.value)}
                            placeholder="e.g. STARCOURT_NODES / SECTOR_7G"
                            style={{
                                width: '100%',
                                background: 'rgba(0,0,0,0.3)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                padding: '1.25rem',
                                color: 'white',
                                fontFamily: 'monospace',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '2.5rem' }}>
                        <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'bold', display: 'block', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Phenomenon Stream Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Input comprehensive field observation data..."
                            style={{
                                width: '100%',
                                minHeight: '180px',
                                background: 'rgba(0,0,0,0.3)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                padding: '1.5rem',
                                color: 'white',
                                fontFamily: 'monospace',
                                fontSize: '1rem',
                                outline: 'none',
                                resize: 'none',
                                lineHeight: '1.6'
                            }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <button onClick={handleVoiceInput} disabled={isAnalyzing} className="btn-3d" style={{ opacity: 0.6 }}>AUDIO_SYNC_FEED</button>
                        <button onClick={handleSubmit} disabled={isAnalyzing || !description.trim()} className="btn-3d" style={{ background: 'var(--theme-gov)', borderColor: 'var(--theme-gov)' }}>TRANSMIT_DATA</button>
                    </div>

                    {status && (
                        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--theme-gov)', fontFamily: 'monospace', opacity: 0.8 }}>
                            {status}
                        </div>
                    )}
                </div>

                <div style={{ maxWidth: '800px', width: '100%', margin: '4rem auto 0' }}>
                    <h3 style={{ fontSize: '0.8rem', color: '#64748b', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', marginBottom: '1.5rem', letterSpacing: '2px' }}>RECENT_TRANSMISSIONS</h3>
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                        {recentLogs.map((log, i) => (
                            <div key={i} className="glass-panel" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', borderLeft: `3px solid ${log.urgency === 'High' ? '#ef4444' : 'var(--theme-gov)'}` }}>
                                <div>
                                    <span style={{ color: '#64748b', fontFamily: 'monospace' }}>[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                                    <span style={{ marginLeft: '1.5rem', color: 'white', fontWeight: 'bold' }}>{log.type?.toUpperCase()} / {log.urgency?.toUpperCase()}</span>
                                </div>
                                <span style={{ color: log.syncStatus === 'synced' ? '#10b981' : 'var(--theme-gov)', fontSize: '0.7rem', fontWeight: 'bold' }}>{log.syncStatus?.toUpperCase()}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '5rem', paddingBottom: '3rem' }}>
                    <button onClick={handleHardReset} style={{ background: 'transparent', border: 'none', color: '#f87171', fontSize: '0.7rem', textDecoration: 'underline', cursor: 'pointer', opacity: 0.5 }}>WIPE_LOCAL_DATAVAULT</button>
                </div>
            </div>
        </>
    );
}
