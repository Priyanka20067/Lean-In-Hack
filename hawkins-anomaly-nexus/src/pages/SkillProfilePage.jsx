import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserSkillProfile } from '../services/jobService';
import GeekRoomChat from '../components/GeekRoomChat';

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

    if (loading) return <div style={{ color: '#94a3b8', padding: '2rem' }}>Loading profile...</div>;

    const skills = profile ? Object.entries(profile.skills || {}) : [];

    return (
        <div className="container animate-fade" style={{ background: '#0f172a', minHeight: '100vh', padding: '2rem', color: 'white' }}>
            <div className="bg-grid" style={{ opacity: 0.1 }}></div>

            <header style={{ marginBottom: '3rem', borderBottom: '1px solid #334155', paddingBottom: '1rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#c084fc', letterSpacing: '1px' }}>OPERATIVE PROFILE</div>
                <h1 style={{ fontSize: '2rem', color: 'white' }}>{userId ? `User-${userId.substring(0, 4)}` : 'Guest'}</h1>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <div className="badge" style={{ background: '#c084fc', color: '#3b0764' }}>{profile?.level || 'Recruit'}</div>
                    {profile?.badges?.map(b => (
                        <div key={b} className="badge" style={{ background: '#f59e0b', color: '#451a03' }}>{b}</div>
                    ))}
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Skills List */}
                <div>
                    <h2 style={{ fontSize: '1.2rem', color: '#e2e8f0', marginBottom: '1.5rem' }}>Verified Skills</h2>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {skills.length === 0 && <div style={{ color: '#64748b' }}>No skills verified yet. Complete challenges to earn XP.</div>}

                        {skills.map(([skill, xp]) => (
                            <div key={skill} style={{ background: '#1e293b', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: 'bold', color: '#38bdf8' }}>{skill}</span>
                                    <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{xp} XP</span>
                                </div>
                                <div style={{ width: '100%', height: '4px', background: '#0f172a', borderRadius: '2px' }}>
                                    <div style={{ width: `${Math.min(xp, 100)}%`, height: '100%', background: '#38bdf8', borderRadius: '2px' }}></div>
                                </div>

                                <button
                                    onClick={() => setActiveChatSkill(skill === activeChatSkill ? null : skill)}
                                    style={{
                                        marginTop: '1rem',
                                        width: '100%',
                                        padding: '0.5rem',
                                        background: activeChatSkill === skill ? '#38bdf8' : 'transparent',
                                        color: activeChatSkill === skill ? '#0f172a' : '#94a3b8',
                                        border: '1px solid #38bdf8',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '0.8rem',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {activeChatSkill === skill ? 'CLOSE COMMS' : 'OPEN GEEK ROOM COMMS'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Geek Room Chat Area */}
                <div>
                    <h2 style={{ fontSize: '1.2rem', color: '#e2e8f0', marginBottom: '1.5rem' }}>Active Comms Channel</h2>
                    {activeChatSkill ? (
                        <GeekRoomChat skill={activeChatSkill} />
                    ) : (
                        <div style={{
                            height: '400px',
                            background: 'rgba(30, 41, 59, 0.3)',
                            borderRadius: '8px',
                            border: '1px dashed #334155',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#64748b',
                            flexDirection: 'column',
                            gap: '1rem'
                        }}>
                            <div style={{ fontSize: '2rem' }}>📡</div>
                            <div>Select a skill to join its Geek Room channel.</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
