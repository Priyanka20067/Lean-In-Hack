import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="flex-center" style={{ height: '100vh', flexDirection: 'column', background: 'var(--color-bg-dark)' }}>
            <div className="bg-grid"></div>
            <div className="bg-scanlines"></div>

            <div className="animate-fade" style={{ textAlign: 'center', maxWidth: '500px', width: '90%' }}>
                <p className="mono" style={{ color: 'var(--color-secondary)', fontSize: '0.8rem', letterSpacing: '0.3em', marginBottom: '1rem' }}>
                    [ INITIALIZING SECURE PROTOCOL ]
                </p>

                <h1 className="glitch" data-text="ANOMALY HUNTERS" style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
                    ANOMALY HUNTERS
                </h1>

                <div className="hud-border" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <p style={{ color: 'var(--color-text-dim)', marginBottom: '1.5rem', textAlign: 'justify' }}>
                        A modern paranormal investigation and mysterious phenomenon detection network.
                        Utilizing high-tech scientific instruments and digital-forward surveillance.
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '1rem', fontSize: '0.7rem' }}>
                        <span style={{ color: 'var(--color-secondary)' }}>STATUS: MONITORING</span>
                        <span className="mono">ID: AHN_PR-42</span>
                    </div>
                </div>

                <button
                    onClick={() => navigate('/map')}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                >
                    SECURE ACCESS &rarr;
                </button>

                <p className="mono" style={{ marginTop: '2rem', fontSize: '0.6rem', color: 'var(--color-danger)', opacity: 0.7 }}>
                    WARNING: SYSTEM UNDER CONSTANT SURVEILLANCE. CLASSIFIED DATA ONLY.
                </p>
            </div>

            {/* Decorative HUD markers */}
            <div style={{ position: 'fixed', top: '40px', left: '40px', borderLeft: '1px solid var(--color-primary)', paddingLeft: '10px' }}>
                <div style={{ fontSize: '0.6rem', color: 'var(--color-primary)' }}>LAT: 40.04° N</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--color-primary)' }}>LONG: 86.51° W</div>
            </div>

            <div style={{ position: 'fixed', bottom: '40px', right: '40px', textAlign: 'right' }}>
                <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--color-text-dim)' }}>RELAY_NODE_HAWKINS</div>
                <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--color-secondary)' }}>ONLINE</div>
            </div>
        </div>
    );
}
