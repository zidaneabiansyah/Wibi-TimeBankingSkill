'use client';

import { useEffect, useState } from 'react';
import { useTemplateStore } from '@/stores';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
    Loader2, 
    Plus, 
    Edit, 
    Trash2, 
    Clock, 
    Globe, 
    MapPin, 
    FileText,
    MoreVertical
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { TemplateForm } from './TemplateForm';
import { SessionTemplate } from '@/types';
import { Badge } from '@/components/ui/badge';

export function TemplateList() {
    const { templates, isLoading, fetchTemplates, deleteTemplate } = useTemplateStore();
    const [selectedTemplate, setSelectedTemplate] = useState<SessionTemplate | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this template?')) {
            await deleteTemplate(id);
        }
    };

    if (isLoading && templates.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading templates...</p>
            </div>
        );
    }

    if (templates.length === 0) {
        return (
            <div className="bg-muted/10 border-2 border-dashed border-muted/30 rounded-3xl p-12 text-center space-y-4">
                <div className="bg-muted/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                    <h3 className="text-xl font-bold">No templates found</h3>
                    <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                        Create reusable session configurations to save time when offering your skills.
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-full px-8">
                            <Plus className="h-4 w-4 mr-2" />
                            Create First Template
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Create New Template</DialogTitle>
                        </DialogHeader>
                        <TemplateForm onSuccess={() => setIsDialogOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Your Templates ({templates.length})</h2>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) setSelectedTemplate(null);
                }}>
                    <DialogTrigger asChild>
                        <Button size="sm" className="rounded-full">
                            <Plus className="h-4 w-4 mr-2" />
                            New Template
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>{selectedTemplate ? 'Edit Template' : 'Create New Template'}</DialogTitle>
                        </DialogHeader>
                        <TemplateForm 
                            template={selectedTemplate || undefined} 
                            onSuccess={() => setIsDialogOpen(false)} 
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                    <Card key={template.id} className="relative group overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                                <Badge variant="secondary" className="mb-2">
                                    {template.user_skill?.skill?.name || 'General'}
                                </Badge>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => {
                                            setSelectedTemplate(template);
                                            setIsDialogOpen(true);
                                        }}>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(template.id)}>
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <CardTitle className="text-lg line-clamp-1">{template.title}</CardTitle>
                            <CardDescription className="line-clamp-2 h-10">
                                {template.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-4 space-y-3">
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="h-4 w-4 mr-2 text-primary/70" />
                                {template.duration} Hours
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Globe className="h-4 w-4 mr-2 text-primary/70" />
                                {template.mode.charAt(0) + template.mode.slice(1)}
                            </div>
                            {(template.location || template.meeting_link) && (
                                <div className="flex items-center text-sm text-muted-foreground truncate">
                                    <MapPin className="h-4 w-4 mr-2 text-primary/70" />
                                    {template.location || template.meeting_link}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="pt-0">
                            <Button 
                                variant="ghost" 
                                className="w-full text-xs text-primary hover:text-primary hover:bg-primary/5"
                                onClick={() => {
                                    setSelectedTemplate(template);
                                    setIsDialogOpen(true);
                                }}
                            >
                                View Details & Edit
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
