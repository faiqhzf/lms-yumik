import { Head, Link } from "@inertiajs/react";

interface Props {
    stats: { total_kelas: number; total_tugas: number };
    jadwal: Array<{
        id: string;
        subject: { name: string };
        classroom: { nama_kelas: string };
    }>;
    tugas_terbaru: Array<{
        id: string;
        judul: string;
        deadline: string;
        classroom: { nama_kelas: string };
        subject: { name: string };
    }>;
}

export default function Dashboard({ stats, jadwal, tugas_terbaru }: Props) {
    return (
        <>
            <Head title="Dashboard Guru" />

            <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Selamat Datang, Guru!
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Ringkasan aktivitas Kegiatan Belajar Mengajar Anda.
                    </p>
                </div>

                {/* Kartu Statistik */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-sidebar border border-sidebar-border/70 rounded-xl p-6 shadow-sm">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Kelas yang Diampu
                        </h3>
                        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                            {stats.total_kelas}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-sidebar border border-sidebar-border/70 rounded-xl p-6 shadow-sm">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Total Tugas KBM
                        </h3>
                        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                            {stats.total_tugas}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                    {/* Daftar Jadwal Mengajar */}
                    <div className="bg-white dark:bg-sidebar border border-sidebar-border/70 rounded-xl overflow-hidden shadow-sm">
                        <div className="p-4 border-b border-sidebar-border/70 bg-gray-50 dark:bg-black">
                            <h2 className="font-bold text-gray-900 dark:text-gray-100">
                                Jadwal Mengajar Anda
                            </h2>
                        </div>
                        <ul className="divide-y divide-sidebar-border/70 text-sm">
                            {jadwal.length > 0 ? (
                                jadwal.map((item) => (
                                    <li
                                        key={item.id}
                                        className="hover:bg-gray-50 dark:hover:bg-sidebar/50 transition-colors"
                                    >
                                        <Link
                                            href={`/guru/courses/${item.id}`}
                                            className="p-4 flex justify-between items-center w-full"
                                        >
                                            {/* Tambahkan Nama Pelajaran di Sini */}
                                            <span className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors">
                                                {item.subject?.name}
                                            </span>

                                            {/* Badge Nama Kelas */}
                                            <span className="bg-blue-100/10 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-medium">
                                                {item.classroom?.nama_kelas}
                                            </span>
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <li className="p-4 text-gray-500 italic">
                                    Belum ada penugasan kelas.
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Daftar Tugas Terbaru */}
                    <div className="bg-white dark:bg-sidebar border border-sidebar-border/70 rounded-xl overflow-hidden shadow-sm">
                        <div className="p-4 border-b border-sidebar-border/70 bg-gray-50 dark:bg-black flex justify-between items-center">
                            <h2 className="font-bold text-gray-900 dark:text-gray-100">
                                Tugas Terbaru
                            </h2>
                            <Link
                                href="/guru/assignments"
                                className="text-blue-600 dark:text-blue-400 text-xs hover:underline"
                            >
                                Lihat Semua
                            </Link>
                        </div>
                        <ul className="divide-y divide-sidebar-border/70 text-sm">
                            {tugas_terbaru.length > 0 ? (
                                tugas_terbaru.map((tugas) => (
                                    <li
                                        key={tugas.id}
                                        className="p-4 hover:bg-gray-50 dark:hover:bg-sidebar/50"
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-bold text-gray-900 dark:text-gray-100">
                                                {tugas.judul}
                                            </span>
                                            <span className="text-xs text-red-500 font-mono">
                                                Tenggat:{" "}
                                                {new Date(
                                                    tugas.deadline,
                                                ).toLocaleDateString("id-ID")}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 flex gap-2">
                                            <span>
                                                {tugas.subject?.name}
                                            </span>{" "}
                                            •{" "}
                                            <span>
                                                {tugas.classroom?.nama_kelas}
                                            </span>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <li className="p-4 text-gray-500 italic">
                                    Belum ada tugas yang dibuat.
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}
