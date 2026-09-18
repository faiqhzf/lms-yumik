import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import type { AppLayoutProps } from '@/types';

import {
    LayoutDashboard,
    FileText,
    GraduationCap,
    Library,
    PenTool,
} from "lucide-react";

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="min-w-0 overflow-x-clip">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}

const iconComponents: Record<string, React.ElementType> = {
    LayoutDashboard: LayoutDashboard,
    FileText: FileText,
    GraduationCap: GraduationCap,
    Library: Library,
    PenTool: PenTool,
};

