import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { saveChallengeResult } from '../services/jobService';
import { useAuth } from '../context/AuthContext';
import Scene3D from '../components/Scene3D';

const DEFAULT_CHALLENGES = {
    'React': {
        question: "Create a functional component named 'Welcome' that accepts a 'name' prop.",
        template: "function Welcome(props) {\n  return <h1>Hello, {props.name}</h1>;\n}",
        validate: (code) => {
            const c = code.replace(/\s/g, '').toLowerCase();
            return c.includes('functionwelcome') && c.includes('return') && c.includes('props.name');
        },
        timeLimit: 300
    },
    'Node.js': {
        question: "Write a function 'readFile' that uses fs.promises to read 'data.txt'.",
        template: "const fs = require('fs').promises;\n\nasync function readFile() {\n  return await fs.readFile('data.txt');\n}",
        validate: (code) => {
            const c = code.replace(/\s/g, '').toLowerCase();
            return c.includes('fs.readfile') && c.includes('data.txt');
        },
        timeLimit: 300
    },
    'Python': {
        question: "Write a function 'reverse_string' that returns a reversed string.",
        template: "def reverse_string(s):\n  return s[::-1]",
        validate: (code) => code.includes('[::-1]'),
        timeLimit: 180
    },
    'CSS': {
        question: "Center a div using Flexbox.",
        template: ".container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}",
        validate: (code) => {
            const c = code.replace(/\s/g, '').toLowerCase();
            return c.includes('display:flex') && c.includes('justify-content:center');
        },
        timeLimit: 180
    },
    'UI_UX': {
        question: "List 3 principles of good design in the comments.",
        template: "// 1. Contrast\n// 2. Balance\n// 3. Emphasis",
        validate: (code) => code.length > 20,
        timeLimit: 180
    }
};

export default function ChallengePage() {
    const { skill, anomalyId } = useParams();
    const navigate = useNavigate();
    const { userId } = useAuth();

    // Fallback if skill not in default list, just use React structure for demo
    const challengeData = DEFAULT_CHALLENGES[skill] || DEFAULT_CHALLENGES['React'];

    const [code, setCode] = useState(challengeData.template);
    const [timeLeft, setTimeLeft] = useState(challengeData.timeLimit);
    const [status, setStatus] = useState('IDLE'); // IDLE, SUCCESS, FAIL
    const [score, setScore] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setStatus('FAIL');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleSubmit = async () => {
        // Simple Validation Logic
        const isCorrect = challengeData.validate(code);

        if (isCorrect) {
            // Calculate Score based on time left
            const timeBonus = Math.floor(timeLeft / 10);
            const finalScore = 100 + timeBonus;
            setScore(finalScore);
            setStatus('SUCCESS');

            if (userId) {
                await saveChallengeResult(userId, {
                    skill,
                    score: finalScore,
                    passed: true,
                    codeSnapshot: code
                });
            }
        } else {
            setStatus('FAIL');
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (status === 'SUCCESS') {
        return (
            <>
                <Scene3D variant="job" />
                <div className="container animate-fade" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center' }}>
                    <div className="glass-panel" style={{ padding: '3rem', border: '1px solid var(--theme-job)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                        <h1 style={{ color: 'var(--theme-job)', marginBottom: '1rem' }}>MODULE COMPLETE</h1>
                        <p style={{ fontSize: '1.2rem', color: '#cbd5e1', marginBottom: '1.5rem' }}>
                            Performance Rating: {score} Pts<br />
                            Status: VERIFIED
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button onClick={() => navigate(`/jobs/interview/${anomalyId}/${skill} Developer`)} className="btn-3d" style={{ background: 'var(--theme-job)' }}>
                                PROCEED TO INTERVIEW
                            </button>
                            <button onClick={() => navigate('/dashboard')} className="btn-3d">
                                DASHBOARD
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (status === 'FAIL') {
        return (
            <>
                <Scene3D variant="job" />
                <div className="container animate-fade" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center' }}>
                    <div className="glass-panel" style={{ borderColor: '#ef4444' }}>
                        <h1 style={{ color: '#ef4444' }}>SESSION EXPIRED</h1>
                        <p>Competency verification failed.</p>
                        <button onClick={() => window.location.reload()} className="btn-3d" style={{ marginTop: '1rem' }}>RETRY MODULE</button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Scene3D variant="job" />
            <div className="container animate-fade" style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '2rem' }}>

                {/* Header */}
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="glitch" data-text={`CODE_CHALLENGE: ${skill.toUpperCase()}`} style={{ fontSize: '1.5rem', color: '#c084fc' }}>
                            CODE_CHALLENGE: {skill.toUpperCase()}
                        </h1>
                    </div>
                    <div className="glass-panel" style={{ padding: '1rem 2rem', color: timeLeft < 60 ? '#ef4444' : 'var(--theme-job)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                        {formatTime(timeLeft)}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', height: '60vh' }}>
                    {/* Problem Description */}
                    <div className="glass-panel" style={{ overflowY: 'auto', background: 'rgba(15, 23, 42, 0.8)' }}>
                        <h2 style={{ fontSize: '1.1rem', color: 'var(--theme-job)', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                            OBJECTIVE
                        </h2>
                        <p style={{ lineHeight: '1.8', color: '#e2e8f0', marginBottom: '2rem' }}>
                            {challengeData.question}
                        </p>

                        <div style={{ background: 'rgba(124, 58, 237, 0.1)', borderLeft: '4px solid var(--theme-job)', padding: '1rem', borderRadius: '4px' }}>
                            <div style={{ fontWeight: 'bold', color: 'var(--theme-job)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>BUILD YOUR OWN SOLUTION</div>
                            <ul style={{ fontSize: '0.9rem', color: '#e2e8f0', paddingLeft: '1.2rem', margin: 0 }}>
                                <li>Implement core logic from scratch.</li>
                                <li>No external libraries allowed.</li>
                                <li>Focus on deep understanding.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Code Editor */}
                    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', background: 'rgba(0, 0, 0, 0.3)', padding: 0, overflow: 'hidden' }}>
                        <div style={{ padding: '0.5rem 1rem', background: 'rgba(0,0,0,0.5)', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.8rem', color: '#94a3b8', display: 'flex', gap: '1rem' }}>
                            <span>main.js</span>
                            <span>UTF-8</span>
                        </div>
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            style={{
                                flex: 1,
                                background: 'transparent',
                                border: 'none',
                                color: '#a5b4fc',
                                fontFamily: 'monospace',
                                fontSize: '1rem',
                                padding: '1.5rem',
                                resize: 'none',
                                outline: 'none',
                                lineHeight: '1.6'
                            }}
                            spellCheck="false"
                        />
                        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <button
                                onClick={handleSubmit}
                                className="btn-3d"
                                style={{ width: '100%', background: 'var(--theme-job)', borderColor: 'var(--theme-job)' }}
                            >
                                SUBMIT SOLUTION
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
