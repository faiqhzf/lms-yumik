import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";

interface Props {
    jadwal: Array<{
        id: string;
        subject: { name: string };
        user: { name: string };
    }>;
    tugas_pending: Array<{
        id: string;
        judul: string;
        deadline: string;
        meeting: { teaching_schedule: { subject: { name: string } } };
    }>;
}

export default function Dashboard({ jadwal, tugas_pending }: Props) {
    return (
        <>
            <Head title="Dashboard Siswa" />
            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Halo, Pelajar!
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Siap untuk belajar hari ini?
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="font-bold text-lg text-gray-900 dark:text-white">
                            Kelas Saya
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {jadwal.length > 0 ? (
                                jadwal.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/siswa/courses/${item.id}`}
                                        className="bg-white dark:bg-sidebar border border-gray-200 dark:border-sidebar-border rounded-xl p-5 hover:shadow-md transition-all group"
                                    >
                                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                                            📚
                                        </div>
                                        <h3 className="font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600">
                                            {item.subject.name}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Guru: {item.user.name}
                                        </p>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-gray-500 italic">
                                    Belum ada kelas yang ditugaskan.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-sidebar border border-gray-200 dark:border-sidebar-border rounded-xl p-5 h-fit shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-bold text-gray-900 dark:text-white">
                                Tugas Belum Selesai
                            </h2>
                            <Link
                                href="/siswa/assignments"
                                className="text-blue-600 text-xs hover:underline"
                            >
                                Lihat Semua
                            </Link>
                        </div>
                        <ul className="space-y-3">
                            {tugas_pending.length > 0 ? (
                                tugas_pending.map((tugas) => (
                                    <li
                                        key={tugas.id}
                                        className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg"
                                    >
                                        <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 line-clamp-1">
                                            {tugas.judul}
                                        </h4>
                                        <p className="text-xs text-gray-500 mt-1 mb-2">
                                            {
                                                tugas.meeting.teaching_schedule
                                                    .subject.name
                                            }
                                        </p>
                                        <Link
                                            href="/siswa/assignments"
                                            className="text-xs font-medium text-red-600 dark:text-red-400 bg-white dark:bg-black px-2 py-1 rounded shadow-sm hover:underline"
                                        >
                                            Kumpulkan Segera
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 italic">
                                    Hebat! Semua tugas sudah diselesaikan.
                                </p>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
