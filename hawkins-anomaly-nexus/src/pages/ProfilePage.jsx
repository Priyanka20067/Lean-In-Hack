import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
    const { userData, userId } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="container animate-fade">
            <div className="bg-grid" style={{ opacity: 0.1 }}></div>
            <div className="bg-scanlines"></div>

            <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h2 className="mono" style={{ color: 'var(--color-primary)', letterSpacing: '0.4em' }}>AGENT_ID_VERIFICATION</h2>
                <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--color-text-dim)' }}>STATUS: AUTHENTICATED // SESSION: ACTIVE</div>
            </header>

            {/* ID Card HUD */}
            <div className="hud-border" style={{ padding: '2rem', background: 'rgba(10, 17, 40, 0.8)', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
                    <div style={{ width: '100px', height: '120px', border: '1px solid var(--color-primary)', background: 'rgba(0, 242, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        <div className="mono" style={{ fontSize: '0.5rem', color: 'var(--color-primary)', position: 'absolute', top: '5px' }}>BIO_THUMB</div>
                        <div style={{ fontSize: '3rem', opacity: 0.3 }}>🕵️</div>
                        <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '2px', background: 'var(--color-primary)', animation: 'scan-line 2s infinite' }}></div>
                    </div>

                    <div style={{ flex: 1 }}>
                        <h1 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--color-text)' }}>{userData?.name || 'AGENT_NULL'}</h1>
                        <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>CLEARANCE: LEVEL_4</div>
                        <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--color-text-dim)' }}>UID: {userId?.substring(0, 12).toUpperCase()}</div>
                        <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--color-text-dim)' }}>MEMBER_SINCE: 1984_NOV</div>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div>
                        <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--color-text-dim)' }}>REPUTATION_SCORE</div>
                        <div className="mono" style={{ fontSize: '1.2rem', color: 'var(--color-primary)' }}>{userData?.points || 0}</div>
                    </div>
                    <div>
                        <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--color-text-dim)' }}>FIELD_MISSIONS</div>
                        <div className="mono" style={{ fontSize: '1.2rem', color: 'var(--color-secondary)' }}>12</div>
                    </div>
                    <div>
                        <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--color-text-dim)' }}>SANITY_STATUS</div>
                        <div className="mono" style={{ fontSize: '0.8rem', color: 'var(--color-secondary)' }}>STABLE</div>
                    </div>
                    <div>
                        <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--color-text-dim)' }}>INTEL_RATING</div>
                        <div className="mono" style={{ fontSize: '0.8rem', color: 'var(--color-accent)' }}>MASTER</div>
                    </div>
                </div>
            </div>

            {/* Badges/Achv Section */}
            <h3 className="mono" style={{ fontSize: '0.8rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--color-text-dim)' }}>
                EARNED_ACCREDITATIONS
            </h3>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
                <div className="hud-border" style={{ padding: '0.5rem', fontSize: '0.6rem', color: 'var(--color-primary)' }}>GATE_HUNTER</div>
                <div className="hud-border" style={{ padding: '0.5rem', fontSize: '0.6rem', color: 'var(--color-danger)' }}>BIO_VETERAN</div>
                <div className="hud-border" style={{ padding: '0.5rem', fontSize: '0.6rem', color: 'var(--color-secondary)', opacity: 0.3 }}>TECH_SAVANT</div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={() => navigate('/dashboard')} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>COMMAND_CENTER</button>
                <button onClick={() => navigate('/map')} className="btn-primary" style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-dim)', boxShadow: 'none' }}>MAP_VIEW</button>
            </div>

            <style>{`
        @keyframes scan-line {
          0% { transform: translateY(0); }
          50% { transform: translateY(-118px); }
          100% { transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
