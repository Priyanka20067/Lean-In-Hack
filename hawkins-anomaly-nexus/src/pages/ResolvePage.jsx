import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { updateAnomalyStatus } from '../services/firestoreService';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import Scene3D from '../components/Scene3D';

export default function ResolvePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userId } = useAuth();
    const [showScore, setShowScore] = useState(false);

    useEffect(() => {
        const resolveAnomaly = async () => {
            // 1. Mark anomaly as resolved in Firestore
            await updateAnomalyStatus(id, 'RESOLVED');

            // 2. Add Points to User Profile (Real Transaction)
            if (userId) {
                try {
                    const userRef = doc(db, 'users', userId);
                    await updateDoc(userRef, {
                        points: increment(50)
                    });
                } catch (e) {
                    console.error("Failed to update points:", e);
                }
            }

            // 3. Show Score After delay
            setTimeout(() => {
                setShowScore(true);
            }, 3000);
        };

        resolveAnomaly();
    }, [id, userId]);

    return (
        <>
            <Scene3D variant="gov" />
            <div className="container animate-fade" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '2rem' }}>

                {!showScore ? (
                    <div className="glass-panel" style={{ maxWidth: '400px', width: '100%', textAlign: 'center', padding: '3rem' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--theme-gov)', letterSpacing: '4px', marginBottom: '2rem', fontWeight: 'bold' }}>INITIATING_CONTAINMENT</div>

                        <div className="portal-container" style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto 2rem' }}>
                            <div className="portal"></div>
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div className="animate-spin" style={{ width: '100px', height: '100px', border: '2px solid var(--theme-gov)', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
                            </div>
                        </div>

                        <h2 style={{ color: 'white', fontSize: '1.2rem', fontFamily: 'monospace' }}>SEALING DIMENSIONAL NODE...</h2>
                    </div>
                ) : (
                    <div className="glass-panel animate-fade" style={{ maxWidth: '500px', width: '100%', textAlign: 'center', borderTop: '4px solid #10b981', padding: '4rem 2rem' }}>
                        <div style={{ fontSize: '0.9rem', color: '#10b981', letterSpacing: '4px', marginBottom: '1.5rem', fontWeight: 'bold' }}>SUCCESS_RESOLVED</div>
                        <h1 style={{ fontSize: '3rem', color: 'white', marginBottom: '1rem' }}>NODE_CLEANSED</h1>
                        <p style={{ color: '#94a3b8', marginBottom: '3rem' }}>Dimensional stability has been restored to this sector. Your assistance has been logged.</p>

                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: '12px', padding: '1.5rem', marginBottom: '3rem' }}>
                            <div style={{ fontSize: '0.8rem', color: '#10b981', marginBottom: '0.5rem' }}>CREDENTIALS_UPDATED</div>
                            <div style={{ fontSize: '2.5rem', color: 'white', fontWeight: 'bold' }}>+50 XP</div>
                        </div>

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <button onClick={() => navigate('/map')} className="btn-3d" style={{ background: 'var(--theme-gov)', borderColor: 'var(--theme-gov)' }}>RETURN TO OPERATIONAL MAP</button>
                            <button onClick={() => navigate('/profile')} className="btn-3d" style={{ opacity: 0.6 }}>VIEW UPDATED PROFILE</button>
                        </div>
                    </div>
                )}

                <style>{`
                    .portal {
                        position: absolute;
                        inset: 40px;
                        border-radius: 50%;
                        background: radial-gradient(circle, #000 20%, #38bdf8 80%);
                        box-shadow: 0 0 50px #38bdf8, inset 0 0 50px #000;
                        animation: closePortal 3s forwards;
                    }
                    @keyframes closePortal {
                        0% { transform: scale(1); opacity: 1; filter: brightness(2); }
                        50% { transform: scale(0.6); opacity: 0.8; }
                        100% { transform: scale(0); opacity: 0; }
                    }
                `}</style>
            </div>
        </>
    );
}
