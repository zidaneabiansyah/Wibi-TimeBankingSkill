import { AdminProvider } from "@/components/auth/AdminProvider";
import { Header } from "@/components/layout";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminProvider>
            <div className="min-h-screen bg-background">
                <Header />
                {children}
            </div>
        </AdminProvider>
    );
}
