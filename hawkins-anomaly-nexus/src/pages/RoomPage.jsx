import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { subscribeToMessages, sendMessageToFirestore } from '../services/firestoreService';
import { useAuth } from '../context/AuthContext';

export default function RoomPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userId } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const chatEndRef = useRef(null);

    useEffect(() => {
        const unsubscribe = subscribeToMessages(id, (data) => {
            setMessages(data);
        });
        return () => unsubscribe();
    }, [id]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await sendMessageToFirestore(id, {
                text: newMessage,
                senderId: userId,
                senderName: `AGENT_${userId?.substring(0, 4).toUpperCase()}`,
                timestamp: Date.now()
            });

            // Step 7: +5 points for participating in room
            const { incrementUserPoints } = await import('../services/firestoreService');
            await incrementUserPoints(userId, 5);

            setNewMessage('');
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="container animate-fade" style={{
            '--color-primary': 'var(--theme-gov-primary)',
            '--color-secondary': 'var(--theme-gov-secondary)',
            '--color-accent': 'var(--theme-gov-accent)',
            '--color-bg-dark': 'var(--theme-gov-bg)', // Use the gradient
            background: 'var(--theme-gov-bg)',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            padding: '1rem',
            color: 'white'
        }}>
            <div className="bg-grid" style={{ opacity: 0.1 }}></div>
            <div className="bg-scanlines"></div>

            {/* Tactical Header */}
            <div className="hud-border" style={{ padding: '1rem', marginBottom: '1rem', background: 'rgba(15, 23, 42, 0.8)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h2 className="mono" style={{ fontSize: '0.9rem', color: 'var(--color-primary)', margin: 0 }}>
                        SECURE_CHANNEL::{id.substring(0, 8).toUpperCase()}
                    </h2>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={() => navigate(`/resolve/${id}`)} className="mono" style={{ background: 'var(--color-danger)', border: 'none', color: 'white', fontSize: '0.6rem', cursor: 'pointer', padding: '0.2rem 0.5rem', borderRadius: '2px' }}>
                            [ RESOLVE_PROTOCOL ]
                        </button>
                        <button onClick={() => navigate('/map')} className="mono" style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.6rem', cursor: 'pointer' }}>
                            [ RETURN_TO_MAP ]
                        </button>
                    </div>
                </div>
                <div className="mono" style={{ fontSize: '0.6rem', display: 'flex', gap: '1rem', color: '#64748b' }}>
                    <span>NODE: HAWKINS_CENTRAL</span>
                    <span>ENCRYPTION: AES-256</span>
                    <span className="blink" style={{ color: 'var(--color-accent)' }}>● LIVE_FEED</span>
                </div>
            </div>

            {/* Message Stream */}
            <div className="hud-border" style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1.5rem',
                marginBottom: '1rem',
                background: 'rgba(2, 4, 8, 0.6)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
            }}>
                {messages.map((msg, i) => (
                    <div key={i} style={{
                        alignSelf: msg.senderId === userId ? 'flex-end' : 'flex-start',
                        maxWidth: '85%'
                    }}>
                        <div className="mono" style={{
                            fontSize: '0.55rem',
                            color: '#94a3b8',
                            marginBottom: '2px',
                            textAlign: msg.senderId === userId ? 'right' : 'left'
                        }}>
                            [{new Date(msg.timestamp).toLocaleTimeString()}] {msg.senderName}
                        </div>
                        <div style={{
                            background: msg.senderId === userId ? 'rgba(30, 58, 138, 0.3)' : 'rgba(30, 41, 59, 0.4)',
                            border: `1px solid ${msg.senderId === userId ? 'var(--color-primary)' : 'var(--color-border)'}`,
                            padding: '0.75rem',
                            color: 'white',
                            fontSize: '0.9rem',
                            borderTopRightRadius: msg.senderId === userId ? '0' : '8px',
                            borderTopLeftRadius: msg.senderId === userId ? '8px' : '0',
                            borderBottomRightRadius: '8px',
                            borderBottomLeftRadius: '8px',
                            boxShadow: msg.senderId === userId ? '0 0 10px rgba(30, 64, 175, 0.2)' : 'none'
                        }}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef}></div>
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} style={{ display: 'flex', gap: '1rem' }}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Enter command or message..."
                    style={{
                        flex: 1,
                        background: 'rgba(15, 23, 42, 0.8)',
                        border: '1px solid var(--color-border)',
                        padding: '1rem',
                        color: 'white',
                        fontFamily: 'monospace',
                        outline: 'none'
                    }}
                />
                <button type="submit" className="btn-primary" style={{
                    background: 'var(--color-primary)',
                    color: 'white',
                    border: 'none',
                    padding: '0 2rem'
                }}>
                    SEND
                </button>
            </form>

            <style>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: var(--color-border); }
        ::-webkit-scrollbar-thumb:hover { background: var(--color-primary); }
      `}</style>
        </div>
    );
}
