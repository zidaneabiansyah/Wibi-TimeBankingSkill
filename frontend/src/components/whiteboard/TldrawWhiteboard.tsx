'use client';

import { useCallback, useEffect, useState } from 'react';
import { 
    Tldraw, 
    useEditor,
    Editor,
    TLRecord,
    StoreSnapshot,
    loadSnapshot,
    getSnapshot,
    HistoryEntry
} from 'tldraw';
import 'tldraw/tldraw.css';
import { whiteboardService } from '@/lib/services/whiteboard.service';
import { useWhiteboardWebSocket } from '@/lib/hooks/useWhiteboardWebSocket';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Save, Download, Trash2, Loader2, Wifi, WifiOff } from 'lucide-react';

interface TldrawWhiteboardProps {
    sessionId: number;
    isReadOnly?: boolean;
}

// Inner component that has access to editor
function WhiteboardControls({ 
    sessionId, 
    isReadOnly, 
    onSave,
    onClear,
    onDownload,
    isSaving,
    isConnected
}: {
    sessionId: number;
    isReadOnly: boolean;
    onSave: () => void;
    onClear: () => void;
    onDownload: () => void;
    isSaving: boolean;
    isConnected: boolean;
}) {
    return (
        <div className="absolute top-2 right-2 z-50 flex items-center gap-2 bg-white/90 backdrop-blur rounded-lg p-2 shadow-lg border border-border">
            {/* Connection Status */}
            <div 
                className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                style={{ 
                    backgroundColor: isConnected ? '#dcfce7' : '#fee2e2', 
                    color: isConnected ? '#166534' : '#991b1b' 
                }}
            >
                {isConnected ? (
                    <>
                        <Wifi className="h-3 w-3" />
                        Live
                    </>
                ) : (
                    <>
                        <WifiOff className="h-3 w-3" />
                        Offline
                    </>
                )}
            </div>

            <div className="w-px h-6 bg-border" />

            <Button
                variant="outline"
                size="sm"
                onClick={onClear}
                disabled={isReadOnly || isSaving}
                title="Clear canvas"
            >
                <Trash2 className="h-4 w-4" />
            </Button>

            <Button
                variant="outline"
                size="sm"
                onClick={onDownload}
                disabled={isSaving}
                title="Download as PNG"
            >
                <Download className="h-4 w-4" />
            </Button>

            <Button
                size="sm"
                onClick={onSave}
                disabled={isReadOnly || isSaving}
            >
                {isSaving ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                    </>
                ) : (
                    <>
                        <Save className="mr-2 h-4 w-4" />
                        Save
                    </>
                )}
            </Button>
        </div>
    );
}

