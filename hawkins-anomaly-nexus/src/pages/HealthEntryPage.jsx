import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Scene3D from '../components/Scene3D';

export default function HealthEntryPage() {
    const navigate = useNavigate();
    const { userId } = useAuth();

    return (
        <>
            <Scene3D variant="health" />
            <div className="container animate-fade" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem' }}>

                <div className="glass-panel" style={{ maxWidth: '800px', width: '100%', textAlign: 'center' }}>
                    <div style={{ marginBottom: '2.5rem' }}>
                        <div style={{ fontSize: '3rem', color: 'var(--theme-health)', marginBottom: '1rem' }}>🧬</div>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', background: 'linear-gradient(to right, white, var(--theme-health))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            BIO-METRIC HUB
                        </h1>
                        <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>
                            Advanced health monitoring, symptom analysis, and secure medical logging.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                        <button
                            onClick={() => navigate('/health/symptoms')}
                            className="glass-panel"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '2rem',
                                border: '1px solid rgba(255,255,255,0.1)',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                        >
                            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📋</div>
                            <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Check Symptoms</h3>
                            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Real-time analysis & guidance</p>
                        </button>

                        <button
                            onClick={() => navigate('/health/reminders')}
                            className="glass-panel"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '2rem',
                                border: '1px solid rgba(255,255,255,0.1)',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                        >
                            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⏰</div>
                            <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Set Reminders</h3>
                            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Medicine & follow-up tracking</p>
                        </button>

                        <button
                            onClick={() => navigate('/health/log')}
                            className="glass-panel"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '2rem',
                                border: '1px solid rgba(255,255,255,0.1)',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                        >
                            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📂</div>
                            <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Secure Logs</h3>
                            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Manage your medical records</p>
                        </button>
                    </div>

                    <div style={{ padding: '1.5rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left', marginBottom: '2rem' }}>
                        <div style={{ fontSize: '1.5rem' }}>🚨</div>
                        <div>
                            <strong style={{ color: '#f87171' }}>EMERGENCY NOTICE</strong>
                            <p style={{ fontSize: '0.8rem', color: '#fca5a5' }}>
                                If you experience difficulty breathing, chest pain, or severe allergic reactions, contact emergency services immediately or go to the nearest hospital.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/map')}
                        className="btn-3d"
                    >
                        RETURN TO NAV-MAP
                    </button>
                </div>
            </div>
        </>
    );
}
