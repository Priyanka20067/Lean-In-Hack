import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        <div className="container animate-fade" style={{ backgroundColor: '#f0f4f8', color: '#1a202c', minHeight: '100vh', padding: '1.5rem' }}>
            <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h1 style={{ color: '#2d3748', fontSize: '1.5rem', textTransform: 'none', letterSpacing: 'normal' }}>Symptom Checker</h1>
                <p style={{ color: '#4a5568', fontSize: '0.9rem' }}>Select all that applies to you.</p>
            </header>

            <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '2rem' }}>
                {COMMON_SYMPTOMS.map(s => (
                    <div
                        key={s}
                        onClick={() => toggleSymptom(s)}
                        style={{
                            background: selectedSymptoms.includes(s) ? '#ebf8ff' : '#fff',
                            border: `2px solid ${selectedSymptoms.includes(s) ? '#3182ce' : '#e2e8f0'}`,
                            padding: '1rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 0.2s'
                        }}
                    >
                        <span style={{ color: '#2d3748', fontWeight: selectedSymptoms.includes(s) ? '600' : '400' }}>{s}</span>
                        <div style={{
                            width: '20px',
                            height: '20px',
                            border: '1px solid #cbd5e0',
                            borderRadius: '4px',
                            background: selectedSymptoms.includes(s) ? '#3182ce' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '0.7rem'
                        }}>
                            {selectedSymptoms.includes(s) && '✓'}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <p style={{ fontSize: '0.8rem', color: '#4a5568', marginBottom: '0.5rem', fontWeight: 'bold' }}>OTHER SYMPTOMS:</p>
                <textarea
                    value={others}
                    onChange={(e) => setOthers(e.target.value)}
                    placeholder="Describe any other feelings here..."
                    style={{
                        width: '100%',
                        padding: '1rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e0',
                        fontFamily: 'inherit',
                        fontSize: '0.9rem',
                        minHeight: '100px',
                        outline: 'none',
                        resize: 'none'
                    }}
                />
            </div>

            <button
                onClick={handleGuidance}
                style={{
                    width: '100%',
                    padding: '1.25rem',
                    background: '#3182ce',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(49, 130, 206, 0.2)'
                }}
            >
                Get Guidance
            </button>

            <button
                onClick={() => navigate('/health')}
                style={{
                    marginTop: '1rem',
                    width: '100%',
                    padding: '1rem',
                    background: 'transparent',
                    border: '1px solid #cbd5e0',
                    borderRadius: '8px',
                    color: '#a0aec0',
                    cursor: 'pointer'
                }}
            >
                Cancel
            </button>
        </div>
    );
}
