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

    // Use refs for mutable values that shouldn't trigger re-renders
    const pcRef = useRef<RTCPeerConnection | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const isConnectingRef = useRef(false);
    const isCleanedUpRef = useRef(false);

    const configuration: RTCConfiguration = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
        ],
    };

    // Keep localStreamRef in sync with localStream state
    useEffect(() => {
        localStreamRef.current = localStream;
    }, [localStream]);

    // Single main effect for WebSocket and media - only depends on sessionId and enabled
    useEffect(() => {
        if (!enabled || !sessionId) return;
        
        // Prevent multiple connections
        if (isConnectingRef.current) return;
        isConnectingRef.current = true;
        isCleanedUpRef.current = false;

        let ws: WebSocket | null = null;
        let stream: MediaStream | null = null;

        const sendSignalingMessage = (type: string, payload: any) => {
            if (ws?.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type, payload, session_id: sessionId }));
            }
        };

        const createPeerConnection = (): RTCPeerConnection => {
            const pc = new RTCPeerConnection(configuration);

            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    sendSignalingMessage('candidate', event.candidate);
                }
            };

            pc.ontrack = (event) => {
                if (!isCleanedUpRef.current) {
                    setRemoteStream(event.streams[0]);
                }
            };

            pc.oniceconnectionstatechange = () => {
                if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed') {
                    if (!isCleanedUpRef.current) {
                        setRemoteStream(null);
                    }
                }
            };

            return pc;
        };

        const handleOffer = async (offer: RTCSessionDescriptionInit) => {
            if (!pcRef.current) pcRef.current = createPeerConnection();
            
            const currentStream = localStreamRef.current;
            if (currentStream) {
                currentStream.getTracks().forEach(track => {
                    const senders = pcRef.current?.getSenders();
                    const alreadyAdded = senders?.some(s => s.track === track);
                    if (!alreadyAdded) {
                        pcRef.current?.addTrack(track, currentStream);
                    }
                });
            }

            await pcRef.current.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await pcRef.current.createAnswer();
            await pcRef.current.setLocalDescription(answer);
            sendSignalingMessage('answer', answer);
        };

        const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
            if (pcRef.current) {
                await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
            }
        };

        const handleCandidate = async (candidate: RTCIceCandidateInit) => {
            if (pcRef.current) {
                await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            }
        };

        const initiateCall = async () => {
            if (!pcRef.current) pcRef.current = createPeerConnection();

            const currentStream = localStreamRef.current;
            if (currentStream) {
                currentStream.getTracks().forEach(track => {
                    pcRef.current?.addTrack(track, currentStream);
                });
            }

            const offer = await pcRef.current.createOffer();
            await pcRef.current.setLocalDescription(offer);
            sendSignalingMessage('offer', offer);
        };

        const startConnection = async () => {
            // Get media stream first
            const constraintOptions = [
                { video: true, audio: true },
                { video: true, audio: false },
                { video: false, audio: true }
            ];

            for (const constraints of constraintOptions) {
                try {
                    stream = await navigator.mediaDevices.getUserMedia(constraints);
                    if (stream && !isCleanedUpRef.current) {
                        setLocalStream(stream);
                        localStreamRef.current = stream;
                        setError(null);
                        break;
                    }
                } catch (err: any) {
                    console.warn(`Constraint ${JSON.stringify(constraints)} failed:`, err.name);
                    if (err.name === 'NotReadableError') {
                        setError('Camera or Microphone is already in use by another application.');
                    }
                }
            }

            if (!stream && !isCleanedUpRef.current) {
                setError('Failed to access camera/microphone. You can still use the whiteboard.');
            }

            // Setup WebSocket
            try {
                const token = localStorage.getItem('token');
                
                if (!token) {
                    console.error('❌ No token found in localStorage');
                    setError('Not authenticated. Please log in again.');
                    isConnectingRef.current = false;
                    return;
                }
                
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
                const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
                
                const baseWsUrl = apiUrl.startsWith('http') 
                    ? apiUrl.replace(/^http/, 'ws') 
                    : `${wsProtocol}://${window.location.host}${apiUrl}`;

                const wsUrl = `${baseWsUrl}/ws/video/${sessionId}?token=${encodeURIComponent(token)}`;
                
                console.log('🔌 Connecting to Signaling WS:', wsUrl.split('?')[0]);
                ws = new WebSocket(wsUrl);
                wsRef.current = ws;

                ws.onopen = () => {
                    console.log('✅ Signaling WebSocket connected');
                    if (!isCleanedUpRef.current) {
                        setIsJoined(true);
                    }
                };

                ws.onerror = () => {
                    console.error('❌ Signaling WebSocket error - ReadyState:', ws?.readyState);
                    if (!isCleanedUpRef.current) {
                        setError('Failed to connect to signaling server.');
                    }
                };

                ws.onclose = (ev) => {
                    console.log('⚠️ Signaling WebSocket closed:', {
                        code: ev.code,
                        reason: ev.reason || 'No reason provided',
                        wasClean: ev.wasClean
                    });
                    if (!isCleanedUpRef.current) {
                        setIsJoined(false);
                        if (ev.code !== 1000 && ev.code !== 1001) {
                            setError(`Connection closed (code: ${ev.code})`);
                        }
                    }
                };

                ws.onmessage = async (event) => {
                    if (isCleanedUpRef.current) return;
                    
                    try {
                        const msg: WebRTCMessage = JSON.parse(event.data);
                        switch (msg.type) {
                            case 'user_join':
                                await initiateCall();
                                break;
                            case 'offer':
                                await handleOffer(msg.payload);
                                break;
                            case 'answer':
                                await handleAnswer(msg.payload);
                                break;
                            case 'candidate':
                                await handleCandidate(msg.payload);
                                break;
                            case 'user_leave':
                                setRemoteStream(null);
                                if (pcRef.current) {
                                    pcRef.current.close();
                                    pcRef.current = createPeerConnection();
                                }
                                break;
                        }
                    } catch (err) {
                        console.error('Error handling WebSocket message:', err);
                    }
                };
            } catch (wsErr) {
                console.error('WebSocket setup error:', wsErr);
                if (!isCleanedUpRef.current) {
                    setError('Failed to connect to video server');
                }
            }
        };

        startConnection();

        // Cleanup function
        return () => {
            console.log('🧹 Cleaning up WebRTC connection');
            isCleanedUpRef.current = true;
            isConnectingRef.current = false;

            if (pcRef.current) {
                pcRef.current.close();
                pcRef.current = null;
            }
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [enabled, sessionId]); // Only depend on these two stable values

    return { localStream, remoteStream, isJoined, error };
}
