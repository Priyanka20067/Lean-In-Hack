import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getHealthLogs } from '../services/healthService';
import Scene3D from '../components/Scene3D';

export default function HealthLogPage() {
    const navigate = useNavigate();
    const { userId } = useAuth();
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadLogs();
    }, [userId]);

    const loadLogs = async () => {
        if (userId) {
            setIsLoading(true);
            const data = await getHealthLogs(userId);
            setLogs(data);
            setIsLoading(false);
        }
    };

    return (
        <>
            <Scene3D variant="health" />
            <div className="container animate-fade" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: '2rem' }}>

                <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', background: 'linear-gradient(to right, white, var(--theme-health))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        SECURE MEDICAL LOG
                    </h1>
                    <p style={{ color: '#94a3b8' }}>Encrypted repository of bio-metric history.</p>
                </header>

                <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '800px', width: '100%', margin: '0 auto' }}>
                    {isLoading ? (
                        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
                            <div className="animate-pulse" style={{ color: 'var(--theme-health)' }}>SYNCHRONIZING RECORDS...</div>
                        </div>
                    ) : logs.map((log) => (
                        <div key={log.id} className="glass-panel" style={{
                            padding: '1.5rem',
                            borderLeft: `5px solid ${log.urgency === 'High' ? '#ef4444' : log.urgency === 'Medium' ? '#f59e0b' : '#10b981'}`,
                            position: 'relative',
                            background: 'rgba(30, 41, 59, 0.4)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 'bold' }}>
                                        TIMESTAMP: {log.createdAt?.toDate ? log.createdAt.toDate().toLocaleString() : 'RECENT_ENTRY'}
                                    </div>
                                    <h3 style={{ color: 'white', marginTop: '4px' }}>{log.symptoms.join(' + ').toUpperCase()}</h3>
                                </div>
                                <span style={{
                                    fontSize: '0.65rem',
                                    padding: '4px 10px',
                                    borderRadius: '4px',
                                    background: log.urgency === 'High' ? 'rgba(239, 68, 68, 0.1)' : log.urgency === 'Medium' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                    color: log.urgency === 'High' ? '#f87171' : log.urgency === 'Medium' ? '#fbbf24' : '#34d399',
                                    border: `1px solid ${log.urgency === 'High' ? '#ef4444' : log.urgency === 'Medium' ? '#f59e0b' : '#10b981'}`,
                                    fontWeight: 'bold'
                                }}>
                                    {log.urgency}
                                </span>
                            </div>

                            {log.others && (
                                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem', padding: '0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
                                    "{log.others}"
                                </p>
                            )}

                            <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                                <strong style={{ color: 'var(--theme-health)', fontSize: '0.75rem', display: 'block', marginBottom: '4px' }}>GUIDANCE STORED:</strong>
                                <p>{log.guidance?.tips.join(' • ')}</p>
                            </div>

                            <button
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    if (window.confirm('Wipe this record from the local nexus?')) {
                                        const { deleteHealthRecord } = await import('../services/healthService');
                                        await deleteHealthRecord(log.id);
                                        setLogs(prev => prev.filter(l => l.id !== log.id));
                                    }
                                }}
                                style={{
                                    marginTop: '1.5rem',
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#f87171',
                                    fontSize: '0.7rem',
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                    padding: 0
                                }}
                            >
                                DELETE DATA POINT
                            </button>
                        </div>
                    ))}

                    {!isLoading && logs.length === 0 && (
                        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                            <h2 style={{ color: 'white' }}>NO DATA FOUND</h2>
                            <p style={{ color: '#94a3b8' }}>Your medical history is currently clear.</p>
                            <button onClick={() => navigate('/health/symptoms')} className="btn-3d" style={{ marginTop: '2rem' }}>START NEW SCAN</button>
                        </div>
                    )}
                </div>

                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <button onClick={() => navigate('/health')} className="btn-3d">
                        RETURN TO BIO-HUB
                    </button>
                </div>
            </div>
        </>
    );
}
