import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { saveJobSuggestion, getJobSuggestion } from '../services/jobService';
import Scene3D from '../components/Scene3D';

export default function JobSuggestionPage() {
    const { anomalyId } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [suggestion, setSuggestion] = useState(null);

    useEffect(() => {
        const fetchOrGenerateSuggestion = async () => {
            const existing = await getJobSuggestion(anomalyId);
            if (existing) {
                setSuggestion(existing);
                setLoading(false);
                return;
            }

            const description = state?.description || "Unknown Anomaly Pattern";
            const text = description.toLowerCase();
            let role = "Field Operative";
            let skills = ["Observation", "Stealth"];
            let reason = "Standard anomaly detection duties.";

            if (text.includes('frontend') || text.includes('ui') || text.includes('design') || text.includes('interface')) {
                role = "Frontend Developer";
                skills = ["React", "CSS", "UI_UX"];
                reason = "Anomaly involves visual interface glitches.";
            } else if (text.includes('backend') || text.includes('database') || text.includes('server') || text.includes('api')) {
                role = "Backend Developer";
                skills = ["Node.js", "Firebase", "API Design"];
                reason = "Anomaly involves potential server-side corruption.";
            } else if (text.includes('data') || text.includes('analysis') || text.includes('ai') || text.includes('pattern')) {
                role = "Data Analyst";
                skills = ["Python", "SQL", "Data Viz"];
                reason = "Anomaly requires complex pattern recognition.";
            } else if (text.includes('security') || text.includes('hack') || text.includes('encrypt') || text.includes('access')) {
                role = "Cybersecurity Specialist";
                skills = ["Network Security", "Encryption", "Ethical Hacking"];
                reason = "Anomaly involves unauthorized access or breaches.";
            }

            const newSuggestion = {
                role,
                missingSkills: skills,
                reason,
                anomalyId
            };

            await saveJobSuggestion(anomalyId, newSuggestion);
            setSuggestion(newSuggestion);
            setLoading(false);
        };

        if (anomalyId) {
            fetchOrGenerateSuggestion();
        }
    }, [anomalyId, state]);

    if (loading) {
        return (
            <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a' }}>
                <div className="animate-pulse" style={{ color: 'var(--theme-job)', fontSize: '1.2rem', fontWeight: 'bold' }}>
                    ANALYZING ANOMALY SIGNATURES...
                </div>
            </div>
        );
    }

    return (
        <>
            <Scene3D variant="job" />
            <div className="container animate-fade" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem' }}>

                <div className="glass-panel" style={{ maxWidth: '800px', width: '100%', borderTop: '4px solid var(--theme-job)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--theme-job)', letterSpacing: '4px', marginBottom: '1rem', fontWeight: 'bold' }}>
                            ANOMALY ID: {anomalyId?.substring(0, 8).toUpperCase() || "INTERNAL"}
                        </div>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', background: 'linear-gradient(to right, white, var(--theme-job))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            CAREER TRAJECTORY
                        </h1>
                        <p style={{ color: '#94a3b8' }}>Neural mapping complete. Recommended specialization found.</p>
                    </div>

                    <div style={{ padding: '2rem', background: 'rgba(124, 58, 237, 0.05)', borderRadius: '16px', border: '1px solid rgba(124, 58, 237, 0.1)', marginBottom: '2.5rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--theme-job)', marginBottom: '0.5rem', fontWeight: 'bold', textTransform: 'uppercase' }}>IDENTIFIED ROLE</div>
                        <h2 style={{ fontSize: '2.8rem', color: 'white', marginBottom: '1rem' }}>{suggestion.role}</h2>
                        <p style={{ fontSize: '1.1rem', color: '#cbd5e1', fontStyle: 'italic', marginBottom: '2rem' }}>"{suggestion.reason}"</p>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                            {suggestion.missingSkills.map(skill => (
                                <span key={skill} style={{
                                    padding: '6px 16px',
                                    background: 'rgba(124, 58, 237, 0.1)',
                                    border: '1px solid var(--theme-job)',
                                    borderRadius: '20px',
                                    color: 'white',
                                    fontSize: '0.85rem'
                                }}>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <button
                            onClick={() => navigate(`/jobs/learning/${anomalyId}`, { state: { suggestion } })}
                            className="btn-3d"
                            style={{ background: 'var(--theme-job)', borderColor: 'var(--theme-job)', fontSize: '1.1rem' }}
                        >
                            INITIATE TRAINING PROTOCOL
                        </button>

                        <button
                            onClick={() => navigate('/report')}
                            className="btn-3d"
                            style={{ opacity: 0.6 }}
                        >
                            DECLINE ASSIGNMENT
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
