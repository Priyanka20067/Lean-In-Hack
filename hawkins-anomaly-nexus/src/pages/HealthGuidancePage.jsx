import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getHealthGuidance } from '../services/healthService';
import Scene3D from '../components/Scene3D';

export default function HealthGuidancePage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [guidance, setGuidance] = useState(null);

    useEffect(() => {
        if (!state || !state.selectedSymptoms) {
            navigate('/health/symptoms');
            return;
        }

        const res = getHealthGuidance(state.selectedSymptoms);
        setGuidance(res);
    }, [state, navigate]);

    if (!guidance) return null;

    return (
        <>
            <Scene3D variant="health" />
            <div className="container animate-fade" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem' }}>

                <div className="glass-panel" style={{ maxWidth: '600px', width: '100%', borderTop: '4px solid var(--theme-health)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔬</div>
                        <h1 style={{ color: 'var(--theme-health)', fontSize: '1.8rem', marginBottom: '0.5rem' }}>ANALYSIS RESULTS</h1>
                        <div style={{
                            display: 'inline-block',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            background: guidance.urgency === 'High' ? 'rgba(239, 68, 68, 0.2)' : guidance.urgency === 'Medium' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                            color: guidance.urgency === 'High' ? '#f87171' : guidance.urgency === 'Medium' ? '#fbbf24' : '#34d399',
                            border: `1px solid ${guidance.urgency === 'High' ? '#f87171' : guidance.urgency === 'Medium' ? '#fbbf24' : '#34d399'}`,
                            textTransform: 'uppercase'
                        }}>
                            Priority: {guidance.urgency}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
                        <section>
                            <h2 style={{ fontSize: '0.9rem', color: 'var(--theme-health)', textTransform: 'uppercase', marginBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.25rem' }}>
                                Potential Etiology
                            </h2>
                            <ul style={{ paddingLeft: '1rem', color: '#cbd5e1', fontSize: '0.9rem', display: 'grid', gap: '0.5rem' }}>
                                {guidance.causes.map((c, i) => <li key={i}>{c}</li>)}
                            </ul>
                        </section>

                        <section>
                            <h2 style={{ fontSize: '0.9rem', color: 'var(--theme-health)', textTransform: 'uppercase', marginBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.25rem' }}>
                                Mitigation Protocols
                            </h2>
                            <ul style={{ paddingLeft: '1rem', color: '#cbd5e1', fontSize: '0.9rem', display: 'grid', gap: '0.5rem' }}>
                                {guidance.tips.map((t, i) => <li key={i}>{t}</li>)}
                            </ul>
                        </section>
                    </div>

                    {guidance.warning && (
                        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', color: '#fca5a5', fontSize: '0.8rem', marginBottom: '2rem' }}>
                            <strong>WARNING:</strong> Higher risk indicators profile. Monitoring advised.
                        </div>
                    )}

                    <div style={{ textAlign: 'center', marginBottom: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <p style={{ fontSize: '0.7rem', color: '#94a3b8', fontStyle: 'italic' }}>
                            "Virtual guidance only. Non-diagnostic. Consult human medical personnel for definitive care."
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/health/action', { state: { ...state, guidance } })}
                        className="btn-3d"
                        style={{ background: 'var(--theme-health)', borderColor: 'var(--theme-health)' }}
                    >
                        PROCEED TO PROTOCOLS
                    </button>
                </div>
            </div>
        </>
    );
}
