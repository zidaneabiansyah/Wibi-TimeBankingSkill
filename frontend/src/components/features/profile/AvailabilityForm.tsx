'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAvailabilityStore } from "@/stores/availability.store";
import { toast } from 'sonner';
import { Plus, Trash2, Clock, CalendarDays, Save, AlertCircle } from 'lucide-react';
import type { AvailabilitySlot, SetAvailabilityRequest } from "@/types";

const DAYS_OF_WEEK = [
    { id: 0, name: 'Sunday' },
    { id: 1, name: 'Monday' },
    { id: 2, name: 'Tuesday' },
    { id: 3, name: 'Wednesday' },
    { id: 4, name: 'Thursday' },
    { id: 5, name: 'Friday' },
    { id: 6, name: 'Saturday' },
];

export function AvailabilityForm() {
    const { myAvailability, fetchMyAvailability, setMyAvailability, isLoading } = useAvailabilityStore();
    const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchMyAvailability();
    }, [fetchMyAvailability]);

    useEffect(() => {
        // Initialize local state from store
        if (myAvailability.length > 0) {
            setSlots(myAvailability.map(s => ({ ...s })));
        } else {
            // Default: if empty, maybe add some default slots or leave empty
            setSlots([]);
        }
    }, [myAvailability]);

    const handleAddSlot = (dayId: number) => {
        const newSlot: AvailabilitySlot = {
            day_of_week: dayId,
            start_time: '09:00',
            end_time: '17:00',
            is_active: true
        };
        setSlots([...slots, newSlot]);
    };

    const handleRemoveSlot = (index: number) => {
        const newSlots = [...slots];
        newSlots.splice(index, 1);
        setSlots(newSlots);
    };

    const handleUpdateSlot = (index: number, field: keyof AvailabilitySlot, value: any) => {
        const newSlots = [...slots];
        newSlots[index] = { ...newSlots[index], [field]: value };
        setSlots(newSlots);
    };

    const handleSave = async () => {
        // Validation
        const invalidSlots = slots.filter(s => s.start_time >= s.end_time);
        if (invalidSlots.length > 0) {
            toast.error("Start time must be before end time for all slots");
            return;
        }

        try {
            setIsSaving(true);
            const request: SetAvailabilityRequest = {
                slots: slots.map(s => ({
                    day_of_week: s.day_of_week,
                    start_time: s.start_time,
                    end_time: s.end_time
                }))
            };
            await setMyAvailability(request);
            toast.success('Availability updated successfully');
        } catch (error: any) {
            toast.error(error.message || 'Failed to update availability');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-primary" />
                    Weekly Availability
                </CardTitle>
                <CardDescription>
                    Set your available time slots for teaching. These will be visible to students in the marketplace.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {DAYS_OF_WEEK.map((day) => {
                    const daySlots = slots
                        .map((s, index) => ({ ...s, originalIndex: index }))
                        .filter(s => s.day_of_week === day.id);

                    return (
                        <div key={day.id} className="space-y-4 pb-6 border-b last:border-0 last:pb-0">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-lg">{day.name}</h3>
                                <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => handleAddSlot(day.id)}
                                    className="h-8 gap-1"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    Add Slot
                                </Button>
                            </div>

                            {daySlots.length === 0 ? (
                                <p className="text-sm text-muted-foreground italic">No availability set for this day.</p>
                            ) : (
                                <div className="space-y-3">
                                    {daySlots.map((slot) => (
                                        <div key={slot.originalIndex} className="flex flex-wrap items-end gap-4 bg-muted/30 p-4 rounded-lg">
                                            <div className="space-y-2 flex-1 min-w-[120px]">
                                                <Label className="text-xs uppercase text-muted-foreground">Start Time</Label>
                                                <div className="relative">
                                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input 
                                                        type="time" 
                                                        value={slot.start_time}
                                                        onChange={(e) => handleUpdateSlot(slot.originalIndex, 'start_time', e.target.value)}
                                                        className="pl-9"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2 flex-1 min-w-[120px]">
                                                <Label className="text-xs uppercase text-muted-foreground">End Time</Label>
                                                <div className="relative">
                                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input 
                                                        type="time" 
                                                        value={slot.end_time}
                                                        onChange={(e) => handleUpdateSlot(slot.originalIndex, 'end_time', e.target.value)}
                                                        className="pl-9"
                                                    />
                                                </div>
                                            </div>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => handleRemoveSlot(slot.originalIndex)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>

                                            {slot.start_time >= slot.end_time && (
                                                <div className="w-full text-xs text-destructive flex items-center gap-1 mt-1">
                                                    <AlertCircle className="h-3 w-3" />
                                                    End time must be after start time
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </CardContent>
            <CardFooter className="flex justify-between border-t p-6">
                <Button variant="outline" onClick={() => setSlots(myAvailability.map(s => ({ ...s })))}>
                    Discard Changes
                </Button>
                <Button onClick={handleSave} disabled={isSaving || isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
            </CardFooter>
        </Card>
    );
}
