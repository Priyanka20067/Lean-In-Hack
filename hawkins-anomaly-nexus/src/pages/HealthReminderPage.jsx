import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { saveReminder, getReminders } from '../services/healthService';

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
            alert("Error saving reminder: " + e.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="container animate-fade" style={{ backgroundColor: '#f0f4f8', color: '#1a202c', minHeight: '100vh', padding: '1.5rem' }}>
            <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h1 style={{ color: '#2d3748', fontSize: '1.5rem', textTransform: 'none', letterSpacing: 'normal' }}>Health Reminders</h1>
                <p style={{ color: '#4a5568', fontSize: '0.9rem' }}>Never miss a follow-up or medicine.</p>
            </header>

            {/* Entry Form */}
            <form onSubmit={handleAddReminder} style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                marginBottom: '2rem',
                display: 'grid',
                gap: '1rem'
            }}>
                <h2 style={{ fontSize: '0.9rem', color: '#718096', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Add New Reminder</h2>

                <div>
                    <label style={{ fontSize: '0.75rem', color: '#4a5568', fontWeight: 'bold' }}>REMINDER FOR:</label>
                    <input
                        type="text"
                        placeholder="e.g. Morning Medicine, Dr. Visit..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e0', marginTop: '0.25rem', outline: 'none' }}
                        required
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ fontSize: '0.75rem', color: '#4a5568', fontWeight: 'bold' }}>DATE:</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e0', marginTop: '0.25rem', outline: 'none' }}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.75rem', color: '#4a5568', fontWeight: 'bold' }}>TIME:</label>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e0', marginTop: '0.25rem', outline: 'none' }}
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSaving}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        background: '#38a169',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        marginTop: '0.5rem'
                    }}
                >
                    {isSaving ? 'Saving...' : 'Set Reminder'}
                </button>
            </form>

            {/* List */}
            <div>
                <h2 style={{ fontSize: '0.9rem', color: '#718096', textTransform: 'uppercase', marginBottom: '1rem' }}>Active Reminders</h2>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                    {reminders.map((r, i) => (
                        <div key={i} style={{
                            background: 'white',
                            padding: '1rem',
                            borderRadius: '8px',
                            borderLeft: '4px solid #38a169',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <div style={{ fontWeight: 'bold', color: '#2d3748' }}>{r.title}</div>
                                <div style={{ fontSize: '0.7rem', color: '#718096' }}>{new Date(r.date).toLocaleDateString()} at {r.time}</div>
                            </div>
                            <div style={{ fontSize: '1.2rem' }}>🕒</div>
                        </div>
                    ))}
                    {reminders.length === 0 && (
                        <p style={{ textAlign: 'center', color: '#a0aec0', fontSize: '0.8rem', padding: '2rem' }}>No reminders set.</p>
                    )}
                </div>
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
