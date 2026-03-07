import { useEffect, useRef, useState, useCallback } from 'react';

interface UseWebRTCProps {
    sessionId: number;
    userId: number;
    enabled?: boolean;
}

interface ConnectionQuality {
    bandwidth: number; // Kbps
    packetLoss: number; // percentage
    latency: number; // ms
    quality: 'excellent' | 'good' | 'fair' | 'poor';
}

interface WebRTCMessage {
    type: 'offer' | 'answer' | 'candidate' | 'user_join' | 'user_leave' | 'screen_share_start' | 'screen_share_stop';
    payload: any;
    user_id: number;
    user_name: string;
}

export function useWebRTC({ sessionId, userId, enabled = true }: UseWebRTCProps) {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [isJoined, setIsJoined] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [screenSharingUserId, setScreenSharingUserId] = useState<number | null>(null);
    const [connectionQuality, setConnectionQuality] = useState<ConnectionQuality>({
        bandwidth: 0,
        packetLoss: 0,
        latency: 0,
        quality: 'good'
    });

    const pcRef = useRef<RTCPeerConnection | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const screenStreamRef = useRef<MediaStream | null>(null);
    const mountedRef = useRef(true);
    const statsIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const iceCandidateBufferRef = useRef<RTCIceCandidate[]>([]);
    const reconnectAttemptsRef = useRef(0);
    const maxReconnectAttempts = 5;
    
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
                    } catch {
                        // No media access available
                    }
                }
            }

            if (stream && mountedRef.current) {
                streamRef.current = stream;
                setLocalStream(stream);
            }

            // 2. Create peer connection
            pc = new RTCPeerConnection(config);
            pcRef.current = pc;

            // Add local tracks
            if (stream) {
                stream.getTracks().forEach(track => {
                    pc!.addTrack(track, stream!);
                });
            }

            // Remote track handler
            pc.ontrack = (event) => {
                if (mountedRef.current && event.streams[0]) {
                    setRemoteStream(event.streams[0]);
                }
            };

            // ICE candidate handler
            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    send('candidate', event.candidate);
                }
            };

            pc.oniceconnectionstatechange = () => {};
            pc.onconnectionstatechange = () => {};

            // Perfect negotiation: negotiation needed handler
            pc.onnegotiationneeded = async () => {
                try {
                    makingOfferRef.current = true;
                    await pc!.setLocalDescription();
                    send('offer', pc!.localDescription);
                } catch {
                    // Offer creation failed silently
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

            ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.onopen = () => {
                if (mountedRef.current) setIsJoined(true);
            };

            ws.onerror = () => {};

            ws.onclose = () => {
                if (mountedRef.current) setIsJoined(false);
            };

            ws.onmessage = async (event) => {
                if (!mountedRef.current || !pc) return;

                const msg: WebRTCMessage = JSON.parse(event.data);
                switch (msg.type) {
                    case 'user_join':
                        politeRef.current = userId < msg.user_id;
                        if (!politeRef.current) {
                            try {
                                const offer = await pc.createOffer();
                                await pc.setLocalDescription(offer);
                                send('offer', offer);
                            } catch {
                                // Init offer failed silently
                            }
                        }
                        break;

                    case 'offer':
                        const readyForOffer = !makingOfferRef.current && 
                            (pc.signalingState === 'stable' || pc.signalingState === 'have-remote-offer');
                        const offerCollision = !readyForOffer;

                        ignoreOfferRef.current = !politeRef.current && offerCollision;
                        if (ignoreOfferRef.current) return;

                        try {
                            await pc.setRemoteDescription(msg.payload);
                            const answer = await pc.createAnswer();
                            await pc.setLocalDescription(answer);
                            send('answer', answer);
                        } catch {
                            // Offer handling failed silently
                        }
                        break;

                    case 'answer':
                        try {
                            if (pc.signalingState === 'have-local-offer') {
                                await pc.setRemoteDescription(msg.payload);
                            }
                        } catch {
                            // Answer handling failed silently
                        }
                        break;

                    case 'candidate':
                        try {
                            if (msg.payload) {
                                await pc.addIceCandidate(msg.payload);
                            }
                        } catch {
                            // ICE candidate error ignored silently
                        }
                        break;

                    case 'user_leave':
                        setRemoteStream(null);
                        // Reset screen sharing if the user who left was sharing
                        if (screenSharingUserId === msg.user_id) {
                            setScreenSharingUserId(null);
                        }
                        break;

                    case 'screen_share_start':
                        setScreenSharingUserId(msg.user_id);
                        break;

                    case 'screen_share_stop':
                        setScreenSharingUserId(null);
                        break;
                }
            };
        };

        init();

        return () => {
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
            if (screenStreamRef.current) {
                screenStreamRef.current.getTracks().forEach(t => t.stop());
            }
        };
    }, [enabled, sessionId, userId]);

    // Stop screen sharing
    const stopScreenShare = useCallback(async () => {
        const pc = pcRef.current;
        const ws = wsRef.current;
        const screenStream = screenStreamRef.current;
        
        if (!pc || !screenStream) {
            return;
        }

        try {
            // Replace back to camera track
            const cameraTrack = streamRef.current?.getVideoTracks()[0];
            const sender = pc.getSenders().find(s => s.track?.kind === 'video');
            
            if (sender && cameraTrack) {
                // replaceTrack is safe during negotiation
                await sender.replaceTrack(cameraTrack);
                
                // Reset bitrate to default
                try {
                    const params = sender.getParameters();
                    if (params.encodings && params.encodings.length > 0) {
                        delete params.encodings[0].maxBitrate;
                        await sender.setParameters(params);
                    }
                } catch (bitrateErr) {
                }
            }

            // Remove audio track if it was added
            const audioSenders = pc.getSenders().filter(s => s.track?.kind === 'audio');
            if (audioSenders.length > 1) {
                // Remove the screen audio track (keep the mic audio)
                const screenAudioSender = audioSenders.find(s => 
                    screenStream.getAudioTracks().includes(s.track as MediaStreamTrack)
                );
                if (screenAudioSender) {
                    try {
                        pc.removeTrack(screenAudioSender);
                    } catch (removeErr) {
                    }
                }
            }

            // Stop screen stream tracks
            screenStream.getTracks().forEach(track => track.stop());
            screenStreamRef.current = null;
            setIsScreenSharing(false);

            // Notify peers via WebSocket
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ 
                    type: 'screen_share_stop', 
                    session_id: sessionId,
                    user_id: userId 
                }));
            }

            // Screen sharing stopped successfully
        } catch {
            screenStream.getTracks().forEach(track => track.stop());
            screenStreamRef.current = null;
            setIsScreenSharing(false);
        }
    }, [sessionId, userId]);

    // Start screen sharing
    const startScreenShare = useCallback(async () => {
        const pc = pcRef.current;
        const ws = wsRef.current;
        
        if (!pc || !ws || ws.readyState !== WebSocket.OPEN) {
            setError('Not connected to call');
            return;
        }

        try {
            // Check browser support
            if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
                setError('Screen sharing not supported in this browser');
                return;
            }

            // Get screen capture stream with optimal settings for 1080p
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    displaySurface: 'monitor',
                    width: { ideal: 1920, max: 1920 },
                    height: { ideal: 1080, max: 1080 },
                    frameRate: { ideal: 15, max: 30 } // Lower FPS for screen share
                } as MediaTrackConstraints,
                audio: true // Include system audio
            }).catch(async () => {
                return navigator.mediaDevices.getDisplayMedia({
                    video: {
                        displaySurface: 'monitor',
                        width: { ideal: 1920, max: 1920 },
                        height: { ideal: 1080, max: 1080 },
                        frameRate: { ideal: 15, max: 30 }
                    } as MediaTrackConstraints,
                    audio: false
                });
            });

            if (!screenStream) {
                throw new Error('Failed to get screen stream');
            }

            const screenTrack = screenStream.getVideoTracks()[0];
            
            // Handle user stopping screen share via browser button
            screenTrack.onended = () => {
                stopScreenShare();
            };

            // Replace video track in peer connection
            const sender = pc.getSenders().find(s => s.track?.kind === 'video');
            
            if (!sender) {
                throw new Error('No video sender found');
            }

            // Replace track immediately - no need to wait for stable state
            // replaceTrack() is safe to call during negotiation
            await sender.replaceTrack(screenTrack);
            
            // Optional: Adjust bitrate for better quality
            try {
                const params = sender.getParameters();
                if (params.encodings && params.encodings.length > 0) {
                    params.encodings[0].maxBitrate = 2500000; // 2.5 Mbps
                    await sender.setParameters(params);
                }
            } catch {
                // Could not set bitrate, continue without it
            }

            // Add audio track if available
            const audioTrack = screenStream.getAudioTracks()[0];
            if (audioTrack) {
                try {
                    pc.addTrack(audioTrack, screenStream);
                } catch {
                    // Could not add audio track
                }
            }

            screenStreamRef.current = screenStream;
            setIsScreenSharing(true);
            setError(null);

            // Notify peers via WebSocket
            ws.send(JSON.stringify({ 
                type: 'screen_share_start', 
                session_id: sessionId,
                user_id: userId 
            }));

            // Screen sharing started successfully
        } catch (err: any) {
            // Cleanup screen stream if error occurred
            if (screenStreamRef.current) {
                screenStreamRef.current.getTracks().forEach(t => t.stop());
                screenStreamRef.current = null;
            }
            
            if (err.name === 'NotAllowedError') {
                setError('Screen sharing permission denied');
            } else if (err.name === 'NotFoundError') {
                setError('No screen available to share');
            } else if (err.name === 'AbortError') {
                // User cancelled screen share dialog
                setError(null);
            } else {
                setError('Failed to start screen sharing');
            }
        }
    }, [sessionId, userId, stopScreenShare]);

    return { 
        localStream, 
        remoteStream, 
        isJoined, 
        error,
        isScreenSharing,
        screenSharingUserId,
        startScreenShare,
        stopScreenShare
    };
}
