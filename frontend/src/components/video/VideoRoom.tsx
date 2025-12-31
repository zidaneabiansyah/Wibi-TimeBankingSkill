'use client';

import { JitsiMeeting } from '@jitsi/react-sdk';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useState } from 'react';

interface VideoRoomProps {
    roomName: string;
    jwt?: string;
    onApiReady?: (api: any) => void;
    onReadyToClose?: () => void;
    height?: string | number;
}

export function VideoRoom({ 
    roomName, 
    jwt, 
    onApiReady, 
    onReadyToClose,
    height = 600 
}: VideoRoomProps) {
    const { user } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);

    if (!user) return null;

    return (
        <div className="relative w-full rounded-lg overflow-hidden bg-black" style={{ height }}>
            {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 bg-zinc-900">
                    <Loader2 className="h-8 w-8 animate-spin mb-2" />
                    <p>Connecting to secure video room...</p>
                </div>
            )}
            
            <JitsiMeeting
                domain="meet.jit.si"
                roomName={roomName}
                jwt={jwt}
                configOverwrite={{
                    startWithAudioMuted: true,
                    disableModeratorIndicator: true,
                    startScreenSharing: true,
                    enableEmailInStats: false,
                    prejoinPageEnabled: false, // Skip prejoin for smoother experience if desired, or true for checks
                }}
                interfaceConfigOverwrite={{
                    DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                    ShowJitsiWatermark: false,
                    SHOW_JITSI_WATERMARK: false,
                    SHOW_WATERMARK_FOR_GUESTS: false,
                    TOOLBAR_BUTTONS: [
                        'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                        'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
                        'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
                        'videoquality', 'filmstrip', 'feedback', 'stats', 'shortcuts',
                        'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
                        'security'
                    ],
                }}
                userInfo={{
                    displayName: user.full_name,
                    email: user.email,
                }}
                onApiReady={(externalApi) => {
                    setIsLoading(false);
                    // externalApi.executeCommand('toggleChat');
                    if (onApiReady) onApiReady(externalApi);
                }}
                onReadyToClose={onReadyToClose}
                getIFrameRef={(iframeRef) => {
                    iframeRef.style.height = '100%';
                    iframeRef.style.width = '100%';
                }}
            />
        </div>
    );
}
