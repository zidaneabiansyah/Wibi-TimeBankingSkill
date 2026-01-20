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
    
    // Queue for ICE candidates that arrive before remote description is set
    const iceCandidateQueueRef = useRef<RTCIceCandidateInit[]>([]);
    const hasRemoteDescriptionRef = useRef(false);

    const configuration: RTCConfiguration = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
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
        hasRemoteDescriptionRef.current = false;
        iceCandidateQueueRef.current = [];

        let ws: WebSocket | null = null;
        let stream: MediaStream | null = null;

        const sendSignalingMessage = (type: string, payload: any) => {
            if (ws?.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type, payload, session_id: sessionId }));
            }
        };

        const createPeerConnection = (): RTCPeerConnection => {
            // Close existing connection if any
            if (pcRef.current) {
                pcRef.current.close();
            }
            
            const pc = new RTCPeerConnection(configuration);

            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    sendSignalingMessage('candidate', event.candidate);
                }
            };

            pc.ontrack = (event) => {
                console.log('📹 Received remote track:', event.track.kind);
                if (!isCleanedUpRef.current && event.streams[0]) {
                    setRemoteStream(event.streams[0]);
                }
            };

            pc.oniceconnectionstatechange = () => {
                console.log('🔗 ICE Connection State:', pc.iceConnectionState);
                if (pc.iceConnectionState === 'connected') {
                    console.log('✅ ICE Connection established!');
                }
                if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed') {
                    if (!isCleanedUpRef.current) {
                        setRemoteStream(null);
                    }
                }
            };

            pc.onconnectionstatechange = () => {
                console.log('📡 Connection State:', pc.connectionState);
            };

            return pc;
        };

        // Process queued ICE candidates after remote description is set
        const processIceCandidateQueue = async () => {
            if (!pcRef.current || !hasRemoteDescriptionRef.current) return;
            
            console.log(`📦 Processing ${iceCandidateQueueRef.current.length} queued ICE candidates`);
            
            while (iceCandidateQueueRef.current.length > 0) {
                const candidate = iceCandidateQueueRef.current.shift();
                if (candidate) {
                    try {
                        await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                    } catch (err) {
                        console.warn('Error adding queued ICE candidate:', err);
                    }
                }
            }
        };

        const addTracksToConnection = () => {
            const currentStream = localStreamRef.current;
            if (currentStream && pcRef.current) {
                currentStream.getTracks().forEach(track => {
                    const senders = pcRef.current?.getSenders();
                    const alreadyAdded = senders?.some(s => s.track === track);
                    if (!alreadyAdded) {
                        console.log('➕ Adding track:', track.kind);
                        pcRef.current?.addTrack(track, currentStream);
                    }
                });
            }
        };

        const handleOffer = async (offer: RTCSessionDescriptionInit) => {
            try {
                console.log('📥 Received offer, creating answer...');
                
                if (!pcRef.current) pcRef.current = createPeerConnection();
                
                // Reset state for new negotiation
                hasRemoteDescriptionRef.current = false;
                
                // Check if we can accept an offer
                const currentState = pcRef.current.signalingState;
                if (currentState !== 'stable') {
                    console.warn('Ignoring offer - signaling state is:', currentState);
                    return;
                }
                
                // Add tracks before setting remote description
                addTracksToConnection();

                await pcRef.current.setRemoteDescription(new RTCSessionDescription(offer));
                hasRemoteDescriptionRef.current = true;
                
                // Process any queued candidates
                await processIceCandidateQueue();
                
                const answer = await pcRef.current.createAnswer();
                await pcRef.current.setLocalDescription(answer);
                sendSignalingMessage('answer', answer);
                console.log('📤 Sent answer');
            } catch (err) {
                console.error('Error handling offer:', err);
            }
        };

        const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
            try {
                if (!pcRef.current) return;
                
                console.log('📥 Received answer');
                
                // Only set remote answer if we're in the correct state
                if (pcRef.current.signalingState === 'have-local-offer') {
                    await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
                    hasRemoteDescriptionRef.current = true;
                    
                    // Process any queued candidates
                    await processIceCandidateQueue();
                    console.log('✅ Answer applied successfully');
                } else {
                    console.warn('Ignoring answer - signaling state is:', pcRef.current.signalingState);
                }
            } catch (err) {
                console.error('Error handling answer:', err);
            }
        };

        const handleCandidate = async (candidate: RTCIceCandidateInit) => {
            if (!pcRef.current) return;
            
            // If remote description is not set yet, queue the candidate
            if (!hasRemoteDescriptionRef.current) {
                console.log('📦 Queueing ICE candidate (waiting for remote description)');
                iceCandidateQueueRef.current.push(candidate);
                return;
            }
            
            try {
                await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (err) {
                console.warn('Error adding ICE candidate:', err);
            }
        };

        const initiateCall = async () => {
            try {
                console.log('📞 Initiating call...');
                
                if (!pcRef.current) pcRef.current = createPeerConnection();
                
                // Check if we're already in a negotiation process
                if (pcRef.current.signalingState !== 'stable') {
                    console.warn('Ignoring initiateCall - signaling state is:', pcRef.current.signalingState);
                    return;
                }

                // Add tracks before creating offer
                addTracksToConnection();

                const offer = await pcRef.current.createOffer();
                await pcRef.current.setLocalDescription(offer);
                sendSignalingMessage('offer', offer);
                console.log('📤 Sent offer');
            } catch (err) {
                console.error('Error initiating call:', err);
            }
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
                        console.log('🎥 Got local media stream');
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
                        // Create peer connection immediately when WebSocket connects
                        if (!pcRef.current) {
                            pcRef.current = createPeerConnection();
                        }
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
                        console.log('📨 Received message:', msg.type);
                        
                        switch (msg.type) {
                            case 'user_join':
                                console.log('👤 User joined:', msg.user_name);
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
                                console.log('👋 User left:', msg.user_name);
                                setRemoteStream(null);
                                hasRemoteDescriptionRef.current = false;
                                iceCandidateQueueRef.current = [];
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
            hasRemoteDescriptionRef.current = false;
            iceCandidateQueueRef.current = [];

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
