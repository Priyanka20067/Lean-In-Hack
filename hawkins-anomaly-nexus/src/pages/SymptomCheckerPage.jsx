import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Scene3D from '../components/Scene3D';

const COMMON_SYMPTOMS = [
    "Fever",
    "Headache",
    "Cold / cough",
    "Chest pain",
    "Stomach pain",
    "Body weakness"
];

export default function SymptomCheckerPage() {
    const navigate = useNavigate();
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [others, setOthers] = useState('');

    const toggleSymptom = (s) => {
        setSelectedSymptoms(prev =>
            prev.includes(s) ? prev.filter(item => item !== s) : [...prev, s]
        );
    };

    const handleGuidance = () => {
        if (selectedSymptoms.length === 0 && !others.trim()) {
            alert("Please select at least one symptom or describe your symptoms.");
            return;
        }

        // Pass symptoms via state
        navigate('/health/guidance', {
            state: {
                selectedSymptoms,
                others
            }
        });
    };

    return (
        <>
            <Scene3D variant="health" />
            <div className="container animate-fade" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem' }}>

                <div className="glass-panel" style={{ maxWidth: '600px', width: '100%', borderTop: '4px solid var(--theme-health)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📋</div>
                        <h1 style={{ color: 'var(--theme-health)', fontSize: '1.8rem', marginBottom: '0.5rem' }}>SYMPTOM SCAN</h1>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Select indicators for bio-metric analysis.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                        {COMMON_SYMPTOMS.map(s => (
                            <div
                                key={s}
                                onClick={() => toggleSymptom(s)}
                                className="glass-panel"
                                style={{
                                    padding: '1rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    border: selectedSymptoms.includes(s)
                                        ? '1px solid var(--theme-health)'
                                        : '1px solid rgba(255,255,255,0.1)',
                                    background: selectedSymptoms.includes(s)
                                        ? 'rgba(16, 185, 129, 0.1)'
                                        : 'rgba(255,255,255,0.05)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <span style={{ color: selectedSymptoms.includes(s) ? 'white' : '#cbd5e1', fontSize: '0.9rem' }}>{s}</span>
                                {selectedSymptoms.includes(s) && <span style={{ color: 'var(--theme-health)' }}>✓</span>}
                            </div>
                        ))}
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <p style={{ fontSize: '0.8rem', color: 'var(--theme-health)', marginBottom: '0.5rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Additional Context</p>
                        <textarea
                            value={others}
                            onChange={(e) => setOthers(e.target.value)}
                            placeholder="Describe any other anomalies or feelings..."
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: '8px',
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'white',
                                fontFamily: 'inherit',
                                fontSize: '0.9rem',
                                minHeight: '100px',
                                outline: 'none',
                                resize: 'none'
                            }}
                        />
                    </div>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <button
                            onClick={handleGuidance}
                            className="btn-3d"
                            style={{ background: 'var(--theme-health)', borderColor: 'var(--theme-health)' }}
                        >
                            RUN GUIDANCE ENGINE
                        </button>

                        <button
                            onClick={() => navigate('/health')}
                            className="btn-3d"
                            style={{ opacity: 0.6 }}
                        >
                            CANCEL SCAN
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
