import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getLearningPath, saveUserLearningProgress } from '../services/jobService';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

// Fallback data to simulate "Database" content for the prototype
const DEFAULT_PATHS = {
    'React': [
        { id: 'r1', title: 'JSX & Components', desc: 'Understanding the basic building blocks.' },
        { id: 'r2', title: 'Props & State', desc: 'Managing data flow in your app.' },
        { id: 'r3', title: 'Hooks (useState, useEffect)', desc: 'Lifecycle and state management.' },
        { id: 'r4', title: 'Routing with React Router', desc: 'Navigating between views.' }
    ],
    'Node.js': [
        { id: 'n1', title: 'Modules & Require', desc: 'Importing and exporting code.' },
        { id: 'n2', title: 'File System API', desc: 'Reading and writing files.' },
        { id: 'n3', title: 'Express.js Basics', desc: 'Building a simple web server.' }
    ],
    'Python': [
        { id: 'p1', title: 'Variables & Types', desc: 'Basic syntax and data structures.' },
        { id: 'p2', title: 'Functions & Modules', desc: 'Organizing reusable code.' },
        { id: 'p3', title: 'Pandas Basics', desc: 'Data manipulation library.' }
    ],
    'Network Security': [
        { id: 's1', title: 'OSI Model', desc: '7 layers of networking.' },
        { id: 's2', title: 'Firewalls & Ports', desc: 'Controlling traffic flow.' },
        { id: 's3', title: 'Encryption Basics', desc: 'Symmetric vs Asymmetric keys.' }
    ]
};

