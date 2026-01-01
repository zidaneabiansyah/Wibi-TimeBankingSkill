'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Mail, Phone, FileText, Bug, HelpCircle, ChevronDown, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqItems: FAQItem[] = [
  {
    id: 'how-start',
    question: 'How do I get started with Wibi Time Banking?',
    answer:
      "Getting started is easy! Sign up with your email, complete your profile with your skills and availability, and you're ready to share your expertise or learn from others. Browse the marketplace to find skills you want to learn or offer your own.",
    category: 'Getting Started',
  },
  {
    id: 'how-credits',
    question: 'How does the credit system work?',
    answer:
      'You earn credits by teaching or sharing your skills with others. Each hour of teaching typically earns you one credit. You can then spend those credits to learn from others. Credits are your currency in the time banking community.',
    category: 'Credits & Payments',
  },
  {
    id: 'how-book',
    question: 'How do I book a session with someone?',
    answer:
      'Find the skill you want to learn in the marketplace, click on the teacher\'s profile, check their availability, and click "Book Session". You\'ll receive a confirmation and a video session link. Make sure you have enough credits before booking.',
    category: 'Sessions',
  },
  {
    id: 'cancel-session',
    question: 'Can I cancel a session?',
    answer:
      'Yes, you can cancel sessions up to 24 hours before the scheduled time with no penalty. Cancellations made within 24 hours may result in credit deductions. Always check the cancellation policy.',
    category: 'Sessions',
  },
  {
    id: 'refund-credits',
    question: 'Can I get a refund for my credits?',
    answer:
      'Credits are non-refundable by design as they represent time value in our community. However, you can always use them to book sessions or transfer them through community initiatives. Contact support for special cases.',
    category: 'Credits & Payments',
  },
  {
    id: 'safety',
    question: 'How does Wibi ensure my safety?',
    answer:
      'We verify all users, conduct background checks for premium teachers, use secure video connections, and monitor all interactions. You can report inappropriate behavior, and our trust & safety team responds within 24 hours.',
    category: 'Safety & Trust',
  },
  {
    id: 'technical-issue',
    question: 'I\'m having technical issues with the video session',
    answer:
      'First, try refreshing your browser and checking your internet connection. Clear your browser cache and ensure your camera/microphone permissions are granted. For persistent issues, contact our technical support team with details about your device and browser.',
    category: 'Technical',
  },
  {
    id: 'upload-files',
    question: 'Can I share files or documents during a session?',
    answer:
      'Yes! You can upload and share documents, presentations, and images during your session. The teacher can also save these files for future reference. File size limit is 10MB per file.',
    category: 'Features',
  },
];

const contactMethods = [
  {
    icon: <Mail className="w-6 h-6" />,
    title: 'Email Support',
    description: 'Get help via email within 24 hours',
    contact: 'support@wibi.com',
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: 'Live Chat',
    description: 'Chat with our support team instantly',
    contact: 'Available 9 AM - 6 PM',
  },
  {
    icon: <Phone className="w-6 h-6" />,
    title: 'Phone Support',
    description: 'Call us for urgent matters',
    contact: '+1 (555) 000-0000',
  },
  {
    icon: <Bug className="w-6 h-6" />,
    title: 'Report a Bug',
    description: 'Help us improve by reporting issues',
    contact: 'bugs@wibi.com',
  },
];

const categories = ['All', ...new Set(faqItems.map((item) => item.category))];

export default function HelpPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const filteredFAQs =
    selectedCategory === 'All'
      ? faqItems
      : faqItems.filter((item) => item.category === selectedCategory);

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setContactForm({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4">
      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <HelpCircle className="w-16 h-16 text-orange-600 dark:text-orange-400" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Help & Support
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Find answers to common questions or reach out to our support team
          </p>
        </motion.div>

        {/* Quick Contact Methods */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {contactMethods.map((method, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="text-orange-600 dark:text-orange-400">{method.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                    {method.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    {method.description}
                  </p>
                  <a
                    href="#"
                    className="text-sm font-medium text-orange-600 dark:text-orange-400 hover:underline"
                  >
                    {method.contact}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* FAQ Section */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Frequently Asked Questions
            </h2>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-orange-600 dark:bg-orange-700 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* FAQ Items */}
            <div className="space-y-3">
              {filteredFAQs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <button
                    onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {faq.question}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {faq.category}
                      </p>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-600 dark:text-slate-400 transition-transform ${
                        expandedId === faq.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {expandedId === faq.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-slate-50 dark:bg-slate-700/30 border-t border-slate-200 dark:border-slate-700 p-4"
                    >
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Contact Support
          </h2>

          <form onSubmit={handleSubmitContact} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Full Name
                </label>
                <Input
                  type="text"
                  value={contactForm.name}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, name: e.target.value })
                  }
                  placeholder="Your name"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, email: e.target.value })
                  }
                  placeholder="your@email.com"
                  required
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Subject
              </label>
              <Input
                type="text"
                value={contactForm.subject}
                onChange={(e) =>
                  setContactForm({ ...contactForm, subject: e.target.value })
                }
                placeholder="How can we help?"
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Message
              </label>
              <textarea
                value={contactForm.message}
                onChange={(e) =>
                  setContactForm({ ...contactForm, message: e.target.value })
                }
                placeholder="Describe your issue in detail..."
                rows={5}
                required
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex items-center gap-4">
              <Button
                type="submit"
                disabled={formSubmitted}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2"
              >
                {formSubmitted ? 'Sending...' : 'Send Message'}
              </Button>

              {formSubmitted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-green-600 dark:text-green-400 text-sm font-medium"
                >
                  ✓ Message sent! We'll reply within 24 hours.
                </motion.div>
              )}
            </div>
          </form>
        </motion.div>

        {/* Additional Resources */}
        <motion.div variants={itemVariants} className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="#"
            className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:shadow-md transition-shadow"
          >
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <div>
              <p className="font-semibold text-blue-900 dark:text-blue-100">Documentation</p>
              <p className="text-xs text-blue-700 dark:text-blue-300">Read our guides</p>
            </div>
            <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400 ml-auto" />
          </a>

          <a
            href="#"
            className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:shadow-md transition-shadow"
          >
            <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0" />
            <div>
              <p className="font-semibold text-purple-900 dark:text-purple-100">Community</p>
              <p className="text-xs text-purple-700 dark:text-purple-300">Ask the community</p>
            </div>
            <ExternalLink className="w-4 h-4 text-purple-600 dark:text-purple-400 ml-auto" />
          </a>

          <a
            href="#"
            className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:shadow-md transition-shadow"
          >
            <Bug className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-900 dark:text-green-100">Status Page</p>
              <p className="text-xs text-green-700 dark:text-green-300">System status</p>
            </div>
            <ExternalLink className="w-4 h-4 text-green-600 dark:text-green-400 ml-auto" />
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
