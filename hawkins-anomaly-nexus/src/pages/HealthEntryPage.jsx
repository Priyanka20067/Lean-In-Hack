import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function HealthEntryPage() {
    const navigate = useNavigate();
    const { userId } = useAuth();

    return (
        <div className="container animate-fade" style={{ backgroundColor: '#f0f4f8', color: '#1a202c', minHeight: '100vh', padding: '1.5rem' }}>
            {/* Header */}
            <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', color: '#2b6cb0', marginBottom: '0.5rem' }}>✚</div>
                <h1 style={{ color: '#2d3748', fontSize: '1.5rem', letterSpacing: 'normal', textTransform: 'none' }}>Healthcare Support</h1>
                <p style={{ color: '#4a5568', fontSize: '0.9rem' }}>Get basic health guidance and track reminders.</p>
            </header>

            {/* Support Disclaimer */}
            <div style={{
                background: '#fff',
                borderLeft: '4px solid #3182ce',
                padding: '1rem',
                marginBottom: '2rem',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
                <p style={{ fontSize: '0.8rem', color: '#2d3748', fontWeight: 'bold' }}>IMPORTANT NOTICE</p>
                <p style={{ fontSize: '0.75rem', color: '#4a5568', marginTop: '0.2rem' }}>
                    This module provides basic information only. It does NOT provide medical diagnosis or replace professional advice.
                </p>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'grid', gap: '1rem' }}>
                <button
                    onClick={() => navigate('/health/symptoms')}
                    style={{
                        background: '#fff',
                        border: '1px solid #e2e8f0',
                        padding: '1.5rem',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        textAlign: 'left'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <div style={{ fontSize: '1.5rem', color: '#3182ce' }}>📋</div>
                    <div>
                        <div style={{ fontWeight: 'bold', color: '#2d3748' }}>Check Symptoms</div>
                        <div style={{ fontSize: '0.75rem', color: '#718096' }}>Analyze your symptoms and get guidance</div>
                    </div>
                </button>

                <button
                    onClick={() => navigate('/health/reminders')}
                    style={{
                        background: '#fff',
                        border: '1px solid #e2e8f0',
                        padding: '1.5rem',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        textAlign: 'left'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <div style={{ fontSize: '1.5rem', color: '#38a169' }}>⏰</div>
                    <div>
                        <div style={{ fontWeight: 'bold', color: '#2d3748' }}>Health Reminders</div>
                        <div style={{ fontSize: '0.75rem', color: '#718096' }}>Set medicine or follow-up notifications</div>
                    </div>
                </button>

                <button
                    onClick={() => navigate('/health/log')}
                    style={{
                        background: '#fff',
                        border: '1px solid #e2e8f0',
                        padding: '1.5rem',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        textAlign: 'left'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <div style={{ fontSize: '1.5rem', color: '#805ad5' }}>📂</div>
                    <div>
                        <div style={{ fontWeight: 'bold', color: '#2d3748' }}>Medical History Log</div>
                        <div style={{ fontSize: '0.75rem', color: '#718096' }}>View your past symptom logs and guidance</div>
                    </div>
                </button>

                <div
                    style={{
                        background: '#fff5f5',
                        border: '1px solid #feb2b2',
                        padding: '1.5rem',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        marginTop: '1rem',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}
                >
                    <div style={{ fontSize: '1.5rem', color: '#e53e3e' }}>🚨</div>
                    <div>
                        <div style={{ fontWeight: 'bold', color: '#c53030' }}>Emergency Help</div>
                        <div style={{ fontSize: '0.75rem', color: '#9b2c2c' }}>If you have difficulty breathing or chest pain, go to the nearest hospital immediately.</div>
                    </div>
                </div>
            </div>

            <button
                onClick={() => navigate('/map')}
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
                Return to Nexus Hub
            </button>
        </div>
    );
}
