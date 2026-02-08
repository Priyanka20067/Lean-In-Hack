import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { saveInterviewScore } from '../services/jobService';
import { useAuth } from '../context/AuthContext';
import Scene3D from '../components/Scene3D';

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
            let desc = '';
            if (anomalyId) {
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

            const { generateInterviewQuestions } = await import('../services/ai');
            const generatedQs = generateInterviewQuestions(role, desc);
            setQuestions(generatedQs);
        };

        initInterview();
    }, [role, anomalyId]);

    const handleNext = async () => {
        if (!answer.trim()) return;

        const currentQ = questions[currentQIndex];
        const lowerAnswer = answer.toLowerCase();
        let qScore = 0;

        currentQ.keywords.forEach(word => {
            if (lowerAnswer.includes(word.toLowerCase())) {
                qScore += 20;
            }
        });

        qScore = Math.min(Math.max(qScore, 10), 100);

        const newScores = [...scores, qScore];
        setScores(newScores);
        setAnswer('');

        if (currentQIndex < questions.length - 1) {
            setCurrentQIndex(prev => prev + 1);
        } else {
            setFinished(true);
            setIsSaving(true);
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
            <>
                <Scene3D variant="job" />
                <div className="container animate-fade" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '2rem' }}>
                    <div className="glass-panel" style={{ maxWidth: '500px', width: '100%', textAlign: 'center', borderTop: avg >= 70 ? '4px solid #10b981' : '4px solid #f59e0b' }}>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', letterSpacing: '2px', marginBottom: '1rem', fontWeight: 'bold' }}>SIMULATION TERMINATED</div>
                        <h1 style={{ fontSize: '3.5rem', color: 'white', marginBottom: '0.5rem' }}>{avg}%</h1>
                        <div style={{ fontSize: '1.2rem', color: avg >= 70 ? '#10b981' : '#f59e0b', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                            {avg >= 70 ? "PROFICIENCY VERIFIED" : "INSUFFICIENT KNOWLEDGE"}
                        </div>
                        <p style={{ color: '#cbd5e1', marginBottom: '2.5rem' }}>
                            {avg >= 70
                                ? "Your neural response patterns match the required profile for field deployment."
                                : "Response analysis indicates gaps in core technical sectors. Recalibration required."}
                        </p>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <button onClick={() => navigate('/profile/skills')} className="btn-3d" style={{ background: 'var(--theme-job)', borderColor: 'var(--theme-job)' }}>
                                OPEN SKILL PROFILE
                            </button>
                            <button onClick={() => navigate('/dashboard')} className="btn-3d" style={{ opacity: 0.6 }}>
                                RETURN TO HUB
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a' }}>
                <div className="animate-pulse" style={{ color: 'var(--theme-job)', fontWeight: 'bold' }}>INITIALIZING INTERVIEW NEURAL-LINK...</div>
            </div>
        );
    }

    return (
        <>
            <Scene3D variant="job" />
            <div className="container animate-fade" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: '2rem' }}>

                <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--theme-job)', letterSpacing: '2px', fontWeight: 'bold' }}>AI-DRIVEN EVALUATION</div>
                        <h1 style={{ fontSize: '2rem', color: 'white' }}>{role}</h1>
                    </div>
                    <div className="glass-panel" style={{ padding: '0.5rem 1.5rem', border: '1px solid var(--theme-job)', color: 'white', fontWeight: 'bold' }}>
                        NODE {currentQIndex + 1} / {questions.length}
                    </div>
                </header>

                <div style={{ maxWidth: '900px', width: '100%', margin: '0 auto' }}>
                    <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2rem', background: 'rgba(30, 41, 59, 0.4)' }}>
                        <h2 style={{ fontSize: '1.4rem', color: 'white', marginBottom: '2rem', lineHeight: '1.6', borderLeft: '4px solid var(--theme-job)', paddingLeft: '1.5rem' }}>
                            {questions[currentQIndex].q}
                        </h2>

                        <div style={{ position: 'relative' }}>
                            <textarea
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder="Submit your multi-layered response..."
                                style={{
                                    width: '100%',
                                    minHeight: '200px',
                                    background: 'rgba(0,0,0,0.3)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    padding: '1.5rem',
                                    color: '#cbd5e1',
                                    fontSize: '1.1rem',
                                    fontFamily: 'monospace',
                                    resize: 'none',
                                    outline: 'none',
                                    lineHeight: '1.6'
                                }}
                            />
                            <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', fontSize: '0.7rem', color: '#64748b' }}>
                                ENCRYPTED_STREAM_ACTIVE
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={!answer.trim()}
                        className="btn-3d"
                        style={{
                            width: '100%',
                            background: answer.trim() ? 'var(--theme-job)' : 'transparent',
                            borderColor: answer.trim() ? 'var(--theme-job)' : 'rgba(255,255,255,0.1)',
                            color: answer.trim() ? 'white' : '#475569',
                            fontSize: '1.1rem'
                        }}
                    >
                        {currentQIndex === questions.length - 1 ? 'TERMINATE & EVALUATE' : 'UPLOAD RESPONSE & NEXT NODE'}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <span style={{ fontSize: '0.7rem', color: '#475569', background: 'rgba(255,255,255,0.03)', padding: '4px 12px', borderRadius: '4px' }}>
                            NEURAL ANALYZER: KEYWORD_EXTRACTION_PROTOCOL_ENABLED
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}
