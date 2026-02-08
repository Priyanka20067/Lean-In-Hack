import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { saveUserLearningProgress } from '../services/jobService';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import Scene3D from '../components/Scene3D';

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
    ],
    'UI_UX': [
        { id: 'u1', title: 'Wireframing', desc: 'Blueprints for design.' },
        { id: 'u2', title: 'Color Theory', desc: 'Understanding palettes.' },
        { id: 'u3', title: 'Typography', desc: 'Fonts and readability.' }
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

    useEffect(() => {
        const loadPathData = async () => {
            setLoading(true);
            const steps = DEFAULT_PATHS[activeSkill] || [
                { id: 'g1', title: 'General Concepts', desc: `Basics of ${activeSkill}` },
                { id: 'g2', title: 'Advanced Practice', desc: 'Deep dive into patterns.' }
            ];
            setPathSteps(steps);

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
        await saveUserLearningProgress(userId, activeSkill, stepIndex, isComplete);
    };

    const calculateProgress = () => {
        const total = pathSteps.length;
        const done = Object.values(completedSteps).filter(Boolean).length;
        return total === 0 ? 0 : Math.round((done / total) * 100);
    };

    if (!state?.suggestion) {
        return (
            <div className="container" style={{ textAlign: 'center', paddingTop: '10rem' }}>
                <p>Invalid training session. Please re-synchronize from the Dashboard.</p>
                <button onClick={() => navigate('/dashboard')} className="btn-3d">RETURN TO DASHBOARD</button>
            </div>
        );
    }

    return (
        <>
            <Scene3D variant="job" />
            <div className="container animate-fade" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: '2rem' }}>

                <header style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--theme-job)', letterSpacing: '2px', fontWeight: 'bold' }}>SKILL DEVELOPMENT PROTOCOL</div>
                            <h1 style={{ fontSize: '2.5rem', color: 'white' }}>{state.suggestion.role}</h1>
                        </div>
                        <button onClick={() => navigate(-1)} className="btn-3d" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>&larr; BACK</button>
                    </div>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 3fr', gap: '2rem', flex: 1 }}>
                    {/* Sidebar */}
                    <div className="glass-panel" style={{ height: 'fit-content', padding: '1.5rem' }}>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Syllabus Nodes</div>
                        {state.suggestion.missingSkills.map(skill => (
                            <div
                                key={skill}
                                onClick={() => setActiveSkill(skill)}
                                style={{
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    background: activeSkill === skill ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                                    border: activeSkill === skill ? '1px solid var(--theme-job)' : '1px solid transparent',
                                    color: activeSkill === skill ? 'white' : '#94a3b8',
                                    cursor: 'pointer',
                                    marginBottom: '0.5rem',
                                    fontSize: '0.9rem',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {skill}
                            </div>
                        ))}
                    </div>

                    {/* Main Path */}
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', color: 'white' }}>{activeSkill} Curriculum</h2>
                            <div style={{ fontSize: '1rem', color: 'var(--theme-job)', fontWeight: 'bold' }}>{calculateProgress()}% SYNC</div>
                        </div>

                        {/* Progress Bar */}
                        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', marginBottom: '2.5rem', overflow: 'hidden' }}>
                            <div style={{ width: `${calculateProgress()}%`, height: '100%', background: 'var(--theme-job)', boxShadow: '0 0 10px var(--theme-job)', transition: 'width 0.5s ease-out' }}></div>
                        </div>

                        {loading ? (
                            <div className="animate-pulse" style={{ color: 'var(--theme-job)', textAlign: 'center', padding: '3rem' }}>FETCHING MODULE DATA...</div>
                        ) : (
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {pathSteps.map((step, index) => (
                                    <div
                                        key={step.id}
                                        style={{
                                            background: 'rgba(30, 41, 59, 0.3)',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            borderRadius: '12px',
                                            padding: '1.5rem',
                                            display: 'flex',
                                            gap: '1.5rem',
                                            alignItems: 'center',
                                            opacity: completedSteps[index] ? 0.5 : 1,
                                            transition: 'opacity 0.3s'
                                        }}
                                    >
                                        <div
                                            onClick={() => handleToggleStep(index)}
                                            style={{
                                                width: '28px',
                                                height: '28px',
                                                borderRadius: '50%',
                                                border: `2px solid ${completedSteps[index] ? 'var(--theme-job)' : '#475569'}`,
                                                background: completedSteps[index] ? 'var(--theme-job)' : 'transparent',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                flexShrink: 0
                                            }}
                                        >
                                            {completedSteps[index] && <span style={{ color: 'white', fontSize: '0.9rem', fontWeight: 'bold' }}>✓</span>}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '1.1rem', color: 'white', marginBottom: '4px' }}>{step.title}</div>
                                            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{step.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '12px' }}>
                            <div style={{ color: 'var(--theme-job)', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>CHALLENGE GATEWAY</div>
                            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                Complete all curriculum nodes to unlock the **{activeSkill} Verification Challenge**.
                            </p>
                            <button
                                onClick={() => navigate(`/jobs/challenge/${anomalyId}/${activeSkill}`)}
                                className="btn-3d"
                                style={{ width: '100%', background: 'var(--theme-job)', borderColor: 'var(--theme-job)' }}
                            >
                                START CHALLENGE MODULE
                            </button>
                        </div>

                        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.75rem', color: '#64748b' }}>
                            {/* Support CodeCrafters link or branding */}
                            POWERED BY <span style={{ color: 'var(--theme-job)', fontWeight: 'bold' }}>CODECRAFTERS</span> METHODOLOGY
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
