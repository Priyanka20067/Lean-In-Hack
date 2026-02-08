import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/saas.css';
import logoImg from '../assets/logo.png';

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div style={{ backgroundColor: 'var(--saas-bg)', minHeight: '100vh', overflowX: 'hidden' }}>

            {/* 1. HERO SECTION - Precision Aligned */}
            <header className="saas-section" style={{ minHeight: '100vh', position: 'relative' }}>
                <div className="saas-container" style={{ zIndex: 2, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap', textAlign: 'left' }}>
                    <img
                        src={logoImg}
                        alt="HANex Logo"
                        style={{
                            width: 'clamp(180px, 25vw, 300px)',
                            height: 'auto',
                            borderRadius: '32px',
                            boxShadow: '0 0 60px rgba(30, 64, 175, 0.5)'
                        }}
                        className="animate-float"
                    />
                    <div style={{ flex: '1', minWidth: '300px' }}>
                        
                        <h1 className="saas-title" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                            One Report. <br />
                            <span style={{
                                background: 'linear-gradient(to bottom, #60a5fa, #1e40af)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>Real Solutions.</span>
                        </h1>
                        <p className="saas-subtitle" style={{ margin: '0 0 3rem 0', textAlign: 'left' }}>
                            Report any anomaly—job, health, or civic—and our neural link will route it to the right solution automatically.
                        </p>
                        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                            <button onClick={() => navigate('/report')} className="saas-btn saas-btn-primary">
                                Report an Issue
                            </button>
                            <button className="saas-btn saas-btn-secondary">
                                See How It Works
                            </button>
                        </div>
                    </div>
                </div>

                {/* Subtle Background Glows */}
                <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(30, 64, 175, 0.2) 0%, transparent 70%)', zIndex: 1, pointerEvents: 'none' }} />
            </header>

            {/* 2. HOW IT WORKS - Grid Corrected */}
            <section className="saas-section saas-section-alt">
                <div className="saas-container" style={{ width: '100%' }}>
                    <div style={{ marginBottom: '5rem' }}>
                        <h2 className="saas-title" style={{ fontSize: '3rem' }}>How It Works</h2>
                        <div style={{ width: '60px', height: '4px', background: 'var(--saas-primary)', margin: '0 auto' }}></div>
                    </div>
                    <div className="saas-grid">
                        <div className="saas-card">
                            <div style={{ fontSize: '3.5rem', marginBottom: '2rem' }}>✍️</div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', color: 'white' }}>1. Report</h3>
                            <p className="saas-text-muted">Describe your problem in simple words. Our system handles the complexities of documentation.</p>
                        </div>
                        <div className="saas-card">
                            <div style={{ fontSize: '3.5rem', marginBottom: '2rem' }}>🧠</div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', color: 'white' }}>2. System Understands</h3>
                            <p className="saas-text-muted">Direct neural analysis categorizes and routes the data to the correct institutional department.</p>
                        </div>
                        <div className="saas-card">
                            <div style={{ fontSize: '3.5rem', marginBottom: '2rem' }}>✅</div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', color: 'white' }}>3. Action Happens</h3>
                            <p className="saas-text-muted">Authorities, specialists, or community leaders take immediate action to resolve the conflict.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. SOLUTIONS WE OFFER - Thematic Alignment */}
            <section className="saas-section">
                <div className="saas-container" style={{ width: '100%' }}>
                    <div style={{ marginBottom: '4rem' }}>
                        <h2 className="saas-title" style={{ fontSize: '3rem' }}>Solutions Delivered</h2>
                        <p className="saas-subtitle" style={{ color: 'var(--saas-primary)', fontWeight: 600 }}>Turning transmissions into verifiable results.</p>
                    </div>
                    <div className="saas-grid">
                        <div className="saas-card" style={{ borderTop: '4px solid #3b82f6' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🏛</div>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem', color: 'white' }}>Government Issues</h3>
                            <p className="saas-text-muted">Track civic problems with full transparency and direct communication channels.</p>
                        </div>
                        <div className="saas-card" style={{ borderTop: '4px solid #1e40af' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🏥</div>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem', color: 'white' }}>Healthcare Support</h3>
                            <p className="saas-text-muted">Anonymous health guidance and medication tracking for at-risk citizens.</p>
                        </div>
                        <div className="saas-card" style={{ borderTop: '4px solid #60a5fa' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>💼</div>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem', color: 'white' }}>Career & Skills</h3>
                            <p className="saas-text-muted">Prove your expertise through verifiable challenges and specialized learning paths.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. DIFFERENTIATION - Visual Contrast */}
            <section className="saas-section saas-section-alt">
                <div className="saas-container" style={{ width: '100%' }}>
                    <div className="saas-grid" style={{ alignItems: 'stretch' }}>
                        <div style={{ textAlign: 'left', padding: '1rem' }}>
                            <h2 className="saas-title" style={{ fontSize: '2.5rem', textAlign: 'left', marginBottom: '3rem' }}>The Neural Advantage</h2>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {['No manual category selection', 'Community-first approach', 'Proof-based skills', 'Ethical healthcare data', 'Offline-first synchronization'].map((item, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', fontSize: '1.2rem', color: 'var(--saas-text)' }}>
                                        <span style={{ color: 'var(--saas-primary)', fontSize: '1.5rem', fontWeight: 'bold' }}>•</span> {item}
                                    </li>
                                ))}
                            </ul>
                            <p style={{ marginTop: '3rem', fontWeight: 700, color: 'var(--saas-primary)', fontSize: '1.3rem' }}>
                                Built for real impact, anywhere.
                            </p>
                        </div>
                        <div className="saas-card" style={{ background: 'linear-gradient(135deg, #1e3a8a, #020617)', border: '1px solid var(--saas-primary)' }}>
                            <p style={{ fontSize: '1.5rem', fontStyle: 'italic', fontWeight: 500, lineHeight: 1.6, color: 'white' }}>
                                "HANex turns citizen signals into actionable solutions—automatically."
                            </p>
                            <div style={{ marginTop: '2rem', fontSize: '0.8rem', opacity: 0.6, letterSpacing: '4px', textTransform: 'uppercase' }}>
                                System Core Mandate
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. TRUST & SAFETY - Icons Aligned */}
            <section className="saas-section">
                <div className="saas-container" style={{ width: '100%' }}>
                    <h2 className="saas-title" style={{ fontSize: '3rem', marginBottom: '5rem' }}>Built on Trust</h2>
                    <div className="saas-grid">
                        {[
                            { icon: '🛡️', title: 'Full Anonymity', text: 'Report sensitive issues without risking your operational security.' },
                            { icon: '🔒', title: 'Data Encryption', text: 'End-to-end encryption ensures your data remains immutable and private.' },
                            { icon: '🩺', title: 'Health First', text: 'AI-driven guidance focused on safety, not algorithmic diagnosis.' },
                            { icon: '📡', title: 'Live Lifecycle', text: 'Watch your report move through the system in real-time transparency.' }
                        ].map((item, i) => (
                            <div key={i} className="saas-card" style={{ padding: '2rem', alignItems: 'flex-start', textAlign: 'left' }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>{item.icon}</div>
                                <h4 style={{ fontWeight: 800, marginBottom: '1rem', color: 'white', fontSize: '1.2rem' }}>{item.title}</h4>
                                <p style={{ fontSize: '1rem', color: 'var(--saas-text-muted)', lineHeight: '1.5' }}>{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. IMPACT - Metrics Centered */}
            <section className="saas-section saas-section-alt">
                <div className="saas-container" style={{ width: '100%' }}>
                    <div className="saas-grid">
                        {[
                            { label: 'Transmission Logs', val: '1,240+' },
                            { label: 'Conflict Resolution', val: '86%' },
                            { label: 'Skill Profiles', val: '500+' },
                            { label: 'Sectors Active', val: '12' }
                        ].map((stat, i) => (
                            <div key={i} style={{ padding: '2rem' }}>
                                <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--saas-primary)', marginBottom: '0.5rem', textShadow: '0 0 30px rgba(59, 130, 246, 0.4)' }}>{stat.val}</div>
                                <div style={{ fontWeight: 800, color: 'var(--saas-text-muted)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '3px' }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. CTA - Closing Statement */}
            <section className="saas-section" style={{ background: 'linear-gradient(to bottom, #020617, #1e3a8a)', paddingTop: '10rem', paddingBottom: '10rem' }}>
                <div className="saas-container">
                    <h2 className="saas-title">Start With One Report</h2>
                    <p className="saas-subtitle" style={{ marginBottom: '4rem' }}>
                        No friction. No barriers. Just results. Join the nexus of change today.
                    </p>
                    <button onClick={() => navigate('/report')} className="saas-btn saas-btn-primary" style={{ padding: '1.25rem 4rem', fontSize: '1.3rem' }}>
                        INITIATE REPORT
                    </button>
                </div>
            </section>

            <footer style={{ padding: '4rem 0', borderTop: '1px solid rgba(59,130,246,0.1)', textAlign: 'center', fontSize: '0.8rem', color: 'var(--saas-text-muted)', backgroundColor: '#020617' }}>
                <div style={{ letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.6 }}>
                    © 2026 HANex Operations // Hawkins Anomaly Nexus
                </div>
            </footer>
        </div>
    );
}
