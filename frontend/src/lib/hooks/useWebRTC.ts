import { useEffect, useRef, useState, useCallback } from 'react';

interface WebRTCMessage {
    type: 'offer' | 'answer' | 'candidate' | 'user_join' | 'user_leave' | 'screen_share_start' | 'screen_share_stop';
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
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [screenSharingUserId, setScreenSharingUserId] = useState<number | null>(null);

    const pcRef = useRef<RTCPeerConnection | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const screenStreamRef = useRef<MediaStream | null>(null);
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
                        // Reset screen sharing if the user who left was sharing
                        if (screenSharingUserId === msg.user_id) {
                            setScreenSharingUserId(null);
                        }
                        break;

                    case 'screen_share_start':
                        log('🖥️ User started screen sharing:', msg.user_id);
                        setScreenSharingUserId(msg.user_id);
                        break;

                    case 'screen_share_stop':
                        log('🖥️ User stopped screen sharing:', msg.user_id);
                        setScreenSharingUserId(null);
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
                    console.warn('Could not reset bitrate:', bitrateErr);
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
                        console.warn('Could not remove audio track:', removeErr);
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

            console.log('✅ Screen sharing stopped successfully');
        } catch (err) {
            console.error('❌ Stop screen share error:', err);
            // Force cleanup even if error
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
            }).catch(async (err) => {
                // Fallback without audio if permission denied
                console.log('System audio not available, trying without audio:', err);
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
                console.log('Screen share stopped by user via browser button');
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
            } catch (bitrateErr) {
                console.warn('Could not set bitrate:', bitrateErr);
            }

            // Add audio track if available
            const audioTrack = screenStream.getAudioTracks()[0];
            if (audioTrack) {
                try {
                    pc.addTrack(audioTrack, screenStream);
                } catch (addTrackErr) {
                    console.warn('Could not add audio track:', addTrackErr);
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

            console.log('✅ Screen sharing started successfully');
        } catch (err: any) {
            console.error('❌ Screen share error:', err);
            
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
