import { useState, FormEvent } from "react";
import { Head, useForm, router, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";

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
        };
    };
}

interface PaginatedData {
    data: Assignment[];
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    assignments: PaginatedData;
}

export default function Index({ assignments }: Props) {
    const [editModal, setEditModal] = useState<{
        isOpen: boolean;
        data: Assignment | null;
    }>({ isOpen: false, data: null });
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        id: string | null;
    }>({ isOpen: false, id: null });

    const editForm = useForm({
        judul: "",
        deskripsi: "",
        deadline: "",
        max_score: 100,
    });

    const openEditModal = (assignment: Assignment) => {
        editForm.setData({
            judul: assignment.judul,
            deskripsi: assignment.deskripsi || "",
            deadline: assignment.deadline.slice(0, 16),
            max_score: assignment.max_score,
        });
        setEditModal({ isOpen: true, data: assignment });
    };

    const submitEdit = (e: FormEvent) => {
        e.preventDefault();
        if (editModal.data) {
            editForm.put(`/guru/assignments/${editModal.data.id}`, {
                onSuccess: () => {
                    setEditModal({ isOpen: false, data: null });
                    editForm.reset();
                },
            });
        }
    };

    return (
        <>
            <Head title="Tugas & Ujian" />
            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Manajemen Tugas
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Pantau dan kelola seluruh tugas yang Anda berikan di
                        berbagai kelas.
                    </p>
                </div>

                <div className="bg-white dark:bg-sidebar border border-sidebar-border/70 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                            <thead className="bg-gray-50 dark:bg-black border-b border-sidebar-border/70 text-gray-900 dark:text-gray-100 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">
                                        Tugas
                                    </th>
                                    <th className="px-6 py-4 font-semibold">
                                        Kelas & Mapel
                                    </th>
                                    <th className="px-6 py-4 font-semibold">
                                        Batas Waktu
                                    </th>
                                    <th className="px-6 py-4 font-semibold text-right">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border/70">
                                {assignments.data.length > 0 ? (
                                    assignments.data.map((task) => (
                                        <tr
                                            key={task.id}
                                            className="hover:bg-gray-50 dark:hover:bg-sidebar/50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                                                    {task.judul}
                                                </div>
                                                <div className="text-xs text-gray-500 line-clamp-1">
                                                    {task.deskripsi || (
                                                        <span className="italic">
                                                            Tidak ada deskripsi
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900 dark:text-gray-100">
                                                    {
                                                        task.meeting
                                                            .teaching_schedule
                                                            .classroom
                                                            .nama_kelas
                                                    }
                                                </div>
                                                <div className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                                                    {
                                                        task.meeting
                                                            .teaching_schedule
                                                            .subject.name
                                                    }{" "}
                                                    (Pert.{" "}
                                                    {task.meeting.pertemuan_ke})
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-2 py-1 rounded-md text-xs font-mono font-medium ${new Date(task.deadline) < new Date() ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                                                >
                                                    {new Date(
                                                        task.deadline,
                                                    ).toLocaleString("id-ID", {
                                                        dateStyle: "medium",
                                                        timeStyle: "short",
                                                    })}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-3">
                                                <Link
                                                    href={`/guru/assignments/${task.id}/submissions`}
                                                    className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                                                >
                                                    Penilaian
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        openEditModal(task)
                                                    }
                                                    className="text-gray-600 dark:text-gray-400 font-medium hover:underline"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setDeleteModal({
                                                            isOpen: true,
                                                            id: task.id,
                                                        })
                                                    }
                                                    className="text-red-600 dark:text-red-400 font-medium hover:underline"
                                                >
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-6 py-8 text-center text-gray-500 italic"
                                        >
                                            Belum ada tugas yang dibuat.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Edit Tugas */}
            {editModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-sidebar rounded-2xl p-6 w-full max-w-lg shadow-xl border border-gray-200 dark:border-sidebar-border max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                            Edit Tugas
                        </h2>

                        <form onSubmit={submitEdit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Judul Tugas
                                </label>
                                <input
                                    type="text"
                                    value={editForm.data.judul}
                                    onChange={(e) =>
                                        editForm.setData(
                                            "judul",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-lg border-gray-300 dark:border-sidebar-border dark:bg-black p-2.5"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Batas Waktu
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={editForm.data.deadline}
                                        onChange={(e) =>
                                            editForm.setData(
                                                "deadline",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-lg border-gray-300 dark:border-sidebar-border dark:bg-black p-2.5"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Nilai Maksimal
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={editForm.data.max_score}
                                        onChange={(e) =>
                                            editForm.setData(
                                                "max_score",
                                                parseInt(e.target.value),
                                            )
                                        }
                                        className="w-full rounded-lg border-gray-300 dark:border-sidebar-border dark:bg-black p-2.5"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Deskripsi / Instruksi
                                </label>
                                <textarea
                                    value={editForm.data.deskripsi}
                                    onChange={(e) =>
                                        editForm.setData(
                                            "deskripsi",
                                            e.target.value,
                                        )
                                    }
                                    rows={4}
                                    className="w-full rounded-lg border-gray-300 dark:border-sidebar-border dark:bg-black p-2.5"
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditModal({
                                            isOpen: false,
                                            data: null,
                                        });
                                        editForm.reset();
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-black"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                >
                                    Simpan Perubahan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Hapus */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-sidebar rounded-2xl p-6 w-full max-w-sm shadow-xl border border-gray-200 dark:border-sidebar-border text-center">
                        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 flex items-center justify-center mx-auto mb-4 text-2xl">
                            ⚠️
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                            Hapus Tugas?
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                            Tugas ini akan dihapus beserta seluruh data
                            pengumpulan dari siswa.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() =>
                                    setDeleteModal({ isOpen: false, id: null })
                                }
                                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-black"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => {
                                    if (deleteModal.id) {
                                        router.delete(
                                            `/guru/assignments/${deleteModal.id}`,
                                            {
                                                onSuccess: () =>
                                                    setDeleteModal({
                                                        isOpen: false,
                                                        id: null,
                                                    }),
                                            },
                                        );
                                    }
                                }}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                            >
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

Index.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
