'use client';

import React from 'react';
import { TldrawWhiteboard } from '../whiteboard/TldrawWhiteboard';
import { useWebRTC } from '@/lib/hooks/useWebRTC';
import { useAuthStore } from '@/stores/auth.store';
import { Video, VideoOff, Mic, MicOff, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ClassroomLayoutProps {
    sessionId: number;
}

export function ClassroomLayout({ sessionId }: ClassroomLayoutProps) {
    const { user } = useAuthStore();
    const { localStream, remoteStream, isJoined, error } = useWebRTC({
        sessionId,
        userId: user?.id || 0,
    });

    const [isVideoEnabled, setIsVideoEnabled] = React.useState(true);
    const [isAudioEnabled, setIsAudioEnabled] = React.useState(true);
    const [isMinimized, setIsMinimized] = React.useState(false);

    const toggleVideo = () => {
        if (localStream) {
            localStream.getVideoTracks().forEach(track => (track.enabled = !isVideoEnabled));
            setIsVideoEnabled(!isVideoEnabled);
        }
    };

    const toggleAudio = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => (track.enabled = !isAudioEnabled));
            setIsAudioEnabled(!isAudioEnabled);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] gap-4 p-4">
            <div className="relative flex-1 bg-background rounded-xl shadow-2xl border border-border overflow-hidden">
                {/* Whiteboard Area */}
                <TldrawWhiteboard sessionId={sessionId} />

                {/* Video Overlays */}
                <div className={`absolute bottom-4 right-4 flex flex-col gap-4 transition-all duration-300 ${isMinimized ? 'scale-75 origin-bottom-right opacity-50 hover:opacity-100' : ''}`}>
                    {/* Remote Video (Teacher/Student) */}
                    <div className="relative w-64 aspect-video bg-black rounded-lg overflow-hidden shadow-xl border-2 border-primary/20">
                        {remoteStream ? (
                            <VideoRenderer stream={remoteStream} muted={false} />
                        ) : (
                            <div className="flex items-center justify-center h-full text-white/50 text-xs">
                                Waiting for partner...
                            </div>
                        )}
                        <div className="absolute top-2 left-2 bg-black/50 px-2 py-0.5 rounded text-[10px] text-white">
                            Partner
                        </div>
                    </div>

                    {/* Local Video */}
                    <div className="relative w-48 aspect-video bg-black rounded-lg overflow-hidden shadow-xl border-2 border-primary/20 self-end">
                        {localStream ? (
                            <VideoRenderer stream={localStream} muted={true} />
                        ) : (
                            <div className="flex items-center justify-center h-full text-white/50 text-xs">
                                Camera Off
                            </div>
                        )}
                        <div className="absolute top-2 left-2 bg-black/50 px-2 py-0.5 rounded text-[10px] text-white">
                            You (Local)
                        </div>
                        
                        {/* Media Controls */}
                        <div className="absolute bottom-2 right-2 flex gap-1">
                            <Button size="icon" variant="secondary" className="h-6 w-6" onClick={toggleAudio}>
                                {isAudioEnabled ? <Mic className="h-3 w-3" /> : <MicOff className="h-3 w-3 text-destructive" />}
                            </Button>
                            <Button size="icon" variant="secondary" className="h-6 w-6" onClick={toggleVideo}>
                                {isVideoEnabled ? <Video className="h-3 w-3" /> : <VideoOff className="h-3 w-3 text-destructive" />}
                            </Button>
                        </div>
                    </div>

                    {/* Toggle Minimize */}
                    <Button 
                        size="icon" 
                        variant="ghost" 
                        className="absolute -top-10 right-0 h-8 w-8 bg-white/20 hover:bg-white/40 backdrop-blur rounded-full text-white"
                        onClick={() => setIsMinimized(!isMinimized)}
                    >
                        {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                    </Button>
                </div>
                
                {error && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-destructive/90 text-destructive-foreground px-4 py-2 rounded-full text-sm shadow-lg">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}

function VideoRenderer({ stream, muted }: { stream: MediaStream; muted: boolean }) {
    const videoRef = React.useRef<HTMLVideoElement>(null);

    React.useEffect(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={muted}
            className="w-full h-full object-cover"
        />
    );
}
