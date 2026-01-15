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

    const configuration: RTCConfiguration = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            // Managed TURN servers would be added here
        ],
    };

    const cleanup = useCallback(() => {
        if (pcRef.current) {
            pcRef.current.close();
            pcRef.current = null;
        }
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }
        setRemoteStream(null);
        setIsJoined(false);
    }, [localStream]);

    const sendSignalingMessage = useCallback((type: string, payload: any) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type, payload, session_id: sessionId }));
        }
    }, [sessionId]);

    const createPeerConnection = useCallback(() => {
        const pc = new RTCPeerConnection(configuration);

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                sendSignalingMessage('candidate', event.candidate);
            }
        };

        pc.ontrack = (event) => {
            setRemoteStream(event.streams[0]);
        };

        pc.oniceconnectionstatechange = () => {
            if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed') {
                setRemoteStream(null);
            }
        };

        return pc;
    }, [sendSignalingMessage]);

    const handleOffer = useCallback(async (offer: RTCSessionDescriptionInit) => {
        if (!pcRef.current) pcRef.current = createPeerConnection();
        
        // Add local tracks if not already added
        if (localStream) {
            localStream.getTracks().forEach(track => {
                const senders = pcRef.current?.getSenders();
                const alreadyAdded = senders?.some(s => s.track === track);
                if (!alreadyAdded) {
                    pcRef.current?.addTrack(track, localStream);
                }
            });
        }

        await pcRef.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pcRef.current.createAnswer();
        await pcRef.current.setLocalDescription(answer);
        sendSignalingMessage('answer', answer);
    }, [createPeerConnection, localStream, sendSignalingMessage]);

    const handleAnswer = useCallback(async (answer: RTCSessionDescriptionInit) => {
        if (pcRef.current) {
            await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        }
    }, []);

    const handleCandidate = useCallback(async (candidate: RTCIceCandidateInit) => {
        if (pcRef.current) {
            await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
    }, []);

    const initiateCall = useCallback(async () => {
        if (!pcRef.current) pcRef.current = createPeerConnection();

        if (localStream) {
            localStream.getTracks().forEach(track => {
                pcRef.current?.addTrack(track, localStream);
            });
        }

        const offer = await pcRef.current.createOffer();
        await pcRef.current.setLocalDescription(offer);
        sendSignalingMessage('offer', offer);
    }, [createPeerConnection, localStream, sendSignalingMessage]);

    useEffect(() => {
        if (!enabled || !sessionId) return;

        const startLocalStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setLocalStream(stream);

                // Setup WebSocket
                const token = localStorage.getItem('token');
                const wsUrl = `${process.env.NEXT_PUBLIC_API_URL?.replace('http', 'ws') || 'ws://localhost:8080/api/v1'}/ws/video/${sessionId}?token=${token}`;
                const ws = new WebSocket(wsUrl);

                ws.onopen = () => {
                    setIsJoined(true);
                };

                ws.onmessage = async (event) => {
                    const msg: WebRTCMessage = JSON.parse(event.data);
                    switch (msg.type) {
                        case 'user_join':
                            // When someone joins, the one already there initiates the call
                            initiateCall();
                            break;
                        case 'offer':
                            handleOffer(msg.payload);
                            break;
                        case 'answer':
                            handleAnswer(msg.payload);
                            break;
                        case 'candidate':
                            handleCandidate(msg.payload);
                            break;
                        case 'user_leave':
                            setRemoteStream(null);
                            if (pcRef.current) {
                                pcRef.current.close();
                                pcRef.current = createPeerConnection();
                            }
                            break;
                    }
                };

                wsRef.current = ws;
            } catch (err) {
                console.error('WebRTC start error:', err);
                setError('Failed to access camera/microphone');
            }
        };

        startLocalStream();

        return cleanup;
    }, [enabled, sessionId, initiateCall, handleOffer, handleAnswer, handleCandidate, cleanup, createPeerConnection]);

    return { localStream, remoteStream, isJoined, error };
}
