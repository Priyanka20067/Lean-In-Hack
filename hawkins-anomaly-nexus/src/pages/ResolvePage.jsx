import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { updateAnomalyStatus } from '../services/firestoreService';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';

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
                const userRef = doc(db, 'users', userId);
                await updateDoc(userRef, {
                    points: increment(50)
                });
            }

            // 3. Show Score
            setTimeout(() => {
                setShowScore(true);
            }, 3000);
        };

        resolveAnomaly();
    }, [id, userId]);

    return (
        <div className="container" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            textAlign: 'center',
            overflow: 'hidden'
        }}>

            {!showScore ? (
                <>
                    <h2 className="glow-text">CLOSING GATE...</h2>
                    <div className="portal-container">
                        <div className="portal"></div>
                    </div>
                </>
            ) : (
                <div style={{ animation: 'fadeIn 1s ease' }}>
                    <h1 style={{ color: '#4caf50', textShadow: '0 0 20px #4caf50', fontSize: '3rem' }}>
                        MONSTER DEFEATED
                    </h1>
                    <p style={{ fontSize: '1.5rem', marginTop: '20px' }}>
                        +50 POINTS
                    </p>
                    <div style={{ marginTop: '40px' }}>
                        <button onClick={() => navigate('/map')} className="btn-primary">
                            RETURN TO MAP
                        </button>
                        <br /><br />
                        <button onClick={() => navigate('/profile')} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
                            VIEW PROFILE
                        </button>
                    </div>
                </div>
            )}

            <style>{`
        .portal-container {
          position: relative;
          width: 300px;
          height: 300px;
          margin-top: 20px;
        }
        .portal {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(circle, #000 20%, #ff0033 80%);
          box-shadow: 0 0 50px #ff0033, inset 0 0 50px #000;
          animation: closePortal 3s forwards;
        }
        @keyframes closePortal {
          0% { transform: scale(1); opacity: 1; filter: brightness(1.5); }
          50% { transform: scale(0.5) rotate(180deg); opacity: 0.8; }
          100% { transform: scale(0); opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