export function TldrawWhiteboard({ sessionId, isReadOnly = false }: TldrawWhiteboardProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [editor, setEditor] = useState<Editor | null>(null);
    const [initialSnapshot, setInitialSnapshot] = useState<StoreSnapshot<TLRecord> | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Callback when remote update is received
    const handleRemoteUpdate = useCallback((data: any) => {
        if (!editor) return;
        
        // Apply changes from remote
        editor.store.mergeRemoteChanges(() => {
            const { changes } = data;
            if (changes.added) editor.store.put(Object.values(changes.added) as any[]);
            if (changes.updated) {
                Object.values(changes.updated).forEach(([from, to]: any) => {
                    editor.store.put([to] as any[]);
                });
            }
            if (changes.removed) editor.store.remove(Object.keys(changes.removed) as any[]);
        });
    }, [editor]);

    const handleRemoteClear = useCallback(() => {
        if (!editor) return;
        const allShapeIds = editor.getCurrentPageShapeIds();
        if (allShapeIds.size > 0) {
            editor.deleteShapes(Array.from(allShapeIds));
        }
    }, [editor]);

    // WebSocket for real-time synchronization
    const { isConnected, sendUpdate, sendClear } = useWhiteboardWebSocket({
        sessionId,
        enabled: !isReadOnly,
        onUpdate: handleRemoteUpdate,
        onClear: handleRemoteClear
    });

    // Load existing whiteboard data
    useEffect(() => {
        const loadWhiteboard = async () => {
            try {
                setIsLoading(true);
                const whiteboard = await whiteboardService.getOrCreateWhiteboard(sessionId);
                
                if (whiteboard?.drawing_data && Object.keys(whiteboard.drawing_data).length > 0) {
                    // tldraw uses a specific format, so we store the snapshot directly
                    setInitialSnapshot(whiteboard.drawing_data as StoreSnapshot<TLRecord>);
                }
            } catch (error) {
                console.error('Failed to load whiteboard:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadWhiteboard();
    }, [sessionId]);

    // Restore snapshot when editor is ready and we have initial data
    useEffect(() => {
        if (editor && initialSnapshot) {
            try {
                loadSnapshot(editor.store, initialSnapshot);
            } catch (error) {
                console.error('Failed to restore whiteboard state:', error);
            }
        }
    }, [editor, initialSnapshot]);

    const handleSave = useCallback(async () => {
        if (!editor) return;

        try {
            setIsSaving(true);
            const snapshot = getSnapshot(editor.store);
            await whiteboardService.saveDrawing(sessionId, snapshot as Record<string, any>);
            toast.success('Whiteboard saved');
        } catch (error) {
            toast.error('Failed to save whiteboard');
            console.error('Save error:', error);
        } finally {
            setIsSaving(false);
        }
    }, [editor, sessionId]);

    const handleClear = useCallback(async () => {
        if (!editor) return;

        if (!confirm('Are you sure you want to clear the whiteboard?')) return;

        try {
            setIsSaving(true);
            // Select all and delete
            const allShapeIds = editor.getCurrentPageShapeIds();
            if (allShapeIds.size > 0) {
                editor.deleteShapes(Array.from(allShapeIds));
            }
            sendClear();
            await whiteboardService.clearWhiteboard(sessionId);
            toast.success('Whiteboard cleared');
        } catch (error) {
            toast.error('Failed to clear whiteboard');
        } finally {
            setIsSaving(false);
        }
    }, [editor, sessionId, sendClear]);

    const handleDownload = useCallback(async () => {
        if (!editor) return;

        try {
            const shapeIds = [...editor.getCurrentPageShapeIds()];
            if (shapeIds.length === 0) {
                toast.error('Nothing to download');
                return;
            }

            toast.loading('Preparing download...');
            const { blob } = await editor.toImage(shapeIds, {
                format: 'png',
                background: true,
                scale: 2,
                padding: 10,
            });

            // Download file
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `whiteboard-${sessionId}-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            toast.dismiss();
            toast.success('Whiteboard downloaded');
        } catch (error) {
            toast.dismiss();
            toast.error('Failed to download whiteboard');
            console.error('Download error:', error);
        }
    }, [editor, sessionId]);

    const handleMount = useCallback((editor: Editor) => {
        setEditor(editor);
        
        // Set read-only mode
        if (isReadOnly) {
            editor.updateInstanceState({ isReadonly: true });
            return;
        }

        // Listen for local changes to broadcast
        const unlisten = editor.store.listen((entry: HistoryEntry<TLRecord>) => {
            if (entry.source !== 'user') return; // only broadcast user changes
            
            // We only broadcast "changes" part of the entry
            sendUpdate({
                changes: entry.changes
            });
        }, { scope: 'document', source: 'user' });

        return unlisten;
    }, [isReadOnly, sendUpdate]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full bg-white rounded-lg shadow-lg">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                    <p className="text-muted-foreground">Loading whiteboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative h-[600px] w-full rounded-lg overflow-hidden shadow-lg border border-border">
            <WhiteboardControls
                sessionId={sessionId}
                isReadOnly={isReadOnly}
                onSave={handleSave}
                onClear={handleClear}
                onDownload={handleDownload}
                isSaving={isSaving}
                isConnected={isConnected}
            />
            
            <Tldraw
                onMount={handleMount}
                autoFocus
            />
        </div>
    );
}