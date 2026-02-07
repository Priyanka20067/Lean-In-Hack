import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getHealthLogs } from '../services/healthService';

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
        <div className="container animate-fade" style={{ backgroundColor: '#f0f4f8', color: '#1a202c', minHeight: '100vh', padding: '1.5rem' }}>
            <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h1 style={{ color: '#2d3748', fontSize: '1.5rem', textTransform: 'none', letterSpacing: 'normal' }}>Medical History Log</h1>
                <p style={{ color: '#4a5568', fontSize: '0.9rem' }}>Review your past symptom reports.</p>
            </header>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {isLoading ? (
                    <p style={{ textAlign: 'center', color: '#718096', padding: '2rem' }}>Loading logs...</p>
                ) : logs.map((log) => (
                    <div key={log.id} style={{
                        background: 'white',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        borderLeft: `5px solid ${log.urgency === 'High' ? '#e53e3e' : log.urgency === 'Medium' ? '#ed8936' : '#48bb78'}`,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                            <span style={{ fontSize: '0.7rem', color: '#718096', fontWeight: 'bold' }}>
                                {log.createdAt?.toDate ? log.createdAt.toDate().toLocaleString() : 'Recent'}
                            </span>
                            <span style={{
                                fontSize: '0.65rem',
                                padding: '2px 8px',
                                borderRadius: '10px',
                                background: log.urgency === 'High' ? '#fff5f5' : log.urgency === 'Medium' ? '#fffaf0' : '#f0fff4',
                                color: log.urgency === 'High' ? '#c53030' : log.urgency === 'Medium' ? '#c05621' : '#2f855a',
                                fontWeight: 'bold'
                            }}>
                                {log.urgency.toUpperCase()}
                            </span>
                        </div>

                        <div style={{ marginBottom: '0.75rem' }}>
                            <p style={{ fontSize: '0.8rem', color: '#718096', textTransform: 'uppercase', fontWeight: 'bold' }}>Symptoms:</p>
                            <p style={{ fontSize: '0.9rem', color: '#2d3748' }}>{log.symptoms.join(', ')}</p>
                            {log.others && <p style={{ fontSize: '0.85rem', color: '#4a5568', marginTop: '0.2rem', fontStyle: 'italic' }}>"{log.others}"</p>}
                        </div>

                        <div style={{ padding: '0.75rem', background: '#f7fafc', borderRadius: '6px' }}>
                            <p style={{ fontSize: '0.8rem', color: '#718096', textTransform: 'uppercase', fontWeight: 'bold' }}>Guidance Provided:</p>
                            <p style={{ fontSize: '0.85rem', color: '#2d3748' }}>{log.guidance?.causes.join(' | ')}</p>
                            <p style={{ fontSize: '0.8rem', color: '#4a5568', marginTop: '0.25rem' }}>{log.guidance?.tips.join(' | ')}</p>
                        </div>
                    </div>
                ))}

                {!isLoading && logs.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '12px' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>Empty</div>
                        <p style={{ color: '#718096', fontSize: '0.9rem' }}>No history found yet. Use the Symptom Checker to start logging.</p>
                    </div>
                )}
            </div>

            <button
                onClick={() => navigate('/health')}
                style={{
                    marginTop: '2rem',
                    width: '100%',
                    padding: '1rem',
                    background: 'transparent',
                    border: '1px solid #cbd5e0',
                    borderRadius: '8px',
                    color: '#718096',
                    cursor: 'pointer'
                }}
            >
                Back to Health Menu
            </button>
        </div>
    );
}