export default function LearningPathPage() {
    const { anomalyId } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();
    const { userId } = useAuth();
    const [activeSkill, setActiveSkill] = useState(state?.suggestion?.missingSkills[0] || 'React');
    const [pathSteps, setPathSteps] = useState([]);
    const [completedSteps, setCompletedSteps] = useState({});
    const [loading, setLoading] = useState(true);

    // Load path and user progress
    useEffect(() => {
        const loadPathData = async () => {
            setLoading(true);

            // 1. Get Path Structure (Mocking DB fetch if empty for prototype)
            // In real prod, this would be: const pathData = await getLearningPath(activeSkill);
            const steps = DEFAULT_PATHS[activeSkill] || [
                { id: 'g1', title: 'General Concepts', desc: `Basics of ${activeSkill}` },
                { id: 'g2', title: 'Advanced Practice', desc: 'Deep dive into patterns.' }
            ];
            setPathSteps(steps);

            // 2. Get User Progress
            if (userId) {
                try {
                    const progressRef = doc(db, 'userLearningProgress', `${userId}_${activeSkill}`);
                    const snap = await getDoc(progressRef);
                    if (snap.exists()) {
                        setCompletedSteps(snap.data().steps || {});
                    } else {
                        setCompletedSteps({});
                    }
                } catch (e) {
                    console.error("Error loading progress:", e);
                }
            }
            setLoading(false);
        };

        if (activeSkill) {
            loadPathData();
        }
    }, [activeSkill, userId]);

    const handleToggleStep = async (stepIndex) => {
        const isComplete = !completedSteps[stepIndex];
        const newCompleted = { ...completedSteps, [stepIndex]: isComplete };
        setCompletedSteps(newCompleted);

        // Optimistic UI update, then save
        await saveUserLearningProgress(userId, activeSkill, stepIndex, isComplete);
    };

    const calculateProgress = () => {
        const total = pathSteps.length;
        const done = Object.values(completedSteps).filter(Boolean).length;
        return total === 0 ? 0 : Math.round((done / total) * 100);
    };

    if (!state?.suggestion) {
        return <div style={{ padding: '2rem', color: 'white' }}>Invalid Access. Start from Repor or Jobs.</div>;
    }

    return (
        <div className="container animate-fade" style={{ background: '#0f172a', minHeight: '100vh', padding: '2rem', color: 'white' }}>
            <div className="bg-grid" style={{ opacity: 0.1 }}></div>

            <header style={{ marginBottom: '2rem' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', marginBottom: '1rem' }}>&larr; BACK</button>
                <div style={{ fontSize: '0.8rem', color: '#38bdf8', letterSpacing: '1px' }}>TRAINING PROTOCOL FOR</div>
                <h1 style={{ fontSize: '2rem', color: 'white' }}>{state.suggestion.role}</h1>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2rem' }}>
                {/* Sidebar: Skills */}
                <div style={{ background: 'rgba(30, 41, 59, 0.5)', borderRadius: '8px', padding: '1rem', height: 'fit-content' }}>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '1rem', textTransform: 'uppercase' }}>Required Skills</div>
                    {state.suggestion.missingSkills.map(skill => (
                        <div
                            key={skill}
                            onClick={() => setActiveSkill(skill)}
                            style={{
                                padding: '0.75rem',
                                borderRadius: '4px',
                                background: activeSkill === skill ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                                borderLeft: activeSkill === skill ? '2px solid #38bdf8' : '2px solid transparent',
                                color: activeSkill === skill ? '#38bdf8' : '#cbd5e1',
                                cursor: 'pointer',
                                marginBottom: '0.5rem',
                                fontSize: '0.9rem'
                            }}
                        >
                            {skill}
                        </div>
                    ))}
                </div>

                {/* Main: Learning Path */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', color: '#f8fafc' }}>{activeSkill} Track</h2>
                        <div style={{ fontSize: '0.9rem', color: '#38bdf8' }}>{calculateProgress()}% Complete</div>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ width: '100%', height: '4px', background: '#334155', borderRadius: '2px', marginBottom: '2rem' }}>
                        <div style={{ width: `${calculateProgress()}%`, height: '100%', background: '#38bdf8', borderRadius: '2px', transition: 'width 0.3s' }}></div>
                    </div>

                    {/* Loading State */}
                    {loading ? (
                        <div className="animate-pulse" style={{ color: '#94a3b8' }}>Loading modules...</div>
                    ) : (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {pathSteps.map((step, index) => (
                                <div
                                    key={step.id}
                                    style={{
                                        background: 'rgba(30, 41, 59, 0.3)',
                                        border: '1px solid #334155',
                                        borderRadius: '8px',
                                        padding: '1.5rem',
                                        display: 'flex',
                                        gap: '1rem',
                                        opacity: completedSteps[index] ? 0.6 : 1
                                    }}
                                >
                                    <div
                                        onClick={() => handleToggleStep(index)}
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            border: `2px solid ${completedSteps[index] ? '#38bdf8' : '#64748b'}`,
                                            background: completedSteps[index] ? '#38bdf8' : 'transparent',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            flexShrink: 0
                                        }}
                                    >
                                        {completedSteps[index] && <span style={{ color: '#0f172a', fontSize: '0.8rem', fontWeight: 'bold' }}>✓</span>}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '1.1rem', color: completedSteps[index] ? '#94a3b8' : 'white', marginBottom: '0.25rem' }}>{step.title}</div>
                                        <div style={{ fontSize: '0.9rem', color: '#64748b' }}>{step.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: '8px' }}>
                        <div style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '0.5rem' }}>READY TO PROVE YOURSELF?</div>
                        <p style={{ color: '#ecfdf5', fontSize: '0.9rem', marginBottom: '1rem' }}>
                            Completing this track will unlock the <strong>{activeSkill} Verification Challenge</strong>.
                        </p>
                        <button
                            onClick={() => navigate(`/jobs/challenge/${activeSkill}`)}
                            className="btn-primary"
                            style={{
                                background: '#10b981',
                                color: '#064e3b',
                                border: 'none',
                                padding: '0.75rem 1.5rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                borderRadius: '4px'
                            }}
                        >
                            START CHALLENGE &rarr;
                        </button>
                    </div>

                    <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.8rem', color: '#64748b' }}>
                        Inspired by <strong>CodeCrafters</strong> structured learning paths.
                    </div>
                </div>
            </div>
        </div>
    );
}
