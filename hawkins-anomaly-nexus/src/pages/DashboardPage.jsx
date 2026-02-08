import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { subscribeToAnomalies } from '../services/firestoreService';
import { useAuth } from '../context/AuthContext';
import Scene3D from '../components/Scene3D';

export default function DashboardPage() {
    const [anomalies, setAnomalies] = useState([]);
    const { userData } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = subscribeToAnomalies(setAnomalies);
        return () => unsubscribe();
    }, []);

    const stats = {
        total: anomalies.length,
        open: anomalies.filter(a => a.status === 'open').length,
        resolved: anomalies.filter(a => a.status === 'resolved').length,
        government: anomalies.filter(a => (a.type || '').toLowerCase().includes('gov')).length,
        health: anomalies.filter(a => (a.type || '').toLowerCase().includes('health')).length,
        paranormal: anomalies.filter(a => (a.type || '').toLowerCase().includes('paranormal')).length,
        points: userData?.points || 0
    };

    return (
        <>
            <Scene3D variant="gov" />
            <div className="container animate-fade" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: '2rem' }}>

                <header style={{ marginBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--theme-gov)', letterSpacing: '4px', fontWeight: 'bold' }}>HAWKINS CENTRAL COMMAND</div>
                            <h1 style={{ fontSize: '2.5rem', color: 'white', marginBottom: '0.5rem' }}>DASHBOARD_VIRTUALIZATION</h1>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>ACCESS_LEVEL: 04</div>
                            <div style={{ fontSize: '1.2rem', color: 'var(--theme-gov)', fontWeight: 'bold' }}>{userData?.points || 0} XP</div>
                        </div>
                    </div>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--theme-gov)' }}>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 'bold' }}>ACTIVE SIGNATURES</div>
                        <div style={{ fontSize: '2rem', color: 'white', fontWeight: 'bold' }}>{stats.total}</div>
                    </div>
                    <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #f87171' }}>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 'bold' }}>OPEN ANOMALIES</div>
                        <div style={{ fontSize: '2rem', color: '#f87171', fontWeight: 'bold' }}>{stats.open}</div>
                    </div>
                    <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #34d399' }}>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 'bold' }}>RESOLVED PROTOCOLS</div>
                        <div style={{ fontSize: '2rem', color: '#34d399', fontWeight: 'bold' }}>{stats.resolved}</div>
                    </div>
                </div>

                <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
                    <div style={{ padding: '1rem 1.5rem', background: 'rgba(30, 41, 59, 0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--theme-gov)', fontWeight: 'bold', letterSpacing: '1px' }}>TELEMETRY_DATA_FEED</span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></div>
                            <span style={{ fontSize: '0.6rem', color: '#94a3b8' }}>LIVE_SYNC</span>
                        </div>
                    </div>

                    <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ fontSize: '0.7rem', color: '#64748b', borderBottom: '1px solid rgba(255,255,255,0.05)', textTransform: 'uppercase' }}>
                                    <th style={{ padding: '1rem' }}>SOP_TIMESTAMP</th>
                                    <th style={{ padding: '1rem' }}>SECTOR</th>
                                    <th style={{ padding: '1rem' }}>URGENCY_INDEX</th>
                                    <th style={{ padding: '1rem', textAlign: 'right' }}>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {anomalies.map((a, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{ padding: '1.25rem 1rem', fontSize: '0.85rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                                            {new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td style={{ padding: '1.25rem 1rem', fontSize: '0.9rem', color: 'white', fontWeight: 'bold' }}>
                                            {(a.type || 'Unknown').toUpperCase()}
                                        </td>
                                        <td style={{ padding: '1.25rem 1rem' }}>
                                            <span style={{
                                                fontSize: '0.7rem',
                                                padding: '2px 8px',
                                                borderRadius: '4px',
                                                background: a.urgency === 'High' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.05)',
                                                color: a.urgency === 'High' ? '#f87171' : '#94a3b8',
                                                border: `1px solid ${a.urgency === 'High' ? '#ef4444' : 'rgba(255,255,255,0.1)'}`
                                            }}>
                                                {(a.urgency || 'Low').toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.25rem 1rem', textAlign: 'right' }}>
                                            <button onClick={() => navigate(`/room/${a.id}`)} className="btn-3d" style={{ fontSize: '0.7rem', padding: '0.4rem 0.8rem' }}>
                                                ESTABLISH_LINK
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1.5rem' }}>
                    <button onClick={() => navigate('/map')} className="btn-3d" style={{ flex: 1, background: 'var(--theme-gov)', borderColor: 'var(--theme-gov)' }}>OPEN TACTICAL NAV_MAP</button>
                    <button onClick={() => navigate('/profile')} className="btn-3d" style={{ flex: 0.3, opacity: 0.7 }}>OPERATIVE_PROFILE</button>
                </div>
            </div>
        </>
    );
}
