import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { saveInterviewScore, getInterviewQuestions } from '../services/jobService';
import { useAuth } from '../context/AuthContext';

const DEFAULT_QUESTIONS = {
    'Frontend Developer': [
        { q: "Explain the Virtual DOM in React.", keywords: ['diffing', 'reconciliation', 'browser', 'performance', 'copy'] },
        { q: "What is the difference between state and props?", keywords: ['mutable', 'immutable', 'parent', 'component', 'data'] },
        { q: "How do you handle side effects in functional components?", keywords: ['useEffect', 'lifecycle', 'api', 'clean'] }
    ],
    'Backend Developer': [
        { q: "Explain the event loop in Node.js.", keywords: ['single-threaded', 'callback', 'queue', 'blocking', 'async'] },
        { q: "What is RESTful API design?", keywords: ['resource', 'http', 'stateless', 'crud', 'json'] },
        { q: "Difference between SQL and NoSQL?", keywords: ['schema', 'relational', 'document', 'scaling', 'flexibility'] }
    ],
    'Data Analyst': [
        { q: "What is the difference between Inner Join and Outer Join?", keywords: ['match', 'records', 'table', 'combine', 'null'] },
        { q: "Explain p-value in statistics.", keywords: ['hypothesis', 'significance', 'probability', 'null', 'reject'] }
    ]
};

