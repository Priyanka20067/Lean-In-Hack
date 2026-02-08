import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserSkillProfile } from '../services/jobService';
import GeekRoomChat from '../components/GeekRoomChat';
import Scene3D from '../components/Scene3D';

export default function SkillProfilePage() {
    const { userId } = useAuth();
    const [profile, setProfile] = useState(null);
    const [activeChatSkill, setActiveChatSkill] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            if (userId) {
                const data = await getUserSkillProfile(userId);
                setProfile(data);
            }
            setLoading(false);
        };
        loadProfile();
    }, [userId]);

    if (loading) {
        return (
            <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a' }}>
                <div className="animate-pulse" style={{ color: 'var(--theme-job)', fontWeight: 'bold' }}>FETCHING NEURAL PROFILE...</div>
            </div>
        );
    }

    const skills = profile ? Object.entries(profile.skills || {}) : [];

    return (
        <>
            <Scene3D variant="job" />
            <div className="container animate-fade" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: '2rem' }}>

                <header style={{ marginBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1.5rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--theme-job)', letterSpacing: '4px', fontWeight: 'bold', marginBottom: '0.5rem' }}>AUTHORIZED PERSONNEL ONLY</div>
                    <h1 style={{ fontSize: '2.5rem', color: 'white', marginBottom: '1rem' }}>
                        {userId ? `OPERATIVE_${userId.substring(0, 8).toUpperCase()}` : 'GUEST_PROFILE'}
                    </h1>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                        <div style={{ padding: '4px 16px', borderRadius: '20px', background: 'rgba(139, 92, 246, 0.2)', border: '1px solid var(--theme-job)', color: 'white', fontSize: '0.8rem', fontWeight: 'bold' }}>
                            {profile?.level?.toUpperCase() || 'RECRUIT'}
                        </div>
                        {profile?.badges?.map(b => (
                            <div key={b} style={{ padding: '4px 16px', borderRadius: '20px', background: 'rgba(245, 158, 11, 0.2)', border: '1px solid #f59e0b', color: '#f59e0b', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                {b.toUpperCase()}
                            </div>
                        ))}
                    </div>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1.5fr', gap: '2rem', flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
                    {/* Skills List */}
                    <div className="glass-panel" style={{ height: 'fit-content', padding: '2rem' }}>
                        <h2 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>Verified Proficiencies</h2>
                        <div style={{ display: 'grid', gap: '1.25rem' }}>
                            {skills.length === 0 && <div style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>No telemetry data found. Complete challenges to earn XP.</div>}

                            {skills.map(([skill, xp]) => (
                                <div key={skill} style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                        <span style={{ fontWeight: 'bold', color: 'var(--theme-job)', fontSize: '1rem' }}>{skill}</span>
                                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{xp} XP</span>
                                    </div>
                                    <div style={{ width: '100%', height: '4px', background: 'rgba(0,0,0,0.3)', borderRadius: '2px', marginBottom: '1.25rem' }}>
                                        <div style={{ width: `${Math.min(xp, 100)}%`, height: '100%', background: 'var(--theme-job)', boxShadow: '0 0 8px var(--theme-job)', borderRadius: '2px' }}></div>
                                    </div>

                                    <button
                                        onClick={() => setActiveChatSkill(skill === activeChatSkill ? null : skill)}
                                        className="btn-3d"
                                        style={{
                                            width: '100%',
                                            padding: '0.5rem',
                                            background: activeChatSkill === skill ? 'var(--theme-job)' : 'transparent',
                                            borderColor: 'var(--theme-job)',
                                            color: activeChatSkill === skill ? 'white' : 'var(--theme-job)',
                                            fontSize: '0.75rem'
                                        }}
                                    >
                                        {activeChatSkill === skill ? 'CLOSE COMMS CHANNEL' : 'SYNC WITH GEEK_ROOM'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Geek Room Chat Area */}
                    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '1rem', color: 'white', margin: 0 }}>Active Comms Channel</h2>
                            {activeChatSkill && <span style={{ fontSize: '0.7rem', color: 'var(--theme-job)', fontWeight: 'bold' }}>📡 {activeChatSkill.toUpperCase()}</span>}
                        </div>
                        <div style={{ flex: 1, padding: '1.5rem' }}>
                            {activeChatSkill ? (
                                <GeekRoomChat skill={activeChatSkill} />
                            ) : (
                                <div style={{
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#64748b',
                                    flexDirection: 'column',
                                    gap: '1.5rem',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '3rem', opacity: 0.2 }}>🛰️</div>
                                    <div style={{ maxWidth: '250px', fontSize: '0.9rem' }}>Select a verified proficiency to establish a multi-node comms link with other operatives.</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
