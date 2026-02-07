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
            senderName: userId ? `Agent ${userId.substring(0, 4)}` : 'Guest'
        });
        setNewMessage('');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '400px', background: '#0f172a', borderRadius: '8px', border: '1px solid #334155' }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid #334155', background: '#1e293b', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>
                <div style={{ fontWeight: 'bold', color: '#38bdf8' }}>#{skill.replace(/\s+/g, '-').toLowerCase()}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Geek Room - Collaborative Comms</div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {messages.map((msg) => {
                    const isMe = msg.userId === userId;
                    return (
                        <div key={msg.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                            <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '2px', textAlign: isMe ? 'right' : 'left' }}>
                                {msg.senderName}
                            </div>
                            <div style={{
                                padding: '0.75rem',
                                borderRadius: '8px',
                                background: isMe ? '#38bdf8' : '#334155',
                                color: isMe ? '#0f172a' : '#e2e8f0',
                                borderBottomRightRadius: isMe ? '0' : '8px',
                                borderBottomLeftRadius: isMe ? '8px' : '0'
                            }}>
                                {msg.text}
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef}></div>
            </div>

            <form onSubmit={handleSend} style={{ padding: '1rem', borderTop: '1px solid #334155', display: 'flex', gap: '0.5rem' }}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Message #${skill}...`}
                    style={{
                        flex: 1,
                        padding: '0.75rem',
                        background: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: '4px',
                        color: 'white',
                        outline: 'none'
                    }}
                />
                <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    style={{
                        padding: '0 1.5rem',
                        background: newMessage.trim() ? '#38bdf8' : '#334155',
                        color: newMessage.trim() ? '#0f172a' : '#94a3b8',
                        border: 'none',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        cursor: newMessage.trim() ? 'pointer' : 'default'
                    }}
                >
                    SEND
                </button>
            </form>
        </div>
    );
}
