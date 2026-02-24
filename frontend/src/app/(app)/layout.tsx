import { ProtectedRoute } from "@/components/auth";
import { Header } from "@/components/layout";

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background pt-[80px] pb-12 flex flex-col">
                <Header />
                <div className="flex-1">
                    {children}
                </div>
            </div>
        </ProtectedRoute>
    );
}
