'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { UserProfile } from '@/types';
import { Star, MessageSquare, Calendar, MapPin, GraduationCap } from 'lucide-react';
import { FavoriteButton } from './FavoriteButton';

interface FavoriteTeacherCardProps {
    teacher: UserProfile;
}

export function FavoriteTeacherCard({ teacher }: FavoriteTeacherCardProps) {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50 group">
            <CardContent className="p-0">
                <div className="relative">
                    <img
                        src={teacher.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${teacher.username}`}
                        alt={teacher.full_name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                        <FavoriteButton teacherId={teacher.id} />
                    </div>
                </div>

                <div className="p-5 space-y-4">
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="font-bold text-lg text-foreground truncate">{teacher.full_name}</h3>
                            <div className="flex items-center gap-1 text-amber-500">
                                <Star className="h-4 w-4 fill-current" />
                                <span className="text-sm font-bold">{teacher.average_rating_as_teacher.toFixed(1)}</span>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <GraduationCap className="h-3 w-3" />
                            {teacher.school} • {teacher.grade}
                        </p>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                        {teacher.bio || 'No bio available.'}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {teacher.total_sessions_as_teacher} Sessions
                        </div>
                        <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {teacher.location || 'Remote'}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                        <Link href={`/marketplace/teachers/${teacher.id}`}>
                            <Button variant="outline" size="sm" className="w-full text-xs h-9">
                                <Calendar className="h-3 w-3 mr-1.5" />
                                Book
                            </Button>
                        </Link>
                        <Link href={`/messages?user=${teacher.id}`}>
                            <Button variant="outline" size="sm" className="w-full text-xs h-9">
                                <MessageSquare className="h-3 w-3 mr-1.5" />
                                Message
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
