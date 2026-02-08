import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Scene3D from '../components/Scene3D';

export default function ProfilePage() {
    const { userData, userId } = useAuth();
    const [reportCount, setReportCount] = React.useState(0);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (userId) {
            import('../services/firestoreService').then(m => {
                m.getAnomalyCountForUser(userId).then(setReportCount);
            });
        }
    }, [userId]);

    return (
        <>
            <Scene3D variant="gov" />
            <div className="container animate-fade" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: '2rem' }}>

                <header style={{ marginBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1.5rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--theme-gov)', letterSpacing: '4px', fontWeight: 'bold', marginBottom: '0.5rem' }}>OPERATIVE_CREDENTIALS</div>
                    <h1 style={{ fontSize: '2.5rem', color: 'white' }}>AGENT_PROFILE_V04</h1>
                </header>

                <div className="glass-panel" style={{ maxWidth: '800px', width: '100%', margin: '0 auto', padding: '3rem', borderTop: '4px solid var(--theme-gov)' }}>
                    <div style={{ display: 'flex', gap: '3rem', marginBottom: '3rem', alignItems: 'center' }}>
                        <div style={{ width: '120px', height: '150px', border: '1px solid var(--theme-gov)', background: 'rgba(56, 189, 248, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', borderRadius: '8px', overflow: 'hidden' }}>
                            <div style={{ fontSize: '4rem', opacity: 0.2 }}>👤</div>
                            <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '2px', background: 'var(--theme-gov)', boxShadow: '0 0 10px var(--theme-gov)', animation: 'profile-scan 2s infinite' }}></div>
                        </div>

                        <div style={{ flex: 1 }}>
                            <h2 style={{ fontSize: '1.8rem', margin: '0 0 0.5rem', color: 'white' }}>{userData?.name || 'GUEST_OPERATIVE'}</h2>
                            <div style={{ fontSize: '0.9rem', color: 'var(--theme-gov)', fontWeight: 'bold', marginBottom: '0.5rem', letterSpacing: '1px' }}>CLEARANCE: LEVEL_4</div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'monospace' }}>UUID: {userId?.toUpperCase() || 'UNAUTHENTICATED'}</div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2.5rem' }}>
                        <div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: 'bold' }}>REPUTATION_XP</div>
                            <div style={{ fontSize: '1.5rem', color: 'white', fontWeight: 'bold' }}>{userData?.points || 0} XP</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: 'bold' }}>TELEMETRY_REPORTS</div>
                            <div style={{ fontSize: '1.5rem', color: 'white', fontWeight: 'bold' }}>{reportCount}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: 'bold' }}>NEURAL_STATUS</div>
                            <div style={{ fontSize: '1.1rem', color: '#34d399', fontWeight: 'bold' }}>STABLE</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: 'bold' }}>OPERATIONAL_RANK</div>
                            <div style={{ fontSize: '1.1rem', color: 'var(--theme-gov)', fontWeight: 'bold' }}>VETERAN</div>
                        </div>
                    </div>

                    <div style={{ marginTop: '3rem' }}>
                        <h3 style={{ fontSize: '0.8rem', color: '#64748b', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', marginBottom: '1.5rem', letterSpacing: '2px' }}>EARNED_ACCREDITATIONS</h3>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <div className="glass-panel" style={{ padding: '0.6rem 1.25rem', fontSize: '0.7rem', color: 'var(--theme-gov)', border: '1px solid var(--theme-gov)', fontWeight: 'bold' }}>GATE_HUNTER</div>
                            <div className="glass-panel" style={{ padding: '0.6rem 1.25rem', fontSize: '0.7rem', color: '#f87171', border: '1px solid #ef4444', fontWeight: 'bold' }}>BIO_VETERAN</div>
                            <div className="glass-panel" style={{ padding: '0.6rem 1.25rem', fontSize: '0.7rem', color: '#a78bfa', border: '1px solid #7c3aed', fontWeight: 'bold', opacity: 0.4 }}>TECH_SAVANT</div>
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth: '800px', width: '100%', margin: '2.5rem auto 0', display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 1fr', gap: '1.5rem' }}>
                    <button onClick={() => navigate('/health/log')} className="btn-3d" style={{ background: 'rgba(16, 185, 129, 0.1)', borderColor: '#10b981', color: '#10b981' }}>VIRTUAL_MEDICAL_LOGS</button>
                    <button onClick={() => navigate('/profile/skills')} className="btn-3d" style={{ background: 'rgba(139, 92, 246, 0.1)', borderColor: '#8b5cf6', color: '#8b5cf6' }}>SKILL_VERIFICATION_DOSSIER</button>
                </div>

                <div style={{ maxWidth: '800px', width: '100%', margin: '1rem auto 3rem' }}>
                    <button onClick={() => navigate('/dashboard')} className="btn-3d" style={{ width: '100%', background: 'var(--theme-gov)', borderColor: 'var(--theme-gov)' }}>RETURN TO COMMAND_CENTER</button>
                </div>

                <style>{`
                    @keyframes profile-scan {
                        0% { transform: translateY(120px); opacity: 0; }
                        50% { opacity: 1; }
                        100% { transform: translateY(0); opacity: 0; }
                    }
                `}</style>
            </div>
        </>
    );
}
