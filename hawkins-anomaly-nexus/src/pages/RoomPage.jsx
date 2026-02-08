import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { subscribeToMessages, sendMessageToFirestore } from '../services/firestoreService';
import { useAuth } from '../context/AuthContext';
import Scene3D from '../components/Scene3D';

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
        <>
            <Scene3D variant="gov" />
            <div className="container animate-fade" style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '2rem' }}>

                {/* Header */}
                <div className="glass-panel" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem' }}>
                    <div>
                        <h2 style={{ color: 'var(--theme-gov)', fontSize: '1rem' }}>GOV.SECURE_CHANNEL</h2>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>ID: {id.substring(0, 8).toUpperCase()}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={() => navigate(`/resolve/${id}`)} className="btn-3d" style={{ borderColor: '#ef4444', color: '#ef4444' }}>
                            RESOLVE PROTOCOL
                        </button>
                        <button onClick={() => navigate('/map')} className="btn-3d">
                            RETURN TO MAP
                        </button>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="glass-panel" style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(30, 41, 59, 0.4)' }}>
                    {messages.map((msg, i) => (
                        <div key={i} style={{
                            alignSelf: msg.senderId === userId ? 'flex-end' : 'flex-start',
                            maxWidth: '70%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: msg.senderId === userId ? 'flex-end' : 'flex-start'
                        }}>
                            <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '4px' }}>{msg.senderName}</div>
                            <div style={{
                                padding: '1rem',
                                borderRadius: '12px',
                                background: msg.senderId === userId ? 'var(--theme-gov)' : 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                borderBottomRightRadius: msg.senderId === userId ? '2px' : '12px',
                                borderBottomLeftRadius: msg.senderId === userId ? '12px' : '2px'
                            }}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} className="glass-panel" style={{ display: 'flex', gap: '1rem', padding: '1rem' }}>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Enter secure message..."
                        style={{
                            flex: 1,
                            background: 'rgba(0, 0, 0, 0.2)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            padding: '1rem',
                            color: 'white',
                            fontFamily: 'monospace',
                            outline: 'none'
                        }}
                    />
                    <button type="submit" className="btn-primary" style={{
                        background: 'var(--theme-gov)',
                        color: 'white',
                        border: 'none',
                        padding: '0 2rem'
                    }}>
                        SEND
                    </button>
                </form>

                <style>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: var(--glass-border); }
        ::-webkit-scrollbar-thumb:hover { background: var(--theme-gov); }
      `}</style>
            </div>
        </>
    );
}
