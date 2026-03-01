export default function AuthLoading() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 animate-pulse">
                <div className="text-center space-y-4">
                    <div className="h-16 w-16 bg-muted rounded-2xl mx-auto" />
                    <div className="h-8 w-48 bg-muted rounded-lg mx-auto" />
                    <div className="h-4 w-64 bg-muted rounded-lg mx-auto" />
                </div>

                <div className="bg-card/50 border rounded-[2rem] p-8 space-y-6">
                    <div className="space-y-2">
                        <div className="h-4 w-20 bg-muted rounded" />
                        <div className="h-12 w-full bg-muted rounded-xl" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 w-20 bg-muted rounded" />
                        <div className="h-12 w-full bg-muted rounded-xl" />
                    </div>
                    <div className="h-12 w-full bg-primary/20 rounded-xl mt-4" />
                </div>

                <div className="h-4 w-40 bg-muted rounded mx-auto" />
            </div>
        </div>
    );
}
