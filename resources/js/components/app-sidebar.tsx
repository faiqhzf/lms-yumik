import { Link, usePage } from "@inertiajs/react";

// 1. Import semua icon yang dikirim dari backend Laravel (Duplikasi dihapus, BarChart2 ditambahkan)
import {
    BookOpen,
    FolderGit2,
    LayoutGrid,
    LayoutDashboard,
    Users,
    FileText,
    GraduationCap,
    Library,
    PenTool,
    BarChart2,
} from "lucide-react";

import AppLogo from "@/components/app-logo";
import { NavFooter } from "@/components/nav-footer";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { NavItem } from "@/types";

// 2. Bikin kamus penerjemah String dari Laravel -> Komponen React
const IconMap: Record<string, any> = {
    LayoutDashboard,
    Users,
    BookOpen,
    FileText,
    GraduationCap,
    Library,
    PenTool,
    LayoutGrid,
    BarChart2, // Tambahkan ini untuk menu Laporan
};

export function AppSidebar() {
    // 3. INI DIA hook usePage() untuk menangkap data 'nav_menu' dari HandleInertiaRequests.php
    const { props } = usePage<any>();
    const navMenuFromBackend = props.nav_menu || [];

    // 4. Ubah format data Laravel jadi format yang dimengerti NavMain.tsx
    const mainNavItems: NavItem[] = navMenuFromBackend.map((item: any) => ({
        title: item.title,
        href: item.url,
        icon: IconMap[item.icon] || LayoutGrid, // Pake LayoutGrid kalo icon gak ketemu
    }));

    const footerNavItems: NavItem[] = [
        {
            title: "Repository",
            href: "https://github.com/laravel/react-starter-kit",
            icon: FolderGit2,
        },
        {
            title: "Documentation",
            href: "https://laravel.com/docs/starter-kits#react",
            icon: BookOpen,
        },
    ];

    // Ambil URL dashboard dinamis untuk link Logo di pojok kiri atas
    const dynamicDashboardUrl =
        mainNavItems.length > 0 ? mainNavItems[0].href : "/";

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dynamicDashboardUrl} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
