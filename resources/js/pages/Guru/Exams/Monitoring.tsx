import { useState, FormEvent } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";

interface MonitoringData {
    user_id: string;
    name: string;
    session_id: string | null;
    status: "belum_mulai" | "berjalan" | "selesai";
    waktu_mulai: string | null;
    waktu_selesai: string | null;
    nilai_pg: number | null;
    nilai_essay: number | null;
    file_upload: string | null;
    total_nilai: number;
}

interface Props {
    exam: {
        id: string;
        judul: string;
        izinkan_upload: boolean;
        teaching_schedule: {
            subject: { name: string };
            classroom: { nama_kelas: string };
        };
    };
    monitoringData: MonitoringData[];
}

export default function Monitoring({ exam, monitoringData }: Props) {
    const [gradingModal, setGradingModal] = useState<{
        isOpen: boolean;
        data: MonitoringData | null;
    }>({ isOpen: false, data: null });

    const { data, setData, put, processing, reset } = useForm({
        nilai_essay: "",
    });

    const openGradeModal = (student: MonitoringData) => {
        setData(
            "nilai_essay",
            student.nilai_essay ? student.nilai_essay.toString() : "",
        );
        setGradingModal({ isOpen: true, data: student });
    };

    const submitGrade = (e: FormEvent) => {
        e.preventDefault();
        if (gradingModal.data?.session_id) {
            put(`/guru/exams/sessions/${gradingModal.data.session_id}`, {
                onSuccess: () => {
                    setGradingModal({ isOpen: false, data: null });
                    reset();
                },
            });
        }
    };

    return (
        <>
            <Head title={`Monitoring: ${exam.judul}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 sm:p-6 lg:p-8 space-y-6">
                <div>
                    <Link
                        href="/guru/exams"
                        className="text-sm text-blue-600 hover:underline mb-1 block"
                    >
                        &larr; Kembali ke Daftar Ujian
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Monitoring: {exam.judul}
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {exam.teaching_schedule.subject.name} -{" "}
                        {exam.teaching_schedule.classroom.nama_kelas}
                    </p>
                </div>

                <div className="bg-white dark:bg-sidebar border border-sidebar-border/70 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                            <thead className="bg-gray-50 dark:bg-black border-b border-sidebar-border/70 text-gray-900 dark:text-gray-100 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">
                                        Nama Siswa
                                    </th>
                                    <th className="px-6 py-4 font-semibold text-center">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 font-semibold text-center">
                                        Skor PG
                                    </th>
                                    {exam.izinkan_upload && (
                                        <th className="px-6 py-4 font-semibold text-center">
                                            Nilai Essay
                                        </th>
                                    )}
                                    <th className="px-6 py-4 font-semibold text-center">
                                        Total Akhir
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border/70">
                                {monitoringData.map((student) => (
                                    <tr
                                        key={student.user_id}
                                        className="hover:bg-gray-50 dark:hover:bg-sidebar/50 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                                            {student.name}
                                            {student.file_upload && (
                                                <a
                                                    href={student.file_upload}
                                                    target="_blank"
                                                    className="block text-xs text-blue-600 hover:underline mt-1"
                                                >
                                                    📄 Lihat Berkas Ujian
                                                </a>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {student.status ===
                                                "belum_mulai" && (
                                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px] font-bold uppercase">
                                                    Belum Mulai
                                                </span>
                                            )}
                                            {student.status === "berjalan" && (
                                                <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-[10px] font-bold uppercase animate-pulse">
                                                    Berjalan
                                                </span>
                                            )}
                                            {student.status === "selesai" && (
                                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold uppercase">
                                                    Selesai
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center font-mono">
                                            {student.nilai_pg ?? "-"}
                                        </td>
                                        {exam.izinkan_upload && (
                                            <td className="px-6 py-4 text-center">
                                                {student.status ===
                                                "selesai" ? (
                                                    <button
                                                        onClick={() =>
                                                            openGradeModal(
                                                                student,
                                                            )
                                                        }
                                                        className="text-blue-600 hover:underline font-bold"
                                                    >
                                                        {student.nilai_essay !==
                                                        null
                                                            ? student.nilai_essay
                                                            : "Beri Nilai"}
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-400">
                                                        -
                                                    </span>
                                                )}
                                            </td>
                                        )}
                                        <td className="px-6 py-4 text-center font-bold text-gray-900 dark:text-white">
                                            {student.status === "selesai"
                                                ? student.total_nilai
                                                : "-"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Input Nilai Essay */}
            {gradingModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-sidebar rounded-2xl p-6 w-full max-w-sm shadow-xl border border-gray-200 dark:border-sidebar-border">
                        <h2 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">
                            Nilai Essay
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">
                            {gradingModal.data?.name}
                        </p>
                        <form onSubmit={submitGrade} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Skor Manual (0-100)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    value={data.nilai_essay}
                                    onChange={(e) =>
                                        setData("nilai_essay", e.target.value)
                                    }
                                    className="w-full rounded-lg border-gray-300 dark:border-sidebar-border dark:bg-black p-2.5 text-sm"
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setGradingModal({
                                            isOpen: false,
                                            data: null,
                                        })
                                    }
                                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                >
                                    Simpan Skor
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

Monitoring.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
    