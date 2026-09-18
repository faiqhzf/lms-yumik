import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";

interface Exam {
    id: string;
    judul: string;
    waktu_buka: string;
    waktu_tutup: string;
    durasi_menit: number;
    teaching_schedule: { subject: { name: string } };
    sessions: {
        status: string;
        nilai_pg: number | null;
        nilai_essay: number | null;
    }[];
}

interface Props {
    exams: Exam[];
    now: string;
}

export default function Index({ exams, now }: Props) {
    const currentTime = new Date(now).getTime();

    return (
        <>
            <Head title="Daftar Ujian" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 sm:p-6 lg:p-8 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Evaluasi & Ujian
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Daftar ujian yang tersedia untuk kelas Anda.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {exams.length > 0 ? (
                        exams.map((exam) => {
                            const buka = new Date(exam.waktu_buka).getTime();
                            const tutup = new Date(exam.waktu_tutup).getTime();
                            const isOpen =
                                currentTime >= buka && currentTime <= tutup;
                            const isPast = currentTime > tutup;
                            const session = exam.sessions[0]; // Maksimal 1 sesi per siswa

                            let statusBadge = (
                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">
                                    Belum Waktunya
                                </span>
                            );
                            let actionBtn = (
                                <button
                                    disabled
                                    className="w-full py-2 bg-gray-200 text-gray-500 rounded-lg text-sm font-bold"
                                >
                                    Terkunci
                                </button>
                            );

                            if (session) {
                                if (session.status === "selesai") {
                                    statusBadge = (
                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
                                            Selesai
                                        </span>
                                    );
                                    actionBtn = (
                                        <button
                                            disabled
                                            className="w-full py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 rounded-lg text-sm font-bold"
                                        >
                                            Skor PG: {session.nilai_pg ?? 0}
                                        </button>
                                    );
                                } else if (session.status === "berjalan") {
                                    statusBadge = (
                                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold">
                                            Sedang Dikerjakan
                                        </span>
                                    );
                                    actionBtn = (
                                        <Link
                                            href={`/siswa/exams/${exam.id}/take`}
                                            className="block text-center w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-bold"
                                        >
                                            Lanjutkan Ujian
                                        </Link>
                                    );
                                }
                            } else if (isOpen) {
                                statusBadge = (
                                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                                        Tersedia
                                    </span>
                                );
                                actionBtn = (
                                    <Link
                                        href={`/siswa/exams/${exam.id}/take`}
                                        className="block text-center w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold"
                                    >
                                        Mulai Kerjakan
                                    </Link>
                                );
                            } else if (isPast) {
                                statusBadge = (
                                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">
                                        Ditutup
                                    </span>
                                );
                                actionBtn = (
                                    <button
                                        disabled
                                        className="w-full py-2 bg-gray-200 text-gray-500 rounded-lg text-sm font-bold"
                                    >
                                        Waktu Habis
                                    </button>
                                );
                            }

                            return (
                                <div
                                    key={exam.id}
                                    className="bg-white dark:bg-sidebar border border-gray-200 dark:border-sidebar-border rounded-xl p-5 shadow-sm flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                                                {
                                                    exam.teaching_schedule
                                                        .subject.name
                                                }
                                            </div>
                                            {statusBadge}
                                        </div>
                                        <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight mb-2">
                                            {exam.judul}
                                        </h3>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mb-6">
                                            <p>
                                                🕒 Durasi: {exam.durasi_menit}{" "}
                                                Menit
                                            </p>
                                            <p>
                                                📅 Buka:{" "}
                                                {new Date(
                                                    exam.waktu_buka,
                                                ).toLocaleString("id-ID")}
                                            </p>
                                            <p>
                                                ⏳ Tutup:{" "}
                                                {new Date(
                                                    exam.waktu_tutup,
                                                ).toLocaleString("id-ID")}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-auto">{actionBtn}</div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full text-center py-12 bg-white dark:bg-sidebar rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-500">
                                Tidak ada jadwal ujian saat ini.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Index.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
