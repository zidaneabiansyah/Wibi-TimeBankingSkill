'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { toast } from 'sonner';

export function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            toast.error('Please fill in all fields');
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success('Message sent successfully! We\'ll get back to you soon.');
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: '',
            });
        } catch (error) {
            toast.error('Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                </label>
                <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="bg-muted/50"
                    disabled={isSubmitting}
                />
            </div>

            {/* Email */}
            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                </label>
                <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="bg-muted/50"
                    disabled={isSubmitting}
                />
            </div>

            {/* Subject */}
            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Subject
                </label>
                <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-muted/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                    disabled={isSubmitting}
                >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="bug">Report a Bug</option>
                    <option value="feature">Feature Request</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                </select>
            </div>

            {/* Message */}
            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Message
                </label>
                <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us what's on your mind..."
                    rows={6}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-muted/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 resize-none"
                    disabled={isSubmitting}
                />
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <>
                        <span className="animate-spin mr-2">⏳</span>
                        Sending...
                    </>
                ) : (
                    <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                    </>
                )}
            </Button>
        </form>
    );
}
