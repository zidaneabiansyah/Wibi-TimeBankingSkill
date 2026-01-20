import { useEffect, useRef, useState } from 'react';

interface WebRTCMessage {
    type: 'offer' | 'answer' | 'candidate' | 'user_join' | 'user_leave';
    payload: any;
    user_id: number;
    user_name: string;
}

interface UseWebRTCProps {
    sessionId: number;
    userId: number;
    enabled?: boolean;
}

// Module-level map to track active sessions (prevents React Strict Mode double init)
const activeSessions = new Map<string, boolean>();

export function useWebRTC({ sessionId, userId, enabled = true }: UseWebRTCProps) {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [isJoined, setIsJoined] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const pcRef = useRef<RTCPeerConnection | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const cleanupCalledRef = useRef(false);
    const iceCandidateQueueRef = useRef<RTCIceCandidateInit[]>([]);
    const remoteUserIdRef = useRef<number | null>(null);
    const makingOfferRef = useRef(false);

    const configuration: RTCConfiguration = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
        ],
    };

    // Sync localStreamRef
    useEffect(() => {
        localStreamRef.current = localStream;
    }, [localStream]);

    useEffect(() => {
        if (!enabled || !sessionId || !userId || userId === 0) return;

        // Module-level guard for React Strict Mode
        const sessionKey = `${sessionId}-${userId}`;
        if (activeSessions.get(sessionKey)) {
            console.log('⚠️ Session already active, skipping');
            return;
        }
        activeSessions.set(sessionKey, true);
        cleanupCalledRef.current = false;

        let stream: MediaStream | null = null;
        let ws: WebSocket | null = null;
        let pc: RTCPeerConnection | null = null;

        const cleanup = () => {
            if (cleanupCalledRef.current) return;
            cleanupCalledRef.current = true;
            activeSessions.delete(sessionKey);
            
            console.log('🧹 Cleanup WebRTC');
            pc?.close();
            ws?.close();
            stream?.getTracks().forEach(t => t.stop());
            
            pcRef.current = null;
            wsRef.current = null;
            iceCandidateQueueRef.current = [];
            remoteUserIdRef.current = null;
            makingOfferRef.current = false;
        };

        const sendSignal = (type: string, payload: any) => {
            if (ws?.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type, payload, session_id: sessionId }));
            }
        };

        const createPC = (): RTCPeerConnection => {
            const newPc = new RTCPeerConnection(configuration);

            newPc.onicecandidate = (e) => {
                if (e.candidate) sendSignal('candidate', e.candidate);
            };

            newPc.ontrack = (e) => {
                console.log('📹 Got remote track:', e.track.kind);
                if (!cleanupCalledRef.current && e.streams[0]) {
                    setRemoteStream(e.streams[0]);
                }
            };

            newPc.oniceconnectionstatechange = () => {
                console.log('🔗 ICE:', newPc.iceConnectionState);
                if (newPc.iceConnectionState === 'failed' || newPc.iceConnectionState === 'disconnected') {
                    setRemoteStream(null);
                }
            };

            return newPc;
        };

        const addTracks = () => {
            if (localStreamRef.current && pc) {
                const senders = pc.getSenders();
                localStreamRef.current.getTracks().forEach(track => {
                    if (!senders.some(s => s.track === track)) {
                        console.log('➕ Add track:', track.kind);
                        pc!.addTrack(track, localStreamRef.current!);
                    }
                });
            }
        };

        const processQueue = async () => {
            if (!pc || !pc.remoteDescription) return;
            const queue = [...iceCandidateQueueRef.current];
            iceCandidateQueueRef.current = [];
            for (const c of queue) {
                try { await pc.addIceCandidate(new RTCIceCandidate(c)); } catch {}
            }
        };

        const handleOffer = async (offer: RTCSessionDescriptionInit, fromId: number) => {
            if (!pc || cleanupCalledRef.current) return;
            
            console.log('📥 Offer from:', fromId, 'My ID:', userId);
            remoteUserIdRef.current = fromId;

            // Simple polite peer: lower ID is polite
            const isPolite = userId < fromId;
            const hasCollision = makingOfferRef.current || pc.signalingState !== 'stable';

            if (hasCollision && !isPolite) {
                console.log('🚫 Ignoring offer (collision, impolite)');
                return;
            }

            try {
                if (hasCollision && isPolite) {
                    console.log('🔙 Rollback (collision, polite)');
                    await pc.setLocalDescription({ type: 'rollback' });
                }

                addTracks();
                await pc.setRemoteDescription(new RTCSessionDescription(offer));
                await processQueue();

                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                sendSignal('answer', answer);
                console.log('📤 Sent answer');
            } catch (err) {
                console.error('Offer error:', err);
            }
        };

        const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
            if (!pc || cleanupCalledRef.current) return;
            
            console.log('📥 Answer, state:', pc.signalingState);
            
            if (pc.signalingState !== 'have-local-offer') {
                console.log('⚠️ Ignoring answer (wrong state)');
                return;
            }

            try {
                await pc.setRemoteDescription(new RTCSessionDescription(answer));
                await processQueue();
                console.log('✅ Answer applied');
            } catch (err) {
                console.error('Answer error:', err);
            }
        };

        const handleCandidate = async (candidate: RTCIceCandidateInit) => {
            if (!pc || cleanupCalledRef.current) return;
            
            if (!pc.remoteDescription) {
                iceCandidateQueueRef.current.push(candidate);
                return;
            }
            
            try { await pc.addIceCandidate(new RTCIceCandidate(candidate)); } catch {}
        };

        const initiateCall = async (remoteId: number) => {
            if (!pc || cleanupCalledRef.current) return;
            
            console.log('📞 User join:', remoteId, 'My ID:', userId);
            
            // Ignore if it's ourselves (shouldn't happen with backend fix)
            if (remoteId === userId) {
                console.log('⚠️ Ignoring self');
                return;
            }
            
            remoteUserIdRef.current = remoteId;

            // Only higher ID sends offer
            if (userId <= remoteId) {
                console.log('⏳ Waiting for offer');
                return;
            }

            if (pc.signalingState !== 'stable') {
                console.log('⚠️ Not stable');
                return;
            }

            try {
                makingOfferRef.current = true;
                addTracks();
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                sendSignal('offer', offer);
                console.log('📤 Sent offer');
            } catch (err) {
                console.error('Offer creation error:', err);
            } finally {
                makingOfferRef.current = false;
            }
        };

        const start = async () => {
            // Get media
            for (const c of [{ video: true, audio: true }, { video: true, audio: false }, { video: false, audio: true }]) {
                try {
                    stream = await navigator.mediaDevices.getUserMedia(c);
                    if (stream) {
                        console.log('🎥 Got media');
                        localStreamRef.current = stream;
                        setLocalStream(stream);
                        setError(null);
                        break;
                    }
                } catch {}
            }

            if (!stream) setError('No camera/mic access');

            // Create PC
            pc = createPC();
            pcRef.current = pc;

            // Connect WS
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Not authenticated');
                return;
            }

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
            const wsUrl = apiUrl.replace(/^http/, 'ws') + `/ws/video/${sessionId}?token=${encodeURIComponent(token)}`;
            
            console.log('🔌 Connecting:', wsUrl.split('?')[0]);
            ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('✅ WS connected');
                if (!cleanupCalledRef.current) setIsJoined(true);
            };

            ws.onerror = () => {
                console.error('❌ WS error');
                if (!cleanupCalledRef.current) setError('Connection failed');
            };

            ws.onclose = () => {
                console.log('⚠️ WS closed');
                if (!cleanupCalledRef.current) setIsJoined(false);
            };

            ws.onmessage = async (e) => {
                if (cleanupCalledRef.current) return;
                
                try {
                    const msg: WebRTCMessage = JSON.parse(e.data);
                    console.log('📨', msg.type, 'from:', msg.user_id);
                    
                    switch (msg.type) {
                        case 'user_join':
                            await initiateCall(msg.user_id);
                            break;
                        case 'offer':
                            await handleOffer(msg.payload, msg.user_id);
                            break;
                        case 'answer':
                            await handleAnswer(msg.payload);
                            break;
                        case 'candidate':
                            await handleCandidate(msg.payload);
                            break;
                        case 'user_leave':
                            console.log('👋 User left');
                            setRemoteStream(null);
                            remoteUserIdRef.current = null;
                            iceCandidateQueueRef.current = [];
                            if (pc) {
                                pc.close();
                                pc = createPC();
                                pcRef.current = pc;
                            }
                            break;
                    }
                } catch (err) {
                    console.error('Message error:', err);
                }
            };
        };

        start();
        return cleanup;
    }, [enabled, sessionId, userId]);

    return { localStream, remoteStream, isJoined, error };
}