export default function InterviewPage() {
    const { role, anomalyId } = useParams();
    const navigate = useNavigate();
    const { userId } = useAuth();

    const [questions, setQuestions] = useState([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [scores, setScores] = useState([]);
    const [finished, setFinished] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [anomalyDesc, setAnomalyDesc] = useState('');

    useEffect(() => {
        const initInterview = async () => {
            // 1. Fetch Anomaly Details for Context
            let desc = '';
            let questions = [];

            if (anomalyId) {
                const { getJobSuggestion } = await import('../services/jobService'); // Dynamic import to avoid cycles if any
                // Actually jobService.js -> getJobSuggestion is for suggestions, we need the original anomaly
                // But wait, the anomaly text was saved in 'anomalies' collection? 
                // Let's assume we can pass it or fetch it.
                // For now, let's use a simpler approach: 
                // We will use the 'AI' service to generate questions based on the role and a simulated context if we can't fetch easily.
                // BUT, the goal is "realated question".
                // Let's try to fetch the suggestion which usually has the 'reason' or the original text?
                // Actually report saving: `addDoc(collection(db, 'anomalies'), ...)`
                // So we can fetch from 'anomalies'.

                try {
                    const { doc, getDoc } = await import('firebase/firestore');
                    const { db } = await import('../services/firebase');
                    const anomalyRef = doc(db, 'anomalies', anomalyId);
                    const anomalySnap = await getDoc(anomalyRef);
                    if (anomalySnap.exists()) {
                        desc = anomalySnap.data().description;
                        setAnomalyDesc(desc);
                    }
                } catch (err) {
                    console.error("Failed to fetch anomaly context:", err);
                }
            }

            // 2. Generate Questions
            const { generateInterviewQuestions } = await import('../services/ai');
            const generatedQs = generateInterviewQuestions(role, desc);
            setQuestions(generatedQs);
        };

        initInterview();
    }, [role, anomalyId]);

    const handleNext = async () => {
        if (!answer.trim()) return;

        // Scoring Logic: +20 pts per keyword match
        const currentQ = questions[currentQIndex];
        const lowerAnswer = answer.toLowerCase();
        let qScore = 0;

        currentQ.keywords.forEach(word => {
            if (lowerAnswer.includes(word.toLowerCase())) {
                qScore += 20;
            }
        });

        // Cap at 100, ensure min 10 for effort
        qScore = Math.min(Math.max(qScore, 10), 100);

        const newScores = [...scores, qScore];
        setScores(newScores);
        setAnswer('');

        if (currentQIndex < questions.length - 1) {
            setCurrentQIndex(prev => prev + 1);
        } else {
            // Finish
            setFinished(true);
            setIsSaving(true);

            // Calculate Average
            const totalScore = newScores.reduce((a, b) => a + b, 0);
            const avgScore = Math.round(totalScore / newScores.length);

            if (userId) {
                await saveInterviewScore(userId, role, avgScore);
            }
            setIsSaving(false);
        }
    };

    const getAverageScore = () => {
        if (scores.length === 0) return 0;
        return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    };

    if (finished) {
        const avg = getAverageScore();
        return (
            <div className="container animate-fade" style={{ background: '#0f172a', minHeight: '100vh', padding: '2rem', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '1rem', color: '#94a3b8', letterSpacing: '2px', marginBottom: '1rem' }}>INTERVIEW COMPLETE</div>
                <h1 style={{ fontSize: '3rem', color: avg >= 70 ? '#10b981' : '#f59e0b', textShadow: '0 0 20px rgba(255,255,255,0.1)' }}>
                    {avg}% SCORE
                </h1>
                <p style={{ color: '#cbd5e1', marginBottom: '2rem', textAlign: 'center', maxWidth: '400px' }}>
                    {avg >= 70 ? "Excellent technical proficiency detected. You are ready for field deployment." : "Additional training recommended based on response patterns."}
                </p>

                <div style={{ display: 'grid', gap: '1rem', width: '100%', maxWidth: '300px' }}>
                    <button
                        onClick={() => navigate('/profile/skills')}
                        className="btn-primary"
                        style={{
                            background: '#38bdf8',
                            color: '#0f172a',
                            border: 'none',
                            padding: '1rem',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        VIEW SKILL PROFILE
                    </button>
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{
                            background: 'transparent',
                            color: '#94a3b8',
                            border: '1px solid #334155',
                            padding: '1rem',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        RETURN TO DASHBOARD
                    </button>
                </div>
            </div>
        );
    }

    if (questions.length === 0) return <div>Loading interview protocols...</div>;

    return (
        <div className="container animate-fade" style={{ background: '#0f172a', minHeight: '100vh', padding: '2rem', color: 'white' }}>
            <div className="bg-grid" style={{ opacity: 0.1 }}></div>

            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', letterSpacing: '1px' }}>MOCK INTERVIEW SESSION</div>
                    <h1 style={{ fontSize: '1.5rem', color: 'white' }}>{role}</h1>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#38bdf8' }}>
                    Q{currentQIndex + 1} / {questions.length}
                </div>
            </header>

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '2rem', borderRadius: '8px', border: '1px solid #334155', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.2rem', color: '#e2e8f0', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                        {questions[currentQIndex].q}
                    </h2>

                    <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Type your answer here..."
                        style={{
                            width: '100%',
                            minHeight: '150px',
                            background: '#0f172a',
                            border: '1px solid #334155',
                            borderRadius: '4px',
                            padding: '1rem',
                            color: 'white',
                            fontSize: '1rem',
                            resize: 'vertical',
                            outline: 'none',
                            marginBottom: '1rem'
                        }}
                    />

                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>
                        * Keywords are analyzed for scoring. Be specific.
                    </div>
                </div>

                <button
                    onClick={handleNext}
                    disabled={!answer.trim()}
                    style={{
                        width: '100%',
                        padding: '1.25rem',
                        background: answer.trim() ? '#38bdf8' : '#1e293b',
                        color: answer.trim() ? '#0f172a' : '#475569',
                        border: 'none',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        cursor: answer.trim() ? 'pointer' : 'not-allowed',
                        transition: 'background 0.2s'
                    }}
                >
                    {currentQIndex === questions.length - 1 ? 'FINISH INTERVIEW' : 'NEXT QUESTION &rarr;'}
                </button>
            </div>

            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <p style={{ fontSize: '0.75rem', color: '#4a5568', fontStyle: 'italic', background: '#1e293b', padding: '0.5rem', display: 'inline-block', borderRadius: '4px' }}>
                    DISCLAIMER: This is a simulation for practice purposes only.
                </p>
            </div>
        </div>
    );
}
