import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { subscribeToAnomalies } from '../services/firestoreService';
import Scene3D from '../components/Scene3D';

export default function MapPage() {
  const [anomalies, setAnomalies] = useState([]);
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

  const getSignatureData = (a) => {
    const type = (a.type || '').toLowerCase();
    const color = (a.color || '').toLowerCase();
    const desc = (a.description || '').toLowerCase();

    // 1. Direct Color/Type Match
    if (color === '#3b82f6' || type.includes('gov') || type.includes('security'))
      return { color: '#3b82f6', label: 'GOV_SECURE', icon: '🛡️' };

    if (color === '#a855f7' || type.includes('job') || type.includes('career') || type.includes('skill'))
      return { color: '#a855f7', label: 'TECH_NODE', icon: '🚀' };

    if (color === '#10b981' || type.includes('health') || type.includes('bio') || type.includes('medical'))
      return { color: '#10b981', label: 'BIO_TRACE', icon: '🧬' };

    if (color === '#f472b6' || type.includes('paranormal') || type.includes('monster'))
      return { color: '#f472b6', label: 'DIM_SHIFT', icon: '◈' };

    // 2. Keyword Fallback (for older data or unidentified types)
    if (desc.includes('goverment') || desc.includes('military') || desc.includes('police'))
      return { color: '#3b82f6', label: 'GOV_SECURE', icon: '🛡️' };
    if (desc.includes('code') || desc.includes('react') || desc.includes('job') || desc.includes('work'))
      return { color: '#a855f7', label: 'TECH_NODE', icon: '🚀' };
    if (desc.includes('sick') || desc.includes('virus') || desc.includes('pain') || desc.includes('hospital'))
      return { color: '#10b981', label: 'BIO_TRACE', icon: '🧬' };

    return { color: '#ffffff', label: 'UNIDENTIFIED', icon: '?' };
  };

  return (
    <>
      <Scene3D variant="gov" />
      <div className="container animate-fade" style={{ height: '100vh', display: 'flex', flexDirection: 'column', padding: '1rem', overflow: 'hidden' }}>

        {/* HUD Overlay */}
        <header className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', marginBottom: '1rem', borderTop: '2px solid var(--theme-gov)' }}>
          <div>
            <div style={{ fontSize: '0.6rem', color: '#64748b', letterSpacing: '4px', fontWeight: 'bold' }}>TACTICAL_HUD_V04</div>
            <h2 style={{ fontSize: '1.2rem', color: 'white', margin: 0 }}>OPERATIONAL_MAP_STREAM</h2>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', color: 'var(--theme-gov)', fontWeight: 'bold' }}>SCAN_ACTIVE</div>
            <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginTop: '4px' }}>
              {[1, 2, 3, 4, 5].map(i => <div key={i} className="animate-pulse" style={{ width: '4px', height: '4px', background: 'var(--theme-gov)', borderRadius: '50%' }}></div>)}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.6rem', color: '#64748b' }}>ACTIVE_SIGNATURES</div>
            <div style={{ fontSize: '1.2rem', color: 'white', fontWeight: 'bold' }}>{anomalies.length}</div>
          </div>
        </header>

        {/* Main Content Area: Map + Sidebar */}
        <div style={{ flex: 1, display: 'flex', gap: '1rem', overflow: 'hidden', minHeight: 0 }}>

          {/* Map Grid */}
          <div className="glass-panel" style={{ flex: 2, position: 'relative', overflow: 'hidden', background: 'rgba(0,0,0,0.2)', padding: 0 }}>
            {/* Crosshair Overlay */}
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }}></div>
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }}></div>

            {anomalies.map(a => {
              const sig = getSignatureData(a);
              return (
                <div
                  key={a.id}
                  onClick={() => navigate(`/room/${a.id}`)}
                  style={{
                    position: 'absolute',
                    left: `${a.x}%`,
                    top: `${a.y}%`,
                    transform: 'translate(-50%, -50%)',
                    cursor: 'pointer',
                    zIndex: 10
                  }}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    border: `2px solid ${sig.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: sig.color,
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    background: 'rgba(0,0,0,0.5)',
                    boxShadow: `0 0 10px ${sig.color}`,
                    animation: 'pulse-map 2s infinite'
                  }}>
                    {sig.icon}
                  </div>

                  <div className="sig-label" style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginTop: '8px',
                    background: 'rgba(0,0,0,0.8)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: `1px solid ${sig.color}`,
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    opacity: 0,
                    transition: 'opacity 0.2s'
                  }}>
                    <div style={{ color: sig.color, fontSize: '0.6rem', fontWeight: 'bold' }}>{sig.label}</div>
                    <div style={{ color: 'white', fontSize: '0.5rem' }}>ID: {a.id.substring(0, 6)}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Telemetry History Sidebar */}
          <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(15, 23, 42, 0.4)', padding: '1.5rem', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '0.8rem', color: 'var(--theme-gov)', letterSpacing: '2px' }}>TELEMETRY_LOG</h3>
              <div style={{ fontSize: '0.6rem', color: '#475569' }}>REAL-TIME_FEED</div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[...anomalies].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)).map((a) => {
                const sig = getSignatureData(a);
                return (
                  <div
                    key={a.id}
                    onClick={() => navigate(`/room/${a.id}`)}
                    style={{
                      padding: '1rem',
                      background: 'rgba(255,255,255,0.02)',
                      borderRadius: '8px',
                      borderLeft: `3px solid ${sig.color}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.7rem', color: sig.color, fontWeight: 'bold' }}>{sig.label}</span>
                      <span style={{ fontSize: '0.6rem', color: '#475569' }}>{a.status?.toUpperCase()}</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'white', fontWeight: 'bold', marginBottom: '2px' }}>{a.locationName || 'UNKNOWN_SECTOR'}</div>
                    <div style={{ fontSize: '0.65rem', color: '#64748b', fontFamily: 'monospace' }}>
                      {a.timestamp ? new Date(a.timestamp).toLocaleTimeString() : 'TIME_UNKNOWN'} // {a.id.substring(0, 8)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <footer style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
          <button onClick={() => navigate('/dashboard')} className="btn-3d" style={{ flex: 1 }}>DATABASE_INTEL</button>
          <button onClick={() => navigate('/report')} className="btn-3d" style={{ flex: 1, background: 'var(--theme-gov)', borderColor: 'var(--theme-gov)' }}>LOG_NEW_SIGNATURE</button>
          <button onClick={() => navigate('/profile')} className="btn-3d" style={{ flex: 1 }}>OPERATIVE_CREDENTIALS</button>
        </footer>

        <style>{`
            .sig-label { opacity: 0; }
            div:hover > .sig-label { opacity: 1 !important; }
            @keyframes pulse-map {
                0% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
                50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
            }
        `}</style>
      </div>
    </>
  );
}
