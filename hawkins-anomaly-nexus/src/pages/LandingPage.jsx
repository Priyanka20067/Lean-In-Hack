import React from 'react';
import { useNavigate } from 'react-router-dom';
import Scene3D from '../components/Scene3D';

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div style={{ background: 'var(--color-bg-dark)', height: '100vh', overflow: 'hidden' }}>
            <Scene3D variant="default" />

            <section style={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '2rem',
                position: 'relative',
                zIndex: 1
            }}>
                <div className="animate-fade" style={{ maxWidth: '900px' }}>
                    <div style={{
                        fontSize: '0.9rem',
                        color: 'var(--theme-gov)',
                        letterSpacing: '8px',
                        fontWeight: '800',
                        marginBottom: '1.5rem',
                        textTransform: 'uppercase',
                        opacity: 0.8
                    }}>
                        Central Intelligence Interface
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(3.5rem, 10vw, 6rem)',
                        lineHeight: '1',
                        marginBottom: '2rem',
                        background: 'linear-gradient(to bottom, #ffffff 0%, #94a3b8 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: '800',
                        letterSpacing: '-2px'
                    }}>
                        NEXUS_VIRTUAL
                    </h1>

                    <p style={{
                        fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
                        color: '#94a3b8',
                        marginBottom: '4rem',
                        maxWidth: '650px',
                        margin: '0 auto 4rem auto',
                        lineHeight: '1.8',
                        fontWeight: '400'
                    }}>
                        Welcome to the unified terminal for city-wide anomaly detection.
                        Transmissions are analyzed by the GAIA Neural Link for specialized routing.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                        <button
                            onClick={() => navigate('/report')}
                            className="btn-3d"
                            style={{
                                fontSize: '1.2rem',
                                padding: '1.25rem 4rem',
                                background: 'var(--theme-gov)',
                                borderColor: 'rgba(255,255,255,0.1)',
                                boxShadow: '0 0 40px rgba(59, 130, 246, 0.2)',
                                letterSpacing: '2px'
                            }}
                        >
                            INITIATE FIELD REPORT
                        </button>

                        <div style={{ fontSize: '0.7rem', color: '#475569', letterSpacing: '4px', textTransform: 'uppercase' }}>
                            Secured Authentication Active
                        </div>
                    </div>
                </div>

                {/* Footer simple */}
                <div style={{
                    position: 'absolute',
                    bottom: '3rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '100%',
                    opacity: 0.4
                }}>
                    <div style={{ fontSize: '0.6rem', color: '#64748b', letterSpacing: '3px' }}>
                        SYSTEM_STATUS: NOMINAL // ALL_SECTORS_READY
                    </div>
                </div>
            </section>
        </div>
    );
}
