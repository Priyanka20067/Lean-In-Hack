import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Scene3D from '../components/Scene3D';

export default function SkillsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([
        { id: 1, text: 'Update Resume with Hawkins High credentials', completed: false },
        { id: 2, text: 'Watch "How to defeat Demogorgons" safety video', completed: false },
        { id: 3, text: 'Clean up slime from uniform', completed: false },
        { id: 4, text: 'Practice refusal of suspicious lab tests', completed: false }
    ]);

    const toggleTask = (taskId) => {
        setTasks(tasks.map(t =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
        ));
    };

    const progress = Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100);

    const handleComplete = () => {
        if (progress === 100) {
            navigate(`/resolve/${id}`);
        }
    };

    return (
        <>
            <Scene3D variant="job" />
            <div className="container animate-fade" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem' }}>

                <div className="glass-panel" style={{ maxWidth: '600px', width: '100%', borderTop: '4px solid var(--theme-job)' }}>
                    <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--theme-job)', letterSpacing: '4px', marginBottom: '1rem', fontWeight: 'bold' }}>FINAL READINESS PROTOCOL</div>
                        <h1 style={{ fontSize: '2rem', color: 'white', marginBottom: '0.5rem' }}>SKILL UPSKILLING</h1>
                        <p style={{ color: '#94a3b8' }}>Complete the final checklist to secure your placement.</p>
                    </header>

                    <div style={{ marginBottom: '2.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                            <span style={{ fontSize: '0.8rem', color: 'white', fontWeight: 'bold' }}>READINESS LEVEL</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--theme-job)', fontWeight: 'bold' }}>{progress}%</span>
                        </div>
                        <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{
                                height: '100%',
                                width: `${progress}%`,
                                background: 'var(--theme-job)',
                                boxShadow: '0 0 10px var(--theme-job)',
                                transition: 'width 0.4s ease'
                            }}></div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gap: '1rem', marginBottom: '2.5rem' }}>
                        {tasks.map(task => (
                            <div
                                key={task.id}
                                onClick={() => toggleTask(task.id)}
                                className="glass-panel"
                                style={{
                                    padding: '1.25rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1.25rem',
                                    background: task.completed ? 'rgba(139, 92, 246, 0.1)' : 'rgba(30, 41, 59, 0.4)',
                                    border: `1px solid ${task.completed ? 'var(--theme-job)' : 'rgba(255,255,255,0.05)'}`,
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    border: `2px solid ${task.completed ? 'var(--theme-job)' : '#475569'}`,
                                    background: task.completed ? 'var(--theme-job)' : 'transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    {task.completed && <span style={{ color: 'white', fontSize: '10px', fontWeight: 'bold' }}>✔</span>}
                                </div>
                                <span style={{
                                    fontSize: '0.95rem',
                                    color: task.completed ? '#94a3b8' : 'white',
                                    textDecoration: task.completed ? 'line-through' : 'none',
                                    transition: 'color 0.2s'
                                }}>
                                    {task.text}
                                </span>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleComplete}
                        disabled={progress < 100}
                        className="btn-3d"
                        style={{
                            width: '100%',
                            background: progress === 100 ? 'var(--theme-job)' : 'transparent',
                            borderColor: progress === 100 ? 'var(--theme-job)' : 'rgba(255,255,255,0.1)',
                            color: progress === 100 ? 'white' : '#475569',
                            opacity: progress < 100 ? 0.5 : 1
                        }}
                    >
                        COMPLETE & SECURE JOB PLACEMENT
                    </button>

                    <button
                        onClick={() => navigate(-1)}
                        className="btn-3d"
                        style={{ width: '100%', marginTop: '1rem', opacity: 0.6 }}
                    >
                        RETURN
                    </button>
                </div>
            </div>
        </>
    );
}
