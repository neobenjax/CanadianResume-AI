import { Sidebar } from '@/components/dashboard/Sidebar';
import { RouteGuard } from '@/components/auth/RouteGuard';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-slate-950 relative">
            {/* Mesh Gradient Overlay for Dashboard specifically if needed, but RootLayout has it */}
            <Sidebar />
            <main className="flex-1 p-6 md:p-10 h-screen overflow-y-auto">
                <RouteGuard>
                    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
                        {children}
                    </div>
                </RouteGuard>
            </main>
        </div>
    );
}
