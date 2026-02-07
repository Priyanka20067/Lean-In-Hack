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

        await sendMessageToFirestore(id, {
            text: newMessage,
            senderId: userId,
            senderName: `AGENT_${userId?.substring(0, 4).toUpperCase()}`,
            timestamp: Date.now()
        });

        setNewMessage('');
    };

    return (
        <div className="container animate-fade" style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '1rem' }}>
            <div className="bg-grid" style={{ opacity: 0.1 }}></div>
            <div className="bg-scanlines"></div>

            {/* Tactical Header */}
            <div className="hud-border" style={{ padding: '1rem', marginBottom: '1rem', background: 'rgba(10, 17, 40, 0.8)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h2 className="mono" style={{ fontSize: '0.9rem', color: 'var(--color-primary)', margin: 0 }}>
                        ENCRYPTED_CHANNEL::{id.substring(0, 8).toUpperCase()}
                    </h2>
                    <button onClick={() => navigate('/map')} className="mono" style={{ background: 'none', border: 'none', color: 'var(--color-text-dim)', fontSize: '0.6rem', cursor: 'pointer' }}>
                        [ RETURN_TO_MAP ]
                    </button>
                </div>
                <div className="mono" style={{ fontSize: '0.6rem', display: 'flex', gap: '1rem', color: 'var(--color-secondary)' }}>
                    <span>NODE: HAWKINS_CENTRAL</span>
                    <span>SECURITY: LEVEL_4_ENCRYPTION</span>
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
                            color: 'var(--color-text-dim)',
                            marginBottom: '2px',
                            textAlign: msg.senderId === userId ? 'right' : 'left'
                        }}>
                            [{new Date(msg.timestamp).toLocaleTimeString()}] {msg.senderName}
                        </div>
                        <div style={{
                            background: msg.senderId === userId ? 'rgba(0, 242, 255, 0.1)' : 'rgba(30, 41, 59, 0.4)',
                            border: `1px solid ${msg.senderId === userId ? 'var(--color-primary)' : 'var(--color-border)'}`,
                            padding: '0.8rem 1rem',
                            color: 'var(--color-text)',
                            fontSize: '0.85rem',
                            position: 'relative',
                            borderRadius: '2px'
                        }}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>

            {/* Input Module */}
            <form onSubmit={handleSend} className="hud-border" style={{
                background: 'rgba(10, 17, 40, 0.9)',
                padding: '1rem',
                display: 'flex',
                gap: '1rem',
                alignItems: 'center'
            }}>
                <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--color-primary)', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                    INTEL_FEED
                </div>
                <input
                    type="text"
                    className="mono"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="ENTER_ENCRYPTED_MESSAGE..."
                    style={{
                        flex: 1,
                        background: 'rgba(0,0,0,0.5)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text)',
                        padding: '0.75rem',
                        outline: 'none',
                        fontSize: '0.8rem'
                    }}
                />
                <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1rem' }}>
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
