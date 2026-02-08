import React from 'react';

/**
 * Scene3D component providing a consistent background for the virtualization theme.
 * Transitioned from animated 3D scene to a static, high-performance professional gradient.
 */
export default function Scene3D({ variant = 'default' }) {
    // Theme Gradient Mapping
    const gradients = {
        default: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)',
        gov: 'radial-gradient(circle at 50% 50%, #1e3a8a 0%, #0f172a 100%)',    // Deep Blue
        job: 'radial-gradient(circle at 50% 50%, #4c1d95 0%, #0f172a 100%)',    // Deep Purple
        health: 'radial-gradient(circle at 50% 50%, #064e3b 0%, #0f172a 100%)'  // Deep Green
    };

    const background = gradients[variant] || gradients.default;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
            background: background,
            transition: 'background 0.5s ease'
        }}>
            {/* Subtle overlay for texture */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)',
                backgroundSize: '30px 30px',
                opacity: 0.3
            }}></div>
        </div>
    );
}
