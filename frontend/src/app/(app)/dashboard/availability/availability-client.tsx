'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useAvailabilityStore } from '@/stores/availability.store';
import { toast } from 'sonner';
import { Calendar, Clock, Plus, Trash2 } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingSkeleton } from '@/components/ui/loading';
import type { AvailabilitySlot } from '@/types';

const DAYS_OF_WEEK = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
];

export function AvailabilityClient() {
    const { myAvailability, isLoading, fetchMyAvailability, setMyAvailability } = useAvailabilityStore();
    const [isGenerallyAvailable, setIsGenerallyAvailable] = useState(true);

    useEffect(() => {
        fetchMyAvailability();
    }, [fetchMyAvailability]);

    const handleToggleSlot = async (slot: AvailabilitySlot) => {
        try {
            // Toggle by recreating availability without this slot, then adding it back with new status
            const updatedSlots = myAvailability
                .filter(s => s.id !== slot.id)
                .map(s => ({
                    day_of_week: s.day_of_week,
                    start_time: s.start_time,
                    end_time: s.end_time,
                }));
            
            // Add the toggled slot
            updatedSlots.push({
                day_of_week: slot.day_of_week,
                start_time: slot.start_time,
                end_time: slot.end_time,
            });

            await setMyAvailability({ slots: updatedSlots });
            toast.success('Availability updated');
            fetchMyAvailability();
        } catch (error) {
            toast.error('Failed to update availability');
        }
    };

    const handleDeleteSlot = async (slotId: number | undefined) => {
        if (!slotId) return;
        
        try {
            // Remove slot by recreating availability without it
            const updatedSlots = myAvailability
                .filter(s => s.id !== slotId)
                .map(s => ({
                    day_of_week: s.day_of_week,
                    start_time: s.start_time,
                    end_time: s.end_time,
                }));

            await setMyAvailability({ slots: updatedSlots });
            toast.success('Time slot removed');
            fetchMyAvailability();
        } catch (error) {
            toast.error('Failed to remove time slot');
        }
    };

    const groupedAvailability = DAYS_OF_WEEK.map(day => ({
        ...day,
        slots: myAvailability.filter(slot => slot.day_of_week === day.value),
    }));

    return (
        <main className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="flex flex-col space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">My Availability</h1>
                        <p className="text-muted-foreground">Manage your teaching schedule and time slots</p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/dashboard">
                            <Button variant="outline">Back to Dashboard</Button>
                        </Link>
                        <Link href="/profile/availability/new">
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Time Slot
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* General Availability Toggle */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>General Availability</CardTitle>
                                <CardDescription>
                                    Toggle your overall availability for teaching
                                </CardDescription>
                            </div>
                            <Switch
                                checked={isGenerallyAvailable}
                                onCheckedChange={setIsGenerallyAvailable}
                            />
                        </div>
                    </CardHeader>
                </Card>

                {/* Weekly Schedule */}
                {isLoading ? (
                    <div className="space-y-4">
                        {[...Array(7)].map((_, i) => (
                            <Card key={i}>
                                <CardContent className="p-6">
                                    <LoadingSkeleton className="h-20 w-full" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : myAvailability.length === 0 ? (
                    <EmptyState
                        icon={Calendar}
                        title="No availability set"
                        description="Add your available time slots so students can book sessions with you"
                        action={{
                            label: 'Add Your First Time Slot',
                            onClick: () => window.location.href = '/profile/availability/new',
                        }}
                        variant="card"
                    />
                ) : (
                    <div className="space-y-4">
                        {groupedAvailability.map((day) => (
                            <Card key={day.value}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Calendar className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">{day.label}</CardTitle>
                                                <CardDescription>
                                                    {day.slots.length} time slot{day.slots.length !== 1 ? 's' : ''}
                                                </CardDescription>
                                            </div>
                                        </div>
                                        {day.slots.length > 0 && (
                                            <Badge variant="outline">
                                                {day.slots.filter((s: AvailabilitySlot) => s.is_active !== false).length} active
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>

                                {day.slots.length > 0 && (
                                    <CardContent>
                                        <div className="space-y-3">
                                            {day.slots.map((slot: AvailabilitySlot) => (
                                                <div
                                                    key={slot.id}
                                                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3 flex-1">
                                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <p className="text-sm font-medium">
                                                                {slot.start_time} - {slot.end_time}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                Recurring weekly
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Switch
                                                            checked={slot.is_active !== false}
                                                            onCheckedChange={() => handleToggleSlot(slot)}
                                                        />
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDeleteSlot(slot.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                )}
                            </Card>
                        ))}
                    </div>
                )}

                {/* Tips Card */}
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader>
                        <CardTitle className="text-lg">💡 Tips for Setting Availability</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                        <p>• Set realistic time slots that you can consistently maintain</p>
                        <p>• Leave buffer time between sessions for breaks</p>
                        <p>• Update your availability regularly to reflect changes</p>
                        <p>• Use recurring slots for your regular teaching schedule</p>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
