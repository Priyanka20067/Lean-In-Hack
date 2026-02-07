import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getHealthGuidance } from '../services/healthService';

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
        <div className="container animate-fade" style={{ backgroundColor: '#f0f4f8', color: '#1a202c', minHeight: '100vh', padding: '1.5rem' }}>
            <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h1 style={{ color: '#2d3748', fontSize: '1.5rem', textTransform: 'none', letterSpacing: 'normal' }}>Health Guidance</h1>
                <p style={{ color: '#4a5568', fontSize: '0.9rem' }}>Based on your selected symptoms.</p>
            </header>

            {/* Severity Indicator */}
            <div style={{
                textAlign: 'center',
                padding: '1rem',
                borderRadius: '8px',
                background: guidance.urgency === 'High' ? '#fff5f5' : guidance.urgency === 'Medium' ? '#fffaf0' : '#f0fff4',
                color: guidance.urgency === 'High' ? '#c53030' : guidance.urgency === 'Medium' ? '#c05621' : '#2f855a',
                border: `1px solid ${guidance.urgency === 'High' ? '#feb2b2' : guidance.urgency === 'Medium' ? '#fbd38d' : '#9ae6b4'}`,
                marginBottom: '2rem',
                fontWeight: 'bold'
            }}>
                Attention Level: {guidance.urgency.toUpperCase()}
            </div>

            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
                <section style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '0.9rem', color: '#718096', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Possible Causes</h2>
                    <ul style={{ paddingLeft: '1.2rem', color: '#2d3748' }}>
                        {guidance.causes.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                </section>

                <section style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '0.9rem', color: '#718096', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Home Care Tips</h2>
                    <ul style={{ paddingLeft: '1.2rem', color: '#2d3748' }}>
                        {guidance.tips.map((t, i) => <li key={i}>{t}</li>)}
                    </ul>
                </section>

                {guidance.warning && (
                    <div style={{ padding: '1rem', background: '#fff5f5', border: '1px solid #feb2b2', borderRadius: '8px', color: '#c53030', fontSize: '0.8rem' }}>
                        <strong>Note:</strong> Multiple symptoms or high severity detected. Monitoring is essential.
                    </div>
                )}
            </div>

            {/* Mandatory Disclaimer */}
            <div style={{
                background: '#edf2f7',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '2rem',
                border: '1px solid #e2e8f0',
                textAlign: 'center'
            }}>
                <p style={{ fontSize: '0.75rem', color: '#4a5568', fontStyle: 'italic' }}>
                    “This is not a medical diagnosis. Please consult a doctor for professional advice and diagnosis.”
                </p>
            </div>

            <button
                onClick={() => navigate('/health/action', { state: { ...state, guidance } })}
                style={{
                    width: '100%',
                    padding: '1.25rem',
                    background: '#3182ce',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    cursor: 'pointer'
                }}
            >
                Next Steps
            </button>
        </div>
    );
}
