import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { subscribeToAnomalies } from '../services/firestoreService';
import { useAuth } from '../context/AuthContext';

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
        highUrgency: anomalies.filter(a => a.urgency === 'High').length,
        paranormal: anomalies.filter(a => a.type === 'Paranormal').length,
        points: userData?.points || 0
    };

    return (
        <div className="container animate-fade">
            <div className="bg-grid" style={{ opacity: 0.1 }}></div>
            <div className="bg-scanlines"></div>

            <header style={{ marginBottom: '2rem' }}>
                <h2 className="mono" style={{ color: 'var(--color-primary)', letterSpacing: '0.4em' }}>COMMAND_CENTER</h2>
                <p className="mono" style={{ fontSize: '0.6rem', color: 'var(--color-text-dim)' }}>CENTRAL_INTELLIGENCE_NODE: HAWKINS</p>
            </header>

            {/* Stats Cluster */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div className="hud-border" style={{ padding: '1rem' }}>
                    <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--color-text-dim)' }}>DETECTION_INDEX</div>
                    <div className="mono" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{stats.total}</div>
                </div>
                <div className="hud-border" style={{ padding: '1rem' }}>
                    <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--color-text-dim)' }}>CRITICAL_EVENTS</div>
                    <div className="mono" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-danger)' }}>{stats.highUrgency}</div>
                </div>
                <div className="hud-border" style={{ padding: '1rem' }}>
                    <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--color-text-dim)' }}>GATE_SIGNATURES</div>
                    <div className="mono" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-accent)' }}>{stats.paranormal}</div>
                </div>
                <div className="hud-border" style={{ padding: '1rem' }}>
                    <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--color-text-dim)' }}>AGENT_CREDITS</div>
                    <div className="mono" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-secondary)' }}>{stats.points}</div>
                </div>
            </div>

            {/* Operational Feed */}
            <div className="hud-border" style={{ minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '0.75rem 1rem', background: 'rgba(30, 41, 59, 0.4)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between' }}>
                    <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--color-primary)' }}>OPERATIONAL_DATA_FEED</span>
                    <span className="mono" style={{ fontSize: '0.6rem' }}>LIVE // SECURE</span>
                </div>

                <div style={{ padding: '1rem', overflowY: 'auto', flex: 1 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr className="mono" style={{ fontSize: '0.6rem', color: 'var(--color-text-dim)', borderBottom: '1px solid var(--color-border)' }}>
                                <th style={{ padding: '0.5rem' }}>TIME</th>
                                <th style={{ padding: '0.5rem' }}>TYPE</th>
                                <th style={{ padding: '0.5rem' }}>URGENCY</th>
                                <th style={{ padding: '0.5rem' }}>LINK</th>
                            </tr>
                        </thead>
                        <tbody>
                            {anomalies.map((a, i) => (
                                <tr key={i} className="mono" style={{ fontSize: '0.7rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '0.8rem 0.5rem', color: 'var(--color-text-dim)' }}>{new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                    <td style={{ padding: '0.8rem 0.5rem' }}>{(a.type || 'Unknown').toUpperCase()}</td>
                                    <td style={{ padding: '0.8rem 0.5rem', color: a.urgency === 'High' ? 'var(--color-danger)' : 'inherit' }}>{(a.urgency || 'Low').toUpperCase()}</td>
                                    <td style={{ padding: '0.8rem 0.5rem' }}>
                                        <button onClick={() => navigate(`/room/${a.id}`)} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.6rem' }}>[ OPEN ]</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                <button onClick={() => navigate('/map')} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>TACTICAL_MAP</button>
                <button onClick={() => navigate('/profile')} className="btn-primary" style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-dim)', boxShadow: 'none' }}>PROFILE</button>
            </div>
        </div>
    );
}
