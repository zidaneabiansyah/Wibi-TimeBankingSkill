'use client';

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useWebRTC } from '@/lib/hooks/useWebRTC';
import { useAuthStore } from '@/stores/auth.store';
import { 
    Video, VideoOff, Mic, MicOff, PhoneOff, 
    PenTool, Users, MessageSquare, Settings,
    Maximize2, Minimize2, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Dynamic import for whiteboard to reduce initial load
const TldrawWhiteboard = dynamic(
    () => import('../whiteboard/TldrawWhiteboard').then(mod => mod.TldrawWhiteboard),
    { ssr: false, loading: () => <div className="flex items-center justify-center h-full bg-zinc-900 text-zinc-500">Loading whiteboard...</div> }
);

interface ClassroomLayoutProps {
    sessionId: number;
    onLeave?: () => void;
}

type ViewMode = 'video' | 'whiteboard';

export function ClassroomLayout({ sessionId, onLeave }: ClassroomLayoutProps) {
    const { user } = useAuthStore();
    const { localStream, remoteStream, isJoined, error } = useWebRTC({
        sessionId,
        userId: user?.id || 0,
    });

    const [viewMode, setViewMode] = useState<ViewMode>('video');
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Toggle video track
    const toggleVideo = () => {
        if (localStream) {
            localStream.getVideoTracks().forEach(track => (track.enabled = !isVideoEnabled));
            setIsVideoEnabled(!isVideoEnabled);
        }
    };

    // Toggle audio track
    const toggleAudio = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => (track.enabled = !isAudioEnabled));
            setIsAudioEnabled(!isAudioEnabled);
        }
    };

    // Toggle fullscreen
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    // Handle leave call
    const handleLeave = () => {
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }
        onLeave?.();
    };

    return (
        <div 
            ref={containerRef}
            className="relative flex flex-col h-[calc(100vh-80px)] bg-zinc-950 rounded-2xl overflow-hidden shadow-2xl"
        >
            {/* Main Content Area */}
            <div className="flex-1 relative overflow-hidden">
                {viewMode === 'video' ? (
                    // VIDEO MODE - Partner large, self PiP
                    <VideoModeLayout
                        localStream={localStream}
                        remoteStream={remoteStream}
                        isVideoEnabled={isVideoEnabled}
                        userName={user?.full_name || 'You'}
                    />
                ) : (
                    // WHITEBOARD MODE - Whiteboard main, videos sidebar
                    <WhiteboardModeLayout
                        sessionId={sessionId}
                        localStream={localStream}
                        remoteStream={remoteStream}
                        isVideoEnabled={isVideoEnabled}
                        userName={user?.full_name || 'You'}
                    />
                )}

                {/* Connection Status */}
                {!isJoined && !error && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-zinc-800/90 backdrop-blur px-4 py-2 rounded-full text-sm text-zinc-300 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                        Connecting...
                    </div>
                )}

                {/* Error Toast */}
                {error && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500/90 backdrop-blur px-4 py-2 rounded-full text-sm text-white flex items-center gap-2">
                        <X className="w-4 h-4" />
                        {error}
                    </div>
                )}
            </div>

            {/* Control Bar - Modern floating style */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
                <div className="flex items-center gap-2 bg-zinc-800/90 backdrop-blur-xl px-4 py-3 rounded-2xl shadow-2xl border border-zinc-700/50">
                    {/* Mic Toggle */}
                    <ControlButton
                        onClick={toggleAudio}
                        isActive={isAudioEnabled}
                        activeIcon={<Mic className="w-5 h-5" />}
                        inactiveIcon={<MicOff className="w-5 h-5" />}
                        tooltip={isAudioEnabled ? 'Mute' : 'Unmute'}
                    />

                    {/* Camera Toggle */}
                    <ControlButton
                        onClick={toggleVideo}
                        isActive={isVideoEnabled}
                        activeIcon={<Video className="w-5 h-5" />}
                        inactiveIcon={<VideoOff className="w-5 h-5" />}
                        tooltip={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
                    />

                    <div className="w-px h-8 bg-zinc-600 mx-2" />

                    {/* View Mode Toggle */}
                    <ControlButton
                        onClick={() => setViewMode(viewMode === 'video' ? 'whiteboard' : 'video')}
                        isActive={viewMode === 'whiteboard'}
                        activeIcon={<PenTool className="w-5 h-5" />}
                        inactiveIcon={<PenTool className="w-5 h-5" />}
                        tooltip={viewMode === 'video' ? 'Open Whiteboard' : 'Close Whiteboard'}
                        variant="feature"
                    />

                    {/* Fullscreen */}
                    <ControlButton
                        onClick={toggleFullscreen}
                        isActive={false}
                        activeIcon={<Maximize2 className="w-5 h-5" />}
                        inactiveIcon={isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                        tooltip={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                    />

                    <div className="w-px h-8 bg-zinc-600 mx-2" />

                    {/* End Call */}
                    <Button
                        onClick={handleLeave}
                        className="bg-red-500 hover:bg-red-600 text-white rounded-full h-12 w-12 p-0"
                    >
                        <PhoneOff className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

// Video Mode Layout - Partner video large, self as PiP
function VideoModeLayout({
    localStream,
    remoteStream,
    isVideoEnabled,
    userName
}: {
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    isVideoEnabled: boolean;
    userName: string;
}) {
    return (
        <div className="relative w-full h-full bg-zinc-900">
            {/* Main Video (Partner) */}
            <div className="absolute inset-0">
                {remoteStream ? (
                    <VideoRenderer stream={remoteStream} muted={false} />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-400">
                        <div className="w-24 h-24 rounded-full bg-zinc-700 flex items-center justify-center mb-4">
                            <Users className="w-12 h-12 text-zinc-500" />
                        </div>
                        <span className="text-lg font-medium">Waiting for partner...</span>
                        <span className="text-sm text-zinc-500 mt-1">They'll appear here when they join</span>
                    </div>
                )}
            </div>
            
            {/* Partner Name Badge */}
            {remoteStream && (
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-3 py-1.5 rounded-lg text-white text-sm font-medium">
                    Partner
                </div>
            )}

            {/* Self Video (PiP) */}
            <div className="absolute bottom-4 right-4 w-48 aspect-video rounded-xl overflow-hidden shadow-2xl border-2 border-zinc-700 bg-zinc-900 transition-all hover:scale-105">
                {localStream && isVideoEnabled ? (
                    <VideoRenderer stream={localStream} muted={true} />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-500 bg-zinc-800">
                        <VideoOff className="w-6 h-6 mb-1" />
                        <span className="text-xs">Camera Off</span>
                    </div>
                )}
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur px-2 py-0.5 rounded text-white text-xs">
                    {userName}
                </div>
            </div>
        </div>
    );
}

// Whiteboard Mode Layout - Whiteboard main, videos in sidebar
function WhiteboardModeLayout({
    sessionId,
    localStream,
    remoteStream,
    isVideoEnabled,
    userName
}: {
    sessionId: number;
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    isVideoEnabled: boolean;
    userName: string;
}) {
    return (
        <div className="flex w-full h-full">
            {/* Whiteboard Area */}
            <div className="flex-1 relative bg-white rounded-lg m-2 mr-0 overflow-hidden shadow-inner">
                <TldrawWhiteboard sessionId={sessionId} />
            </div>

            {/* Video Sidebar */}
            <div className="w-56 flex flex-col gap-2 p-2">
                {/* Partner Video */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-800 shadow-lg border border-zinc-700">
                    {remoteStream ? (
                        <VideoRenderer stream={remoteStream} muted={false} />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                            <Users className="w-8 h-8 mb-1" />
                            <span className="text-xs">Waiting...</span>
                        </div>
                    )}
                    <div className="absolute bottom-1 left-1 bg-black/60 px-1.5 py-0.5 rounded text-white text-[10px]">
                        Partner
                    </div>
                </div>

                {/* Self Video */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-800 shadow-lg border border-zinc-700">
                    {localStream && isVideoEnabled ? (
                        <VideoRenderer stream={localStream} muted={true} />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                            <VideoOff className="w-6 h-6 mb-1" />
                            <span className="text-xs">Camera Off</span>
                        </div>
                    )}
                    <div className="absolute bottom-1 left-1 bg-black/60 px-1.5 py-0.5 rounded text-white text-[10px]">
                        {userName}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Control Button Component
function ControlButton({
    onClick,
    isActive,
    activeIcon,
    inactiveIcon,
    tooltip,
    variant = 'default'
}: {
    onClick: () => void;
    isActive: boolean;
    activeIcon: React.ReactNode;
    inactiveIcon: React.ReactNode;
    tooltip: string;
    variant?: 'default' | 'feature';
}) {
    const baseClasses = "h-12 w-12 rounded-full flex items-center justify-center transition-all";
    
    const variantClasses = {
        default: isActive 
            ? "bg-zinc-700 hover:bg-zinc-600 text-white" 
            : "bg-red-500/20 hover:bg-red-500/30 text-red-400",
        feature: isActive
            ? "bg-primary hover:bg-primary/80 text-white"
            : "bg-zinc-700 hover:bg-zinc-600 text-zinc-300"
    };

    return (
        <button
            onClick={onClick}
            className={cn(baseClasses, variantClasses[variant])}
            title={tooltip}
        >
            {isActive ? activeIcon : inactiveIcon}
        </button>
    );
}

// Video Renderer Component
function VideoRenderer({ stream, muted }: { stream: MediaStream; muted: boolean }) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
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
