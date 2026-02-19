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
    
    const [viewMode, setViewMode] = useState<ViewMode>('video');
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // WebRTC hook - always enabled when classroom is open for voice/video communication
    // The hook internally manages its own connection lifecycle
    const { localStream, remoteStream, isJoined, error } = useWebRTC({
        sessionId,
        userId: user?.id || 0,
        enabled: true, // Always enabled for video/voice, regardless of view mode
    });

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
                {/* VIDEO MODE - Always render video components, visibility controlled by mode */}
                <div className={cn(
                    "absolute inset-0 transition-opacity duration-300",
                    viewMode === 'video' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                )}>
                    <VideoModeLayout
                        localStream={localStream}
                        remoteStream={remoteStream}
                        isVideoEnabled={isVideoEnabled}
                        userName={user?.full_name || 'You'}
                    />
                </div>

                {/* WHITEBOARD MODE - Only mount when in whiteboard mode for performance */}
                {viewMode === 'whiteboard' && (
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

// Video Mode Layout - side-by-side videos
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
        <div className="relative w-full h-full bg-zinc-950 flex items-center justify-center p-4 gap-4">
            {/* Partner Video - Large */}
            <div className="relative flex-1 max-w-[50%] aspect-video bg-zinc-900 rounded-xl overflow-hidden shadow-2xl border border-zinc-800">
                {remoteStream ? (
                    <VideoRenderer stream={remoteStream} muted={false} />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-400">
                        <div className="w-20 h-20 rounded-full bg-zinc-700 flex items-center justify-center mb-3">
                            <Users className="w-10 h-10 text-zinc-500" />
                        </div>
                        <span className="text-base font-medium">Waiting for partner...</span>
                        <span className="text-sm text-zinc-500 mt-1">They'll appear here when they join</span>
                    </div>
                )}
                {/* Partner Name Badge */}
                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur px-2.5 py-1 rounded-lg text-white text-sm font-medium">
                    Partner
                </div>
            </div>

            {/* Self Video - Large */}
            <div className="relative flex-1 max-w-[50%] aspect-video bg-zinc-900 rounded-xl overflow-hidden shadow-2xl border border-zinc-800">
                {localStream && isVideoEnabled ? (
                    <VideoRenderer stream={localStream} muted={true} mirrored={true} />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-500 bg-zinc-800">
                        <VideoOff className="w-10 h-10 mb-2" />
                        <span className="text-sm">Camera Off</span>
                    </div>
                )}
                {/* Self Name Badge */}
                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur px-2.5 py-1 rounded-lg text-white text-sm font-medium">
                    {userName}
                </div>
            </div>
        </div>
    );
}

// Whiteboard Mode Layout - whiteboard fullscreen, video small at bottom center
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
        <div className="relative w-full h-full">
            {/* Whiteboard Area - Full screen */}
            <div className="absolute inset-0 bg-white rounded-lg m-2 overflow-hidden shadow-inner">
                <TldrawWhiteboard sessionId={sessionId} />
            </div>

            {/* Video Overlay - Small, bottom center like Discord */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10">
                <div className="relative w-40 h-28 rounded-xl overflow-hidden bg-zinc-800 shadow-2xl border border-zinc-600 hover:scale-105 transition-transform cursor-pointer">
                    {/* Show remote stream if available, otherwise local */}
                    {remoteStream ? (
                        <VideoRenderer stream={remoteStream} muted={false} />
                    ) : localStream && isVideoEnabled ? (
                        <VideoRenderer stream={localStream} muted={true} mirrored={true} />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                            <Users className="w-6 h-6 mb-1" />
                            <span className="text-[10px]">No video</span>
                        </div>
                    )}
                    
                    {/* Name badge */}
                    <div className="absolute bottom-1.5 left-1.5 bg-black/70 px-2 py-0.5 rounded text-white text-[10px] font-medium flex items-center gap-1">
                        {remoteStream ? 'Partner' : userName.split(' ')[0]}
                    </div>
                    
                    {/* More options hint - like Discord */}
                    <div className="absolute top-1.5 right-1.5 bg-black/50 rounded p-1 opacity-0 hover:opacity-100 transition-opacity">
                        <Users className="w-3 h-3 text-white" />
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

// Video Renderer Component - Memoized to prevent re-renders
const VideoRenderer = React.memo(function VideoRenderer({ 
    stream, 
    muted,
    mirrored = false
}: { 
    stream: MediaStream; 
    muted: boolean;
    mirrored?: boolean;
}) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (video && stream) {
            // Only set srcObject if it's different
            if (video.srcObject !== stream) {
                video.srcObject = stream;
            }
        }
        
        return () => {
            // Cleanup on unmount
            if (video) {
                video.srcObject = null;
            }
        };
    }, [stream]);

    return (
        <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={muted}
            className={`w-full h-full object-cover ${mirrored ? 'scale-x-[-1]' : ''}`}
        />
    );
});
