import { useState, FormEvent } from "react";
import { Head, useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";

interface Submission {
    id: string;
    file_url: string;
    catatan_siswa: string | null;
    nilai: number | null;
    komentar_guru: string | null;
    created_at: string;
}

interface Assignment {
    id: string;
    judul: string;
    deskripsi: string | null;
    deadline: string;
    max_score: number;
    meeting: {
        pertemuan_ke: number;
        teaching_schedule: {
            subject: { name: string };
            classroom: { nama_kelas: string };
            user: { name: string };
        };
    };
    submissions: Submission[];
}

interface PaginatedData {
    data: Assignment[];
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    assignments: PaginatedData;
}

export default function Index({ assignments }: Props) {
    const [submitModal, setSubmitModal] = useState<{
        isOpen: boolean;
        assignment: Assignment | null;
    }>({ isOpen: false, assignment: null });

    const { data, setData, post, processing, reset, errors } = useForm({
        file: null as File | null,
        catatan_siswa: "",
    });

    const openSubmitModal = (assignment: Assignment) => {
        setSubmitModal({ isOpen: true, assignment });
    };

    const submitTask = (e: FormEvent) => {
        e.preventDefault();
        if (submitModal.assignment) {
            post(`/siswa/assignments/${submitModal.assignment.id}/submit`, {
                onSuccess: () => {
                    setSubmitModal({ isOpen: false, assignment: null });
                    reset();
                },
            });
        }
    };

    return (
        <>
            <Head title="Tugas Saya" />

            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Tugas Kelas
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Kerjakan dan kumpulkan tugas Anda sebelum batas waktu
                        berakhir.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {assignments.data.length > 0 ? (
                        assignments.data.map((task) => {
                            const submission = task.submissions[0] || null;
                            const isLate = new Date() > new Date(task.deadline);

                            return (
                                <div
                                    key={task.id}
                                    className="bg-white dark:bg-sidebar border border-gray-200 dark:border-sidebar-border rounded-2xl p-5 shadow-sm flex flex-col h-full"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className="text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-md">
                                                {
                                                    task.meeting
                                                        .teaching_schedule
                                                        .subject.name
                                                }
                                            </span>
                                            <h3 className="font-bold text-lg text-gray-900 dark:text-white mt-2 line-clamp-1">
                                                {task.judul}
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Guru:{" "}
                                                {
                                                    task.meeting
                                                        .teaching_schedule.user
                                                        .name
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 flex-grow">
                                        {task.deskripsi || (
                                            <span className="italic">
                                                Tidak ada instruksi tambahan.
                                            </span>
                                        )}
                                    </p>

                                    <div className="bg-gray-50 dark:bg-black p-3 rounded-xl mb-4 text-sm border border-gray-100 dark:border-sidebar-border/50">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-gray-500">
                                                Tenggat:
                                            </span>
                                            <span
                                                className={`font-mono font-medium ${isLate && !submission ? "text-red-500" : "text-gray-900 dark:text-gray-200"}`}
                                            >
                                                {new Date(
                                                    task.deadline,
                                                ).toLocaleString("id-ID", {
                                                    dateStyle: "short",
                                                    timeStyle: "short",
                                                })}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">
                                                Status:
                                            </span>
                                            {submission ? (
                                                <span className="text-green-600 font-medium">
                                                    Selesai
                                                </span>
                                            ) : (
                                                <span
                                                    className={
                                                        isLate
                                                            ? "text-red-500 font-medium"
                                                            : "text-orange-500 font-medium"
                                                    }
                                                >
                                                    {isLate
                                                        ? "Terlambat"
                                                        : "Belum Dikerjakan"}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {submission && submission.nilai !== null ? (
                                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 rounded-xl text-center">
                                            <p className="text-xs text-green-700 dark:text-green-400 font-medium uppercase tracking-wider mb-1">
                                                Nilai Anda
                                            </p>
                                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                {submission.nilai}{" "}
                                                <span className="text-sm text-green-500 font-normal">
                                                    / {task.max_score}
                                                </span>
                                            </p>
                                            {submission.komentar_guru && (
                                                <p className="text-xs text-green-700 dark:text-green-300 mt-2 italic">
                                                    "{submission.komentar_guru}"
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() =>
                                                openSubmitModal(task)
                                            }
                                            className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors ${
                                                submission
                                                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-black dark:text-gray-300 dark:hover:bg-gray-900 border border-gray-200 dark:border-sidebar-border"
                                                    : "bg-blue-600 text-white hover:bg-blue-700"
                                            }`}
                                        >
                                            {submission
                                                ? "Lihat / Edit Pengumpulan"
                                                : "Kerjakan Tugas"}
                                        </button>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full bg-white dark:bg-sidebar border border-gray-200 dark:border-sidebar-border rounded-2xl p-12 text-center shadow-sm">
                            <span className="text-4xl mb-4 block">📚</span>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                Hore, tidak ada tugas!
                            </h3>
                            <p className="text-gray-500">
                                Belum ada tugas yang diberikan ke kelas Anda.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Pengumpulan Tugas */}
            {submitModal.isOpen && submitModal.assignment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-sidebar rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-200 dark:border-sidebar-border">
                        <h2 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">
                            Kumpulkan Tugas
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">
                            {submitModal.assignment.judul}
                        </p>

                        <form onSubmit={submitTask} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                                    File Tugas (PDF, DOCX, ZIP)
                                </label>
                                <input
                                    type="file"
                                    onChange={(e) =>
                                        setData(
                                            "file",
                                            e.target.files
                                                ? e.target.files[0]
                                                : null,
                                        )
                                    }
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-sidebar dark:file:text-gray-300"
                                    required={
                                        !submitModal.assignment.submissions[0]
                                    } // Wajib jika belum pernah kumpul
                                />
                                {errors.file && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.file}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-2">
                                    Maksimal ukuran file: 10MB.
                                </p>
                                {submitModal.assignment.submissions[0] && (
                                    <p className="text-xs text-orange-500 mt-1 font-medium">
                                        ⚠️ Anda sudah mengumpulkan file.
                                        Mengunggah file baru akan menimpa file
                                        lama.
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                                    Catatan Tambahan (Opsional)
                                </label>
                                <textarea
                                    value={data.catatan_siswa}
                                    onChange={(e) =>
                                        setData("catatan_siswa", e.target.value)
                                    }
                                    rows={3}
                                    placeholder="Tuliskan pesan untuk guru (jika ada)..."
                                    className="w-full rounded-lg border-gray-300 dark:border-sidebar-border dark:bg-black p-2.5 text-sm"
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSubmitModal({
                                            isOpen: false,
                                            assignment: null,
                                        });
                                        reset();
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-black dark:text-gray-300 dark:hover:bg-gray-900"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {processing
                                        ? "Mengunggah..."
                                        : "Kumpulkan Sekarang"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

Index.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
