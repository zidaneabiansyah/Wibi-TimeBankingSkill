import { useEffect, useRef, useState, useCallback } from 'react';

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

export function useWebRTC({ sessionId, userId, enabled = true }: UseWebRTCProps) {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [isJoined, setIsJoined] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const pcRef = useRef<RTCPeerConnection | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const mountedRef = useRef(true);
    
    // Perfect negotiation pattern refs
    const politeRef = useRef(false); // Will be set based on user IDs
    const makingOfferRef = useRef(false);
    const ignoreOfferRef = useRef(false);

    const config: RTCConfiguration = {
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    };

    useEffect(() => {
        mountedRef.current = true;
        
        if (!enabled || !sessionId || !userId) {
            return;
        }

        let pc: RTCPeerConnection | null = null;
        let ws: WebSocket | null = null;
        let stream: MediaStream | null = null;

        const log = (msg: string, ...args: any[]) => {
            console.log(`[WebRTC ${userId}]`, msg, ...args);
        };

        const send = (type: string, payload?: any) => {
            if (ws?.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type, payload, session_id: sessionId }));
            }
        };

        const init = async () => {
            // 1. Get media stream
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            } catch {
                try {
                    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                } catch {
                    try {
                        stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
                    } catch (e) {
                        log('❌ No media access');
                    }
                }
            }

            if (stream && mountedRef.current) {
                log('🎥 Got media stream');
                streamRef.current = stream;
                setLocalStream(stream);
            }

            // 2. Create peer connection
            pc = new RTCPeerConnection(config);
            pcRef.current = pc;

            // Add local tracks
            if (stream) {
                stream.getTracks().forEach(track => {
                    log('➕ Adding local track:', track.kind);
                    pc!.addTrack(track, stream!);
                });
            }

            // Remote track handler
            pc.ontrack = (event) => {
                log('📹 Remote track received:', event.track.kind);
                if (mountedRef.current && event.streams[0]) {
                    log('✅ Setting remote stream');
                    setRemoteStream(event.streams[0]);
                }
            };

            // ICE candidate handler
            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    log('🧊 Sending ICE candidate');
                    send('candidate', event.candidate);
                }
            };

            pc.oniceconnectionstatechange = () => {
                log('🔗 ICE state:', pc?.iceConnectionState);
            };

            pc.onconnectionstatechange = () => {
                log('📡 Connection state:', pc?.connectionState);
            };

            // Perfect negotiation: negotiation needed handler
            pc.onnegotiationneeded = async () => {
                log('🔄 Negotiation needed, polite:', politeRef.current);
                try {
                    makingOfferRef.current = true;
                    await pc!.setLocalDescription();
                    log('📤 Sending offer');
                    send('offer', pc!.localDescription);
                } catch (err) {
                    log('❌ Offer error:', err);
                } finally {
                    makingOfferRef.current = false;
                }
            };

            // 3. Connect WebSocket
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Not authenticated');
                return;
            }

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
            const wsUrl = apiUrl.replace(/^http/, 'ws') + `/ws/video/${sessionId}?token=${encodeURIComponent(token)}`;

            log('🔌 Connecting to WebSocket');
            ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.onopen = () => {
                log('✅ WebSocket connected');
                if (mountedRef.current) setIsJoined(true);
            };

            ws.onerror = () => {
                log('❌ WebSocket error');
            };

            ws.onclose = () => {
                log('⚠️ WebSocket closed');
                if (mountedRef.current) setIsJoined(false);
            };

            ws.onmessage = async (event) => {
                if (!mountedRef.current || !pc) return;

                const msg: WebRTCMessage = JSON.parse(event.data);
                log('📨', msg.type, 'from user:', msg.user_id);

                switch (msg.type) {
                    case 'user_join':
                        // Set polite based on user IDs - lower ID is polite
                        politeRef.current = userId < msg.user_id;
                        log('👤 User joined, I am', politeRef.current ? 'polite' : 'impolite');
                        
                        // Only impolite peer (higher ID) initiates
                        if (!politeRef.current) {
                            log('📤 Initiating call as impolite peer');
                            // Trigger negotiation by adding tracks or renegotiating
                            try {
                                const offer = await pc.createOffer();
                                await pc.setLocalDescription(offer);
                                send('offer', offer);
                                log('📤 Sent initial offer');
                            } catch (err) {
                                log('❌ Init offer error:', err);
                            }
                        }
                        break;

                    case 'offer':
                        // Perfect negotiation offer handling
                        const readyForOffer = !makingOfferRef.current && 
                            (pc.signalingState === 'stable' || pc.signalingState === 'have-remote-offer');
                        const offerCollision = !readyForOffer;

                        log('📥 Offer collision?', offerCollision, 'polite?', politeRef.current);

                        ignoreOfferRef.current = !politeRef.current && offerCollision;
                        if (ignoreOfferRef.current) {
                            log('🚫 Ignoring offer (impolite + collision)');
                            return;
                        }

                        try {
                            await pc.setRemoteDescription(msg.payload);
                            log('✅ Set remote offer');
                            
                            const answer = await pc.createAnswer();
                            await pc.setLocalDescription(answer);
                            send('answer', answer);
                            log('📤 Sent answer');
                        } catch (err) {
                            log('❌ Offer handling error:', err);
                        }
                        break;

                    case 'answer':
                        try {
                            if (pc.signalingState === 'have-local-offer') {
                                await pc.setRemoteDescription(msg.payload);
                                log('✅ Set remote answer');
                            } else {
                                log('⚠️ Ignoring answer, state:', pc.signalingState);
                            }
                        } catch (err) {
                            log('❌ Answer error:', err);
                        }
                        break;

                    case 'candidate':
                        try {
                            if (msg.payload) {
                                await pc.addIceCandidate(msg.payload);
                                log('🧊 Added ICE candidate');
                            }
                        } catch (err) {
                            if (!ignoreOfferRef.current) {
                                log('⚠️ ICE candidate error:', err);
                            }
                        }
                        break;

                    case 'user_leave':
                        log('👋 User left');
                        setRemoteStream(null);
                        break;
                }
            };
        };

        init();

        return () => {
            log('🧹 Cleanup');
            mountedRef.current = false;
            
            if (pc) {
                pc.close();
            }
            if (ws) {
                ws.close();
            }
            if (stream) {
                stream.getTracks().forEach(t => t.stop());
            }
        };
    }, [enabled, sessionId, userId]);

    return { localStream, remoteStream, isJoined, error };
}
