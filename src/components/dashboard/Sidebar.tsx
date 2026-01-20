'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, User, Settings, FileText, LogOut, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NorthernButton } from '@/components/ui/NorthernButton';

const NAV_ITEMS = [
    { label: 'My Resumes', href: '/dashboard', icon: FileText },
    { label: 'My Profile', href: '/wizard', icon: User }, // Reuse wizard as profile editor
    { label: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-sidebar text-sidebar-foreground flex-shrink-0 hidden md:flex flex-col h-screen sticky top-0 border-r border-white/10">
            <div className="p-8">
                <h1 className="text-2xl font-bold tracking-tight text-white">
                    MapleLeaf<span className="text-primary-400">.</span>
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-primary-600/20 text-white shadow-glow-primary border border-primary-500/20"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Icon className={cn("w-5 h-5", isActive ? "text-primary-400" : "text-slate-500 group-hover:text-primary-400")} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/5">
                <NorthernButton variant="secondary" className="w-full justify-start pl-4" onClick={() => { }}>
                    <PlusCircle className="w-5 h-5 mr-2" /> New Resume
                </NorthernButton>
            </div>
        </aside>
    );
}
