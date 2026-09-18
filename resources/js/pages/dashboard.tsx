import { Head } from '@inertiajs/react';

interface Props {
    pesan: string;
}

export default function Dashboard({ pesan }: Props) {
    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border border-sidebar-border/70 dark:border-sidebar-border">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Selamat Datang, Admin!</h1>
                    <p className="text-gray-600 dark:text-gray-400">{pesan}</p>
                </div>
            </div>
        </>
    );
}

// Konfigurasi Layout & Breadcrumbs bawaan proyek
Dashboard.layout = () => ({
    breadcrumbs: [
        {
            title: 'Dashboard Admin',
            href: '/admin/dashboard',
        },
    ],
});