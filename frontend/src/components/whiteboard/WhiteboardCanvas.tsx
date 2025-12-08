'use client';

import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { useWhiteboardStore } from '@/stores/whiteboard.store';
import { whiteboardService } from '@/lib/services/whiteboard.service';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Trash2, RotateCcw, RotateCw, Download, Loader2 } from 'lucide-react';

interface WhiteboardCanvasProps {
    sessionId: number;
    isReadOnly?: boolean;
}

export function WhiteboardCanvas({ sessionId, isReadOnly = false }: WhiteboardCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const {
        currentTool,
        currentColor,
        currentThickness,
        setCurrentTool,
        setCurrentColor,
        setCurrentThickness,
        clearStrokes,
        undo,
        redo,
    } = useWhiteboardStore();

    // Initialize Fabric.js canvas
    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = new fabric.Canvas(canvasRef.current, {
            width: canvasRef.current.parentElement?.clientWidth || 800,
            height: canvasRef.current.parentElement?.clientHeight || 600,
            backgroundColor: '#ffffff',
            isDrawingMode: true,
        });

        fabricCanvasRef.current = canvas;

        // Load existing whiteboard data
        const loadWhiteboard = async () => {
            try {
                await whiteboardService.getOrCreateWhiteboard(sessionId);
            } catch (error) {
                console.error('Failed to load whiteboard:', error);
            }
        };

        loadWhiteboard();

        // Setup drawing mode
        if (!isReadOnly) {
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
            canvas.freeDrawingBrush.color = currentColor;
            canvas.freeDrawingBrush.width = currentThickness;
        }

        // Handle window resize
        const handleResize = () => {
            const container = canvasRef.current?.parentElement;
            if (container) {
                canvas.setWidth(container.clientWidth);
                canvas.setHeight(container.clientHeight);
                canvas.renderAll();
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            canvas.dispose();
        };
    }, [sessionId, isReadOnly]);

    // Update brush settings
    useEffect(() => {
        if (!fabricCanvasRef.current) return;

        const canvas = fabricCanvasRef.current;

        if (currentTool === 'pen') {
            canvas.isDrawingMode = true;
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
            canvas.freeDrawingBrush.color = currentColor;
            canvas.freeDrawingBrush.width = currentThickness;
        } else if (currentTool === 'eraser') {
            canvas.isDrawingMode = true;
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
            canvas.freeDrawingBrush.color = '#ffffff';
            canvas.freeDrawingBrush.width = currentThickness * 2;
        } else {
            canvas.isDrawingMode = false;
        }
    }, [currentTool, currentColor, currentThickness]);

    const handleClear = async () => {
        if (!fabricCanvasRef.current) return;

        try {
            setIsSaving(true);
            fabricCanvasRef.current.clear();
            await whiteboardService.clearWhiteboard(sessionId);
            clearStrokes();
            toast.success('Whiteboard cleared');
        } catch (error) {
            toast.error('Failed to clear whiteboard');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSave = async () => {
        if (!fabricCanvasRef.current) return;

        try {
            setIsSaving(true);
            const drawingData = fabricCanvasRef.current.toJSON();
            await whiteboardService.saveDrawing(sessionId, drawingData);
            toast.success('Whiteboard saved');
        } catch (error) {
            toast.error('Failed to save whiteboard');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDownload = () => {
        if (!fabricCanvasRef.current) return;

        const dataURL = fabricCanvasRef.current.toDataURL({
            format: 'png' as const,
            quality: 1,
            multiplier: 1,
            enableRetinaScaling: false,
        });

        const link = document.createElement('a');
        link.href = dataURL;
        link.download = `whiteboard-${sessionId}-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Whiteboard downloaded');
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
            {/* Toolbar */}
            <div className="flex items-center gap-2 p-4 border-b border-border bg-muted/50">
                {/* Tool Selection */}
                <div className="flex items-center gap-2">
                    <Button
                        variant={currentTool === 'pen' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentTool('pen')}
                        disabled={isReadOnly}
                        title="Pen tool"
                    >
                        ✏️
                    </Button>
                    <Button
                        variant={currentTool === 'eraser' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentTool('eraser')}
                        disabled={isReadOnly}
                        title="Eraser tool"
                    >
                        🧹
                    </Button>
                </div>

                {/* Divider */}
                <div className="w-px h-6 bg-border" />

                {/* Color Picker */}
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Color:</label>
                    <input
                        type="color"
                        value={currentColor}
                        onChange={(e) => setCurrentColor(e.target.value)}
                        disabled={isReadOnly || currentTool === 'eraser'}
                        className="w-8 h-8 rounded cursor-pointer"
                    />
                </div>

                {/* Thickness Slider */}
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Size:</label>
                    <input
                        type="range"
                        min="1"
                        max="20"
                        value={currentThickness}
                        onChange={(e) => setCurrentThickness(parseInt(e.target.value))}
                        disabled={isReadOnly}
                        className="w-24"
                    />
                    <span className="text-xs text-muted-foreground w-6">{currentThickness}</span>
                </div>

                {/* Divider */}
                <div className="w-px h-6 bg-border" />

                {/* Action Buttons */}
                <div className="flex items-center gap-2 ml-auto">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={undo}
                        disabled={isReadOnly}
                        title="Undo"
                    >
                        <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={redo}
                        disabled={isReadOnly}
                        title="Redo"
                    >
                        <RotateCw className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClear}
                        disabled={isReadOnly || isSaving}
                        title="Clear canvas"
                    >
                        {isSaving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Trash2 className="h-4 w-4" />
                        )}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                        disabled={isSaving}
                        title="Download as PNG"
                    >
                        <Download className="h-4 w-4" />
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={isReadOnly || isSaving}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Save'
                        )}
                    </Button>
                </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 overflow-hidden">
                <canvas
                    ref={canvasRef}
                    className="w-full h-full"
                    style={{ display: 'block' }}
                />
            </div>
        </div>
    );
}
