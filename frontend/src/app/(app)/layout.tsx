import { ProtectedRoute } from "@/components/auth";
import { Header, Footer } from "@/components/layout";

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#0B0B0B] pt-[80px] flex flex-col">
                <Header />
                <div className="flex-1">
                    {children}
                </div>
                <Footer />
            </div>
        </ProtectedRoute>
    );
}
