'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { transactionService } from '@/lib/services/transaction.service';
import { useAuthStore } from '@/stores/auth.store';

interface TransferCreditsDialogProps {
    trigger?: React.ReactNode;
    onSuccess?: () => void;
}

export function TransferCreditsDialog({ trigger, onSuccess }: TransferCreditsDialogProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [recipientId, setRecipientId] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const { user } = useAuthStore();
    const currentBalance = user?.credit_balance || 0;

    const handleTransfer = async () => {
        // Reset states
        setError(null);
        setSuccess(false);

        // Validation
        if (!recipientId || !amount) {
            setError('Please fill in all required fields');
            return;
        }

        const recipientIdNum = parseInt(recipientId);
        const amountNum = parseFloat(amount);

        if (isNaN(recipientIdNum) || recipientIdNum <= 0) {
            setError('Please enter a valid recipient ID');
            return;
        }

        if (isNaN(amountNum) || amountNum <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        // Check if user has sufficient balance
        if (amountNum > currentBalance) {
            setError(
                `Insufficient credits! You have ${currentBalance.toFixed(1)} credits, but need ${amountNum.toFixed(1)} credits.`
            );
            return;
        }

        // Check if transferring to self
        if (user && recipientIdNum === user.id) {
            setError('You cannot transfer credits to yourself');
            return;
        }

        setIsLoading(true);

        try {
            const response = await transactionService.transferCredits(
                recipientIdNum,
                amountNum,
                message || undefined
            );

            setSuccess(true);
            toast.success('Transfer Successful! ✅', {
                description: `You sent ${amountNum.toFixed(1)} credits. New balance: ${response.new_balance.toFixed(1)} credits`,
            });

            // Reset form
            setTimeout(() => {
                setRecipientId('');
                setAmount('');
                setMessage('');
                setOpen(false);
                setSuccess(false);
                
                // Callback for parent component
                if (onSuccess) {
                    onSuccess();
                }
            }, 1500);
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || err.message || 'Failed to transfer credits';
            
            // Check for specific error types
            if (errorMessage.includes('insufficient credits')) {
                setError(errorMessage);
                toast.error('Insufficient Credits', {
                    description: errorMessage,
                });
            } else if (errorMessage.includes('recipient not found')) {
                setError('Recipient not found. Please check the user ID.');
                toast.error('Recipient Not Found', {
                    description: 'The user ID you entered does not exist.',
                });
            } else if (errorMessage.includes('recipient account is not active')) {
                setError('Recipient account is not active.');
                toast.error('Inactive Account', {
                    description: 'The recipient account is not active.',
                });
            } else {
                setError(errorMessage);
                toast.error('Transfer Failed', {
                    description: errorMessage,
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleAmountChange = (value: string) => {
        setAmount(value);
        setError(null); // Clear error when user types
        
        // Real-time balance check
        const amountNum = parseFloat(value);
        if (!isNaN(amountNum) && amountNum > currentBalance) {
            setError(
                `Insufficient credits! You have ${currentBalance.toFixed(1)} credits, but need ${amountNum.toFixed(1)} credits.`
            );
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" className="gap-2">
                        <Send className="h-4 w-4" />
                        Transfer Credits
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Transfer Credits</DialogTitle>
                    <DialogDescription>
                        Send credits to another user. Your current balance: <span className="font-semibold text-primary">{currentBalance.toFixed(1)} credits</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Success Alert */}
                    {success && (
                        <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-800 dark:text-green-200">
                                Transfer successful! Credits have been sent.
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Error Alert */}
                    {error && !success && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Recipient ID */}
                    <div className="space-y-2">
                        <Label htmlFor="recipient-id">
                            Recipient User ID <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="recipient-id"
                            type="number"
                            placeholder="Enter user ID"
                            value={recipientId}
                            onChange={(e) => {
                                setRecipientId(e.target.value);
                                setError(null);
                            }}
                            disabled={isLoading || success}
                            min="1"
                        />
                        <p className="text-xs text-muted-foreground">
                            You can find user IDs on their profile page
                        </p>
                    </div>

                    {/* Amount */}
                    <div className="space-y-2">
                        <Label htmlFor="amount">
                            Amount (Credits) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="amount"
                            type="number"
                            placeholder="0.0"
                            value={amount}
                            onChange={(e) => handleAmountChange(e.target.value)}
                            disabled={isLoading || success}
                            min="0.1"
                            step="0.5"
                        />
                        {amount && parseFloat(amount) > 0 && (
                            <p className="text-xs text-muted-foreground">
                                New balance after transfer: <span className="font-semibold">
                                    {(currentBalance - parseFloat(amount)).toFixed(1)} credits
                                </span>
                            </p>
                        )}
                    </div>

                    {/* Message (Optional) */}
                    <div className="space-y-2">
                        <Label htmlFor="message">Message (Optional)</Label>
                        <Textarea
                            id="message"
                            placeholder="Add a message to the recipient..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            disabled={isLoading || success}
                            maxLength={500}
                            rows={3}
                        />
                        <p className="text-xs text-muted-foreground text-right">
                            {message.length}/500 characters
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleTransfer}
                        disabled={isLoading || success || !recipientId || !amount}
                        className="gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Transferring...
                            </>
                        ) : success ? (
                            <>
                                <CheckCircle2 className="h-4 w-4" />
                                Sent!
                            </>
                        ) : (
                            <>
                                <Send className="h-4 w-4" />
                                Send Credits
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
