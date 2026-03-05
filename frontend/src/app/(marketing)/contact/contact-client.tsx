'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

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

        if (!formData.name || !formData.email || !formData.message) {
            toast.error('Please fill in required fields');
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-foreground">
                        Your Name
                    </label>
                    <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className="bg-muted/30 border-none rounded-xl h-12 focus-visible:ring-1 focus-visible:ring-primary shadow-none px-4"
                        disabled={isSubmitting}
                    />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-foreground">
                        Email address
                    </label>
                    <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Your email address"
                        className="bg-muted/30 border-none rounded-xl h-12 focus-visible:ring-1 focus-visible:ring-primary shadow-none px-4"
                        disabled={isSubmitting}
                    />
                </div>
            </div>

            {/* Subject - Optional but keeping it to match previous functionality if needed, or hide it to strictly match image? The image just had Name, Email, Message. I'll change it to match the image precisely. */}

            {/* Message */}
            <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-foreground">
                    Message
                </label>
                <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write something..."
                    rows={8}
                    className="w-full px-4 py-3 bg-muted/30 border-none rounded-2xl text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 resize-none shadow-none"
                    disabled={isSubmitting}
                />
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12 rounded-full mt-2 transition-transform hover:scale-[1.02]"
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="animate-spin h-5 w-5 mr-2" />
                        Sending...
                    </>
                ) : (
                    'Send Message'
                )}
            </Button>
        </form>
    );
}
