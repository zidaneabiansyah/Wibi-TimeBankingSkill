import { ProtectedRoute } from "@/components/auth";
import { Header } from "@/components/layout";

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background">
                <Header />
                {children}
            </div>
        </ProtectedRoute>
    );
}
