import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { saveHealthRecord } from '../services/healthService';

export default function HealthActionPage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { userId } = useAuth();

    if (!state || !state.guidance) return null;

    const handleSaveToLog = async () => {
        try {
            await saveHealthRecord(userId, {
                symptoms: state.selectedSymptoms,
                others: state.others,
                urgency: state.guidance.urgency,
                guidance: state.guidance
            });
            alert("Record saved to health log successfully.");
            navigate('/health/log');
        } catch (e) {
            alert("Error saving record: " + e.message);
        }
    };

    return (
        <div className="container animate-fade" style={{
            '--color-primary': 'var(--theme-health-primary)',
            '--color-secondary': 'var(--theme-health-secondary)',
            '--color-accent': 'var(--theme-health-accent)',
            background: 'var(--theme-health-bg)',
            color: '#ecfdf5', // Mint white
            minHeight: '100vh',
            padding: '1.5rem'
        }}>
            <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h1 style={{ color: 'var(--theme-health-accent)', fontSize: '1.5rem', textTransform: 'none', letterSpacing: 'normal', fontWeight: 'bold' }}>Recommended Actions</h1>
                <p style={{ color: '#d1fae5', fontSize: '0.9rem' }}>Follow these steps for your well-being.</p>
            </header>

            <div style={{ background: 'rgba(6, 78, 59, 0.6)', padding: '1.5rem', borderRadius: '12px', border: '1px solid #059669', marginBottom: '2rem' }}>
                <section style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1rem', color: '#a7f3d0', marginBottom: '1rem', borderBottom: '1px solid #065f46', paddingBottom: '0.5rem' }}>When to Consult a Doctor</h2>
                    <ul style={{ paddingLeft: '1.2rem', color: '#d1fae5', fontSize: '0.9rem', display: 'grid', gap: '0.5rem' }}>
                        <li>If symptoms worsen after 24 hours.</li>
                        <li>If you develop a high fever (above 101°F).</li>
                        <li>If you experience persistent dizziness or fainting.</li>
                        <li>If you are unsure about the home care steps.</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(220, 38, 38, 0.1)', borderRadius: '8px', border: '1px solid #991b1b' }}>
                    <h2 style={{ fontSize: '1rem', color: '#fca5a5', marginBottom: '0.5rem' }}>Emergency Indicators</h2>
                    <p style={{ fontSize: '0.85rem', color: '#fecaca' }}>Seek immediate help if you have:</p>
                    <ul style={{ paddingLeft: '1.2rem', color: '#fecaca', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                        <li>Difficulty breathing</li>
                        <li>Sudden chest pain</li>
                        <li>Loss of consciousness</li>
                        <li>Severe allergic reaction</li>
                    </ul>
                </section>

                <section>
                    <h2 style={{ fontSize: '0.9rem', color: '#718096', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Nearby Healthcare</h2>
                    <p style={{ fontSize: '0.85rem', color: '#4a5568' }}>
                        <strong>Hawkins Community Hospital:</strong> 1.2 miles away<br />
                        <strong>General Practice Clinic:</strong> 0.5 miles away
                    </p>
                </section>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
                <button
                    onClick={() => navigate('/health/reminders')}
                    style={{
                        width: '100%',
                        padding: '1.25rem',
                        background: '#38a169',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        cursor: 'pointer'
                    }}
                >
                    Set Reminder
                </button>

                <button
                    onClick={handleSaveToLog}
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
                    Save to Health Log
                </button>

                <button
                    onClick={() => navigate('/health')}
                    style={{
                        marginTop: '0.5rem',
                        width: '100%',
                        padding: '1rem',
                        background: 'transparent',
                        border: '1px solid #cbd5e0',
                        borderRadius: '8px',
                        color: '#718096',
                        cursor: 'pointer'
                    }}
                >
                    Finish Session
                </button>
            </div>
        </div>
    );
}
