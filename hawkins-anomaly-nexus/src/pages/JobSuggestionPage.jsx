import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { saveJobSuggestion, getJobSuggestion } from '../services/jobService';

export default function JobSuggestionPage() {
    const { anomalyId } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [suggestion, setSuggestion] = useState(null);

    useEffect(() => {
        const fetchOrGenerateSuggestion = async () => {
            // 1. Try to fetch existing suggestion first
            const existing = await getJobSuggestion(anomalyId);
            if (existing) {
                setSuggestion(existing);
                setLoading(false);
                return;
            }

            // 2. If not found, generate new from description
            const description = state?.description || "Unknown Anomaly Pattern";
            // In a real app, we might fetch the anomaly doc from Firestore if description is missing.

            // SYSTEM LOGIC: Extract keywords & map to roles
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

            // 3. Save to Firestore
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
            <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a', color: '#38bdf8' }}>
                <div className="animate-pulse">ANALYZING SKILL GAPS...</div>
            </div>
        );
    }

    return (
        <div className="container animate-fade" style={{
            '--color-primary': 'var(--theme-job-primary)',
            '--color-secondary': 'var(--theme-job-secondary)',
            '--color-accent': 'var(--theme-job-accent)',
            background: 'var(--theme-job-bg)',
            minHeight: '100vh',
            padding: '2rem',
            color: 'white'
        }}>
            <div className="bg-grid" style={{ opacity: 0.1 }}></div>

            <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--theme-job-accent)', letterSpacing: '2px', marginBottom: '0.5rem' }}>ANOMALY REPORT #{anomalyId}</div>
                <h1 style={{ fontSize: '1.8rem', color: 'white', textShadow: '0 0 10px rgba(124, 58, 237, 0.5)' }}>CAREER PATH DETECTED</h1>
            </header>

            <div className="hud-border" style={{
                background: 'rgba(10, 10, 10, 0.6)',
                padding: '2rem',
                borderRadius: '8px',
                border: '1px solid var(--color-primary)',
                marginBottom: '2rem',
                textAlign: 'center'
            }}>
                <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem' }}>BASED ON YOUR REPORT:</div>
                <div style={{ fontSize: '1rem', fontStyle: 'italic', color: '#e2e8f0', marginBottom: '2rem' }}>"{state?.description || 'Data Not Available'}"</div>

                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', width: '100%', marginBottom: '2rem' }}></div>

                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-primary)', letterSpacing: '1px' }}>SUGGESTED ROLE</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', textShadow: '0 0 20px rgba(124, 58, 237, 0.3)' }}>{suggestion.role}</div>
                    <div style={{ color: '#cbd5e1', marginTop: '0.5rem' }}>{suggestion.reason}</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    {suggestion.missingSkills.map(skill => (
                        <div key={skill} style={{
                            padding: '0.5rem 1rem',
                            background: 'rgba(124, 58, 237, 0.1)',
                            border: '1px solid var(--color-primary)',
                            borderRadius: '4px',
                            color: 'var(--theme-job-accent)'
                        }}>
                            {skill}
                        </div>
                    ))}
                </div>
            </div>

            <button
                onClick={() => navigate(`/jobs/learning/${anomalyId}`, { state: { suggestion } })}
                className="btn-primary"
                style={{
                    width: '100%',
                    padding: '1.5rem',
                    fontSize: '1.2rem',
                    background: 'var(--color-primary)',
                    color: 'white',
                    fontWeight: 'bold',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    boxShadow: '0 0 20px rgba(124, 58, 237, 0.4)'
                }}
            >
                START TRAINING PROTOCOL &rarr;
            </button>

            <button
                onClick={() => navigate('/report')}
                style={{
                    width: '100%',
                    marginTop: '1rem',
                    padding: '1rem',
                    background: 'transparent',
                    color: '#94a3b8',
                    border: '1px solid #334155',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                DECLINE & RETURN
            </button>
        </div>
    );
}
