import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { saveReminder, getReminders } from '../services/healthService';
import Scene3D from '../components/Scene3D';

export default function HealthReminderPage() {
    const navigate = useNavigate();
    const { userId } = useAuth();
    const [title, setTitle] = useState('');
    const [time, setTime] = useState('');
    const [date, setDate] = useState('');
    const [reminders, setReminders] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadReminders();
    }, [userId]);

    const loadReminders = async () => {
        if (userId) {
            const data = await getReminders(userId);
            setReminders(data);
        }
    };

    const handleAddReminder = async (e) => {
        e.preventDefault();
        if (!title || !time || !date) return;

        setIsSaving(true);
        try {
            await saveReminder(userId, { title, time, date });
            setTitle('');
            setTime('');
            setDate('');
            loadReminders();
        } catch (e) {
            console.error("Error saving reminder:", e);
            alert("Protocol failure: Unable to sync reminder.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <Scene3D variant="health" />
            <div className="container animate-fade" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: '2rem' }}>

                <header style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', background: 'linear-gradient(to right, white, var(--theme-health))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        BIO-CHRONO TRACKER
                    </h1>
                    <p style={{ color: '#94a3b8' }}>Schedule medical interventions and follow-up scans.</p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1000px', width: '100%', margin: '0 auto' }}>

                    {/* Entry Form */}
                    <div className="glass-panel" style={{ height: 'fit-content' }}>
                        <h2 style={{ fontSize: '0.9rem', color: 'var(--theme-health)', textTransform: 'uppercase', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                            Initialize Reminder
                        </h2>
                        <form onSubmit={handleAddReminder} style={{ display: 'grid', gap: '1.25rem' }}>
                            <div>
                                <label style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>INTERVENTION NAME</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Bio-medication A"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }}
                                    required
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>DATE</label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>TIME</label>
                                    <input
                                        type="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSaving}
                                className="btn-3d"
                                style={{ background: 'var(--theme-health)', borderColor: 'var(--theme-health)', marginTop: '0.5rem' }}
                            >
                                {isSaving ? 'UPLOADING...' : 'COMMIT TO SCHEDULE'}
                            </button>
                        </form>
                    </div>

                    {/* Active Reminders */}
                    <div>
                        <h2 style={{ fontSize: '0.9rem', color: 'var(--theme-health)', textTransform: 'uppercase', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                            Active Protocols
                        </h2>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {reminders.map((r, i) => (
                                <div key={i} className="glass-panel" style={{
                                    padding: '1.25rem',
                                    borderLeft: '4px solid var(--theme-health)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: 'rgba(30, 41, 59, 0.4)'
                                }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold', color: 'white' }}>{r.title}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                            {new Date(r.date).toLocaleDateString()} • {r.time}
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '1.2rem', opacity: 0.5 }}>🕒</div>
                                </div>
                            ))}
                            {reminders.length === 0 && (
                                <div className="glass-panel" style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>
                                    <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>No scheduled interventions found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <button onClick={() => navigate('/health')} className="btn-3d">
                        RETURN TO BIO-HUB
                    </button>
                </div>
            </div>
        </>
    );
}
