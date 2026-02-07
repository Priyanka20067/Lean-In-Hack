import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="landing-container" style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '20px'
        }}>
            <h1 style={{
                fontSize: '3rem',
                color: 'var(--color-primary)',
                textShadow: '0 0 20px var(--color-primary-glow), 4px 4px 0px #000',
                marginBottom: '10px',
                animation: 'flicker 3s infinite alternate'
            }}>
                HAWKINS<br />ANOMALY NEXUS
            </h1>

            <p style={{
                fontSize: '1.2rem',
                color: 'var(--color-text-muted)',
                marginBottom: '40px',
                maxWidth: '500px'
            }}>
                ORDINARY PEOPLE FIGHTING EXTRAORDINARY CHAOS.
                <br />
                REPORT THE STRANGE. SAVE THE TOWN.
            </p>

            <button onClick={() => navigate('/report')} className="btn-primary">
                ENTER HAWKINS
            </button>

            <style>{`
        @keyframes flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
            opacity: 1;
            text-shadow: 0 0 20px var(--color-primary-glow);
          }
          20%, 24%, 55% {
            opacity: 0.5;
            text-shadow: none;
          }
        }
      `}</style>
        </div>
    );
}
