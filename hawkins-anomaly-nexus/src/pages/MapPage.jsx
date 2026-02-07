import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { subscribeToAnomalies } from '../services/firestoreService';

export default function MapPage() {
  const [anomalies, setAnomalies] = useState([]);
  const [scanStatus, setScanStatus] = useState('ACTIVE');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = subscribeToAnomalies((data) => {
      const mappedData = data.map(a => ({
        ...a,
        x: a.coordinates?.x || (20 + Math.random() * 60),
        y: a.coordinates?.y || (20 + Math.random() * 60)
      }));
      setAnomalies(mappedData);
    });

    return () => unsubscribe();
  }, []);

  const getSignatureData = (type) => {
    const t = (type || 'Unknown').toLowerCase();
    if (t.includes('paranormal')) return { color: 'var(--color-accent)', label: 'THERMAL_ANOMALY', icon: '◈' };
    if (t.includes('health')) return { color: 'var(--color-danger)', label: 'BIO_TRACE', icon: '✚' };
    if (t.includes('gov')) return { color: 'var(--color-primary)', label: 'SEC_BREACH', icon: '⚡' };
    if (t.includes('employment') || t.includes('job') || t.includes('career')) return { color: 'var(--color-secondary)', label: 'SESS_DATA', icon: '⚙' };
    return { color: '#ffffff', label: 'UNIDENTIFIED', icon: '?' };
  };

  return (
    <div className="map-view-ah">
      <div className="bg-grid" style={{ opacity: 0.2 }}></div>
      <div className="bg-scanlines"></div>

      {/* Night Vision Tint Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0, 255, 127, 0.05)',
        pointerEvents: 'none',
        zIndex: 5
      }}></div>

      {/* HUD Header */}
      <header className="map-hud top-hud">
        <div className="hud-group">
          <div className="hud-label mono">SCAN_FREQ</div>
          <div className="hud-value mono color-secondary">42.5 GHz</div>
        </div>
        <div className="hud-center">
          <h2 className="mono glitch" data-text="TACTICAL OPERATIONAL MAP">TACTICAL OPERATIONAL MAP</h2>
          <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--color-text-dim)' }}>
            NEXUS_COORD: 40.0483° N, 86.5135° W
          </div>
        </div>
        <div className="hud-group" style={{ textAlign: 'right' }}>
          <div className="hud-label mono">SIG_COUNT</div>
          <div className="hud-value mono color-accent">{anomalies.length}</div>
        </div>
      </header>

      {/* Main Tactical Table */}
      <div className="tactical-grid">
        {/* Topographic Wireframe Overlay */}
        <svg viewBox="0 0 1000 1000" style={{ position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none' }}>
          <path d="M0,200 Q250,150 500,200 T1000,200 M0,400 Q250,350 500,400 T1000,400 M0,600 Q250,550 500,600 T1000,600 M0,800 Q250,750 500,800 T1000,800" fill="none" stroke="var(--color-secondary)" strokeWidth="1" />
          <path d="M200,0 Q150,250 200,500 T200,1000 M400,0 Q350,250 400,500 T400,1000 M600,0 Q550,250 600,500 T600,1000 M800,0 Q750,250 800,500 T800,1000" fill="none" stroke="var(--color-secondary)" strokeWidth="1" />
        </svg>

        {/* Radar Sweep Effect */}
        <div className="radar-sweep-ah"></div>

        {/* Target Recticle Decorations */}
        <div className="reticle top-left"></div>
        <div className="reticle top-right"></div>
        <div className="reticle bottom-left"></div>
        <div className="reticle bottom-right"></div>

        {/* Anomaly Signatures */}
        {anomalies.map(a => {
          const sig = getSignatureData(a.type);
          return (
            <div
              key={a.id}
              className="sig-point"
              onClick={() => navigate(`/room/${a.id}`)}
              style={{ left: `${a.x}%`, top: `${a.y}%`, '--sig-color': a.color || sig.color }}
            >
              <div className="sig-target">
                <div className="sig-glyph">{sig.icon}</div>
              </div>
              <div className="sig-info mono">
                <div style={{ color: a.color || sig.color, fontWeight: 'bold' }}>{sig.label} [{a.type?.toUpperCase() || 'UNK'}]</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--color-text)', marginTop: '2px', borderBottom: '1px solid #333', paddingBottom: '2px' }}>
                  {a.description?.substring(0, 30)}...
                </div>
                <div style={{ fontSize: '0.6rem', color: 'var(--color-secondary)', marginTop: '2px' }}>LOC: {a.locationName?.toUpperCase() || 'UNKNOWN'}</div>
                <div style={{ fontSize: '0.5rem', color: '#888', marginTop: '2px' }}>HASH_{a.id.substring(0, 6).toUpperCase()}</div>
              </div>
              {/* Thermal Bloom Effect */}
              <div className="sig-bloom"></div>
            </div>
          )
        })}
      </div>

      {/* Navigation Footer HUD */}
      <footer className="map-hud bottom-hud">
        <button className="hud-btn-ah mono" onClick={() => navigate('/dashboard')}>DATABASE_INTEL</button>
        <button className="hud-btn-ah main-btn mono" onClick={() => navigate('/report')}>LOG_NEW_SIGNATURE</button>
        <button className="hud-btn-ah mono" onClick={() => navigate('/profile')}>AGENT_CREDENTIALS</button>
      </footer>

      <style>{`
        .map-view-ah {
          position: relative;
          width: 100vw;
          height: 100vh;
          background: var(--color-bg-dark);
          overflow: hidden;
          font-family: 'JetBrains Mono', monospace;
        }
        .map-hud {
          position: absolute;
          left: 0;
          right: 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          background: rgba(2, 4, 8, 0.9);
          border-bottom: 1px solid var(--color-border);
          z-index: 100;
        }
        .bottom-hud {
          top: auto;
          bottom: 0;
          border-bottom: none;
          border-top: 1px solid var(--color-border);
          justify-content: center;
          gap: 2rem;
        }
        .hud-label { font-size: 0.5rem; color: var(--color-text-dim); }
        .hud-value { font-size: 0.9rem; font-weight: bold; }
        .hud-center { text-align: center; }
        .hud-center h2 { font-size: 1rem; margin-bottom: 2px; }
        
        .color-secondary { color: var(--color-secondary); }
        .color-accent { color: var(--color-accent); }

        .tactical-grid {
          position: absolute;
          inset: 80px 0;
          z-index: 10;
        }

        .radar-sweep-ah {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 200vmax;
          height: 200vmax;
          background: conic-gradient(from 0deg, transparent 0deg, rgba(0, 242, 255, 0.03) 10deg, transparent 20deg);
          transform: translate(-50%, -50%);
          animation: sweep-ah 6s linear infinite;
          pointer-events: none;
        }
        @keyframes sweep-ah {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .sig-point {
          position: absolute;
          width: 30px;
          height: 30px;
          transform: translate(-50%, -50%);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sig-target {
          width: 20px;
          height: 20px;
          border: 1px solid var(--sig-color);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--sig-color);
          font-size: 0.8rem;
          background: rgba(0,0,0,0.5);
          z-index: 2;
        }
        .sig-info {
          position: absolute;
          left: 35px;
          background: rgba(0,0,0,0.8);
          border: 1px solid var(--color-border);
          padding: 4px 8px;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s;
          font-size: 0.6rem;
        }
        .sig-point:hover .sig-info { opacity: 1; z-index: 50; }
        
        .sig-bloom {
          position: absolute;
          inset: -10px;
          background: radial-gradient(circle, var(--sig-color) 0%, transparent 70%);
          opacity: 0.2;
          animation: bloom-anim 2s infinite ease-in-out;
          pointer-events: none;
        }
        @keyframes bloom-anim {
          0%, 100% { transform: scale(0.8); opacity: 0.1; }
          50% { transform: scale(1.2); opacity: 0.3; }
        }

        /* Reticles */
        .reticle {
          position: absolute;
          width: 40px;
          height: 40px;
          border: 1px solid var(--color-border);
          opacity: 0.5;
        }
        .top-left { top: 20px; left: 20px; border-right: none; border-bottom: none; }
        .top-right { top: 20px; right: 20px; border-left: none; border-bottom: none; }
        .bottom-left { bottom: 20px; left: 20px; border-right: none; border-top: none; }
        .bottom-right { bottom: 20px; right: 20px; border-left: none; border-top: none; }

        .hud-btn-ah {
          background: none;
          border: none;
          color: var(--color-text-dim);
          cursor: pointer;
          font-size: 0.7rem;
          transition: color 0.2s;
        }
        .hud-btn-ah:hover { color: var(--color-primary); }
        .main-btn {
          background: var(--color-primary);
          color: var(--color-bg-dark);
          padding: 8px 16px;
          font-weight: bold;
          box-shadow: var(--glow-primary);
        }
        .main-btn:hover {
          box-shadow: 0 0 15px var(--color-primary);
        }
      `}</style>
    </div>
  );
}
