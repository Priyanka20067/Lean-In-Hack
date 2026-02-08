import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { saveChallengeResult, getChallengesBySkill } from '../services/jobService';
import { useAuth } from '../context/AuthContext';

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
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="container animate-fade" style={{ background: '#0f172a', minHeight: '100vh', padding: '2rem', color: 'white' }}>
            <div className="bg-grid" style={{ opacity: 0.1 }}></div>

            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <div style={{ fontSize: '0.8rem', color: '#f59e0b', letterSpacing: '1px' }}>{skill.toUpperCase()} CHALLENGE</div>
                    <h1 style={{ fontSize: '1.5rem', color: 'white' }}>Skill Verification</h1>
                </div>
                <div style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: timeLeft < 60 ? '#ef4444' : '#38bdf8',
                    fontFamily: 'monospace',
                    background: 'rgba(15, 23, 42, 0.8)',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    border: '1px solid #334155'
                }}>
                    {formatTime(timeLeft)}
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', height: '60vh' }}>
                {/* Problem Statement */}
                <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '1.5rem', borderRadius: '8px', overflowY: 'auto' }}>
                    <h2 style={{ fontSize: '1.2rem', color: '#e2e8f0', marginBottom: '1rem' }}>Task</h2>
                    <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>{challengeData.question}</p>

                    <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '4px', borderLeft: '3px solid #f59e0b' }}>
                        <div style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 'bold', marginBottom: '0.5rem' }}>CRITERIA</div>
                        <ul style={{ paddingLeft: '1.2rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                            <li>Must use correct syntax</li>
                            <li>Must return expected value</li>
                            <li>Efficiency matters (Time Bonus)</li>
                        </ul>
                    </div>
                </div>

                {/* Code Editor */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{
                        background: '#1e293b',
                        padding: '0.5rem 1rem',
                        borderTopLeftRadius: '8px',
                        borderTopRightRadius: '8px',
                        fontSize: '0.8rem',
                        color: '#94a3b8',
                        borderBottom: '1px solid #334155'
                    }}>
                        solution.js
                    </div>
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        style={{
                            flex: 1,
                            background: '#0f172a',
                            color: '#e2e8f0',
                            fontFamily: 'monospace',
                            fontSize: '1rem',
                            padding: '1rem',
                            border: '1px solid #334155',
                            borderBottomLeftRadius: '8px',
                            borderBottomRightRadius: '8px',
                            resize: 'none',
                            outline: 'none',
                            lineHeight: '1.5'
                        }}
                        spellCheck="false"
                    />
                </div>
            </div>

            {/* Actions */}
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem', alignItems: 'center' }}>
                {status === 'SUCCESS' && (
                    <div className="animate-pulse" style={{ color: '#10b981', fontWeight: 'bold' }}>
                        ✓ TEST PASSED (+{score} XP)
                    </div>
                )}
                {status === 'FAIL' && (
                    <div style={{ color: '#ef4444', fontWeight: 'bold' }}>
                        ❌ VALIDATION FAILED
                    </div>
                )}

                <button
                    onClick={() => {
                        const roleMap = {
                            'React': 'Frontend Developer',
                            'CSS': 'Frontend Developer',
                            'UI_UX': 'Frontend Developer',
                            'Node.js': 'Backend Developer',
                            'Python': 'Data Analyst'
                        };
                        const role = roleMap[skill] || 'Frontend Developer';

                        if (anomalyId) {
                            navigate(`/jobs/interview/${anomalyId}/${role}`);
                        } else {
                            navigate(`/jobs/interview/${role}`);
                        }
                    }}
                    style={{
                        padding: '1rem 2rem',
                        background: 'transparent',
                        color: '#94a3b8',
                        border: '1px solid #334155',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: status === 'SUCCESS' ? 'block' : 'none'
                    }}
                >
                    Proceed to Interview &rarr;
                </button>

                <button
                    onClick={handleSubmit}
                    disabled={status === 'SUCCESS'}
                    className="btn-primary"
                    style={{
                        padding: '1rem 3rem',
                        background: status === 'SUCCESS' ? '#10b981' : '#38bdf8',
                        color: status === 'SUCCESS' ? 'white' : '#0f172a',
                        fontWeight: 'bold',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: status === 'SUCCESS' ? 'default' : 'pointer',
                        opacity: status === 'SUCCESS' ? 0.8 : 1
                    }}
                >
                    {status === 'SUCCESS' ? 'SUBMITTED' : 'RUN TESTS'}
                </button>
            </div>
        </div>
    );
}
