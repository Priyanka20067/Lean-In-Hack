import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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
        <div className="container" style={{ padding: '20px' }}>
            <h2 className="glow-text" style={{ textAlign: 'center', marginBottom: '30px' }}>
                SKILL UPSKILLING PROTOCOL
            </h2>

            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', color: '#ccc' }}>
                    <span>READINESS LEVEL</span>
                    <span>{progress}%</span>
                </div>
                <div style={{ height: '10px', background: '#333', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{
                        height: '100%',
                        width: `${progress}%`,
                        background: 'var(--color-primary)',
                        transition: 'width 0.3s ease'
                    }}></div>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {tasks.map(task => (
                    <div
                        key={task.id}
                        onClick={() => toggleTask(task.id)}
                        style={{
                            padding: '15px',
                            background: task.completed ? 'rgba(0, 255, 0, 0.1)' : '#111',
                            border: `1px solid ${task.completed ? '#4caf50' : '#333'}`,
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px'
                        }}
                    >
                        <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            border: `2px solid ${task.completed ? '#4caf50' : '#666'}`,
                            background: task.completed ? '#4caf50' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {task.completed && <span style={{ color: 'black', fontSize: '12px' }}>✔</span>}
                        </div>
                        <span style={{
                            textDecoration: task.completed ? 'line-through' : 'none',
                            color: task.completed ? '#aaa' : '#fff'
                        }}>
                            {task.text}
                        </span>
                    </div>
                ))}
            </div>

            <button
                onClick={handleComplete}
                disabled={progress < 100}
                className="btn-primary"
                style={{
                    marginTop: '40px',
                    width: '100%',
                    opacity: progress < 100 ? 0.5 : 1,
                    cursor: progress < 100 ? 'not-allowed' : 'pointer'
                }}
            >
                COMPLETE & SECURE JOB
            </button>
        </div>
    );
}
