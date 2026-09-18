import { useState, FormEvent } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";

interface Submission {
    id: string;
    user: { name: string };
    file_url: string;
    catatan_siswa: string | null;
    nilai: number | null;
    komentar_guru: string | null;
    created_at: string;
}

interface Assignment {
    id: string;
    judul: string;
    max_score: number;
    deadline: string;
    meeting: {
        pertemuan_ke: number;
        teaching_schedule: {
            subject: { name: string };
            classroom: { nama_kelas: string };
        };
    };
}

interface Props {
    assignment: Assignment;
    submissions: Submission[];
}

export default function Submissions({ assignment, submissions }: Props) {
    const [gradeModal, setGradeModal] = useState<{
        isOpen: boolean;
        data: Submission | null;
    }>({ isOpen: false, data: null });

    const { data, setData, post, processing, reset } = useForm({
        nilai: 0,
        komentar_guru: "",
    });

    const openGradeModal = (submission: Submission) => {
        setData({
            nilai: submission.nilai || 0,
            komentar_guru: submission.komentar_guru || "",
        });
        setGradeModal({ isOpen: true, data: submission });
    };

    const submitGrade = (e: FormEvent) => {
        e.preventDefault();
        if (gradeModal.data) {
            post(`/guru/submissions/${gradeModal.data.id}/grade`, {
                onSuccess: () => {
                    setGradeModal({ isOpen: false, data: null });
                    reset();
                },
            });
        }
    };

    return (
        <>
            <Head title={`Penilaian - ${assignment.judul}`} />

            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1 text-sm text-gray-500">
                            <Link
                                href="/guru/assignments"
                                className="hover:text-blue-600 transition-colors"
                            >
                                Tugas
                            </Link>
                            <span>/</span>
                            <span>Penilaian</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {assignment.judul}
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {
                                assignment.meeting.teaching_schedule.classroom
                                    .nama_kelas
                            }{" "}
                            •{" "}
                            {assignment.meeting.teaching_schedule.subject.name}
                        </p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-lg text-sm font-medium border border-blue-100 dark:border-blue-800">
                        Total Pengumpulan: {submissions.length} Siswa
                    </div>
                </div>

                <div className="bg-white dark:bg-sidebar border border-sidebar-border/70 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                        <thead className="bg-gray-50 dark:bg-black border-b border-sidebar-border/70 text-gray-900 dark:text-gray-100 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4 font-semibold">
                                    Nama Siswa
                                </th>
                                <th className="px-6 py-4 font-semibold">
                                    Waktu Pengumpulan
                                </th>
                                <th className="px-6 py-4 font-semibold">
                                    File & Catatan
                                </th>
                                <th className="px-6 py-4 font-semibold">
                                    Nilai
                                </th>
                                <th className="px-6 py-4 font-semibold text-right">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-sidebar-border/70">
                            {submissions.length > 0 ? (
                                submissions.map((sub) => {
                                    const isLate =
                                        new Date(sub.created_at) >
                                        new Date(assignment.deadline);
                                    return (
                                        <tr
                                            key={sub.id}
                                            className="hover:bg-gray-50 dark:hover:bg-sidebar/50 transition-colors"
                                        >
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                                                {sub.user.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-gray-900 dark:text-gray-100">
                                                    {new Date(
                                                        sub.created_at,
                                                    ).toLocaleString("id-ID")}
                                                </div>
                                                {isLate && (
                                                    <span className="text-xs text-red-500 font-medium">
                                                        Terlambat
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <a
                                                    href={sub.file_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mb-1 font-medium"
                                                >
                                                    📄 Unduh File
                                                </a>
                                                <div className="text-xs text-gray-500 line-clamp-1 italic">
                                                    "
                                                    {sub.catatan_siswa ||
                                                        "Tidak ada catatan"}
                                                    "
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {sub.nilai !== null ? (
                                                    <span className="font-bold text-green-600 dark:text-green-400 text-lg">
                                                        {sub.nilai}{" "}
                                                        <span className="text-xs font-normal text-gray-400">
                                                            /{" "}
                                                            {
                                                                assignment.max_score
                                                            }
                                                        </span>
                                                    </span>
                                                ) : (
                                                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded font-medium">
                                                        Belum Dinilai
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() =>
                                                        openGradeModal(sub)
                                                    }
                                                    className="text-blue-600 dark:text-blue-400 font-medium hover:underline bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-md"
                                                >
                                                    {sub.nilai !== null
                                                        ? "Ubah Nilai"
                                                        : "Beri Nilai"}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-8 text-center text-gray-500 italic"
                                    >
                                        Belum ada siswa yang mengumpulkan tugas
                                        ini.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Beri Nilai */}
            {gradeModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-sidebar rounded-2xl p-6 w-full max-w-sm shadow-xl border border-gray-200 dark:border-sidebar-border">
                        <h2 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">
                            Beri Nilai
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">
                            Siswa:{" "}
                            <span className="font-medium text-gray-800 dark:text-gray-200">
                                {gradeModal.data?.user.name}
                            </span>
                        </p>

                        <form onSubmit={submitGrade} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Nilai (Max: {assignment.max_score})
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max={assignment.max_score}
                                    value={data.nilai}
                                    onChange={(e) =>
                                        setData(
                                            "nilai",
                                            parseInt(e.target.value) || 0,
                                        )
                                    }
                                    className="w-full text-2xl font-bold rounded-lg border-gray-300 dark:border-sidebar-border dark:bg-black p-2.5 text-center text-blue-600"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Komentar / Feedback
                                </label>
                                <textarea
                                    value={data.komentar_guru}
                                    onChange={(e) =>
                                        setData("komentar_guru", e.target.value)
                                    }
                                    rows={3}
                                    placeholder="Tuliskan evaluasi atau saran untuk siswa..."
                                    className="w-full rounded-lg border-gray-300 dark:border-sidebar-border dark:bg-black p-2.5 text-sm"
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setGradeModal({
                                            isOpen: false,
                                            data: null,
                                        });
                                        reset();
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-black"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                >
                                    Simpan Nilai
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

Submissions.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
