import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { saveHealthRecord } from '../services/healthService';
import Scene3D from '../components/Scene3D';

export default function HealthActionPage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { userId } = useAuth();

    if (!state || !state.guidance) {
        return (
            <div className="container" style={{ textAlign: 'center', paddingTop: '10rem' }}>
                <p>No health data found. Please start from the beginning.</p>
                <button onClick={() => navigate('/health')} className="btn-3d">Return Home</button>
            </div>
        );
    }

    const { guidance } = state;

    const handleSaveToLog = async () => {
        try {
            await saveHealthRecord(userId, {
                symptoms: state.selectedSymptoms,
                others: state.others,
                urgency: guidance.urgency,
                guidance: guidance,
                timestamp: Date.now()
            });
            alert("Record successfully saved to your medical log.");
            navigate('/health/log');
        } catch (e) {
            console.error("Error saving record:", e);
            alert("Failed to save record. Please try again.");
        }
    };

    return (
        <>
            <Scene3D variant="health" />
            <div className="container animate-fade" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem' }}>

                <div className="glass-panel" style={{ maxWidth: '600px', width: '100%', borderTop: '4px solid var(--theme-health)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛡️</div>
                        <h1 style={{ color: 'var(--theme-health)', fontSize: '2rem', marginBottom: '0.5rem' }}>ACTION PROTOCOL</h1>
                        <p style={{ color: '#94a3b8' }}>Verified steps for symptom management.</p>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '0.9rem', color: 'var(--theme-health)', textTransform: 'uppercase', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                            Medical Recommendations
                        </h2>
                        <ul style={{ display: 'grid', gap: '0.75rem', color: '#cbd5e1', fontSize: '0.95rem', paddingLeft: '1rem' }}>
                            <li>Monitor vitals every 4 hours.</li>
                            <li>Ensure adequate hydration and rest.</li>
                            <li>Avoid heavy physical activity for 24 hours.</li>
                            <li>If symptoms persist or worsen, seek professional help.</li>
                        </ul>
                    </div>

                    <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)', marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '0.8rem', color: 'var(--theme-health)', marginBottom: '0.5rem' }}>LOCAL FACILITIES</h3>
                        <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                            <strong>Hawkins Med-Center:</strong> 0.8mi North<br />
                            <strong>Bio-Research Lab B:</strong> Restricted Access
                        </p>
                    </div>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <button
                            onClick={() => navigate('/health/reminders')}
                            className="btn-3d"
                            style={{ background: 'var(--theme-health)', borderColor: 'var(--theme-health)' }}
                        >
                            SET TRACKING REMINDER
                        </button>

                        <button
                            onClick={handleSaveToLog}
                            className="btn-3d"
                        >
                            SAVE TO SECURE LOG
                        </button>

                        <button
                            onClick={() => navigate('/health')}
                            className="btn-3d"
                            style={{ opacity: 0.6 }}
                        >
                            COMPLETE SESSION
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
