import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { subscribeToGeekRoom, sendMessageToGeekRoom } from '../services/jobService';

export default function GeekRoomChat({ skill }) {
    const { userId } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const bottomRef = useRef(null);

    useEffect(() => {
        if (!skill) return;

        const unsubscribe = subscribeToGeekRoom(skill, (data) => {
            setMessages(data);
        });

        return () => unsubscribe();
    }, [skill]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        await sendMessageToGeekRoom(skill, {
            text: newMessage,
            userId: userId || 'Anonymous',
            senderName: userId ? `Agent ${userId.substring(0, 4).toUpperCase()}` : 'Guest'
        });
        setNewMessage('');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '500px', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(30, 41, 59, 0.4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ fontWeight: 'bold', color: 'var(--theme-job)', fontSize: '0.9rem', letterSpacing: '1px' }}>#{skill.replace(/\s+/g, '-').toLowerCase()}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>SECURE_COMMS_CHANNEL_ACTIVE</div>
                </div>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--theme-job)', boxShadow: '0 0 10px var(--theme-job)' }}></div>
            </div>

            {/* Messages Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {messages.length === 0 && (
                    <div style={{ textAlign: 'center', color: '#475569', marginTop: '2rem', fontSize: '0.8rem' }}>
                        INITIALIZING_CONNECTION... NO_TRAFFIC_DETECTED
                    </div>
                )}
                {messages.map((msg) => {
                    const isMe = msg.userId === userId;
                    return (
                        <div key={msg.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                            <div style={{ fontSize: '0.65rem', color: '#64748b', marginBottom: '4px', textAlign: isMe ? 'right' : 'left', fontFamily: 'monospace' }}>
                                {msg.senderName}
                            </div>
                            <div style={{
                                padding: '0.9rem 1.25rem',
                                borderRadius: '12px',
                                background: isMe ? 'var(--theme-job)' : 'rgba(255, 255, 255, 0.05)',
                                color: isMe ? 'white' : '#cbd5e1',
                                border: isMe ? 'none' : '1px solid rgba(255, 255, 255, 0.03)',
                                borderBottomRightRadius: isMe ? '2px' : '12px',
                                borderBottomLeftRadius: isMe ? '12px' : '2px',
                                fontSize: '0.9rem',
                                lineHeight: '1.5',
                                boxShadow: isMe ? '0 4px 12px rgba(139, 92, 246, 0.2)' : 'none'
                            }}>
                                {msg.text}
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef}></div>
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} style={{ padding: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '0.75rem', background: 'rgba(0,0,0,0.2)' }}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Transmit to #${skill}...`}
                    style={{
                        flex: 1,
                        padding: '0.8rem 1.25rem',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        outline: 'none',
                        fontSize: '0.9rem',
                        fontFamily: 'monospace'
                    }}
                    autoComplete="off"
                />
                <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    style={{
                        padding: '0 1.5rem',
                        background: newMessage.trim() ? 'var(--theme-job)' : 'rgba(255, 255, 255, 0.05)',
                        color: newMessage.trim() ? 'white' : '#475569',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s',
                        fontSize: '0.8rem',
                        letterSpacing: '1px'
                    }}
                >
                    UP_SYNC
                </button>
            </form>
            <style>{`
                ::-webkit-scrollbar { width: 4px; }
                ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 2px; }
                ::-webkit-scrollbar-thumb:hover { background: var(--theme-job); }
            `}</style>
        </div>
    );
}
