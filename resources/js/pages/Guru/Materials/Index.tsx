import { useState, FormEvent } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";

interface Material {
    id: string;
    judul: string;
    file_url: string;
    created_at: string;
    meetings: Array<{
        pertemuan_ke: number;
        teaching_schedule: {
            subject: { name: string };
            classroom: { nama_kelas: string };
        };
    }>;
}

interface Props {
    materials: Material[];
}

export default function Index({ materials }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        id: string | null;
    }>({ isOpen: false, id: null });

    const { data, setData, post, processing, reset, errors } = useForm({
        judul: "",
        file: null as File | null,
    });

    const submitUpload = (e: FormEvent) => {
        e.preventDefault();
        post("/guru/materials", {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            },
        });
    };

    return (
        <>
            <Head title="Bank Materi" />
            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            Bank Materi
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Kelola seluruh bahan ajar yang Anda unggah.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        + Unggah Materi Baru
                    </button>
                </div>

                <div className="bg-white dark:bg-sidebar border border-sidebar-border/70 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                        <thead className="bg-gray-50 dark:bg-black border-b border-sidebar-border/70 text-gray-900 dark:text-gray-100 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4 font-semibold">
                                    Judul Materi
                                </th>
                                <th className="px-6 py-4 font-semibold">
                                    Status Tautan
                                </th>
                                <th className="px-6 py-4 font-semibold">
                                    Detail Sesi
                                </th>
                                <th className="px-6 py-4 font-semibold text-right">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-sidebar-border/70">
                            {materials.length > 0 ? (
                                materials.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-gray-50 dark:hover:bg-sidebar/50 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                                            <div className="flex items-center gap-2">
                                                <span>📄</span>
                                                {item.judul}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            {item.meetings.length > 0 ? (
                                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-md font-medium">
                                                    Tertaut ke{" "}
                                                    {item.meetings.length} Sesi
                                                </span>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">
                                                    Belum ditautkan
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-6 py-4 text-xs">
                                            {item.meetings.length > 0 ? (
                                                <ul className="list-disc list-inside">
                                                    {item.meetings
                                                        .slice(0, 2)
                                                        .map((m, idx) => (
                                                            <li key={idx}>
                                                                {
                                                                    m
                                                                        .teaching_schedule
                                                                        .subject
                                                                        .name
                                                                }{" "}
                                                                (P
                                                                {m.pertemuan_ke}
                                                                )
                                                            </li>
                                                        ))}
                                                    {item.meetings.length >
                                                        2 && (
                                                        <li className="text-gray-400 italic mt-1">
                                                            +
                                                            {item.meetings
                                                                .length -
                                                                2}{" "}
                                                            lainnya...
                                                        </li>
                                                    )}
                                                </ul>
                                            ) : (
                                                <span>-</span>
                                            )}
                                        </td>

                                        <td className="px-6 py-4 text-right space-x-3">
                                            <a
                                                href={item.file_url}
                                                target="_blank"
                                                className="text-blue-600 dark:text-blue-400 hover:underline"
                                            >
                                                Unduh
                                            </a>
                                            <button
                                                onClick={() =>
                                                    setDeleteModal({
                                                        isOpen: true,
                                                        id: item.id,
                                                    })
                                                }
                                                className="text-red-600 dark:text-red-400 hover:underline"
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
                                        Belum ada materi yang diunggah.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Unggah Materi */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-sidebar rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-200 dark:border-sidebar-border">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                            Unggah Materi Baru
                        </h2>

                        <form onSubmit={submitUpload} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                                    Judul Materi
                                </label>
                                <input
                                    type="text"
                                    value={data.judul}
                                    onChange={(e) =>
                                        setData("judul", e.target.value)
                                    }
                                    className="w-full rounded-lg border-gray-300 dark:border-sidebar-border dark:bg-black p-2.5"
                                    placeholder="Contoh: Modul 1 - Pengenalan Java"
                                    required
                                />
                                {errors.judul && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.judul}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                                    File (PDF, DOCX, PPTX)
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
                                    required
                                />
                                {errors.file && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.file}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-2">
                                    Maksimal ukuran file: 10MB.
                                </p>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
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
                                    {processing ? "Mengunggah..." : "Unggah"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Hapus - Sekarang di dalam fragment utama */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-sidebar rounded-2xl p-6 w-full max-w-sm shadow-xl border border-gray-200 dark:border-sidebar-border text-center">
                        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 flex items-center justify-center mx-auto mb-4 text-2xl">
                            ⚠️
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                            Hapus Materi?
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                            Materi akan dihapus permanen dan tautannya akan
                            hilang dari seluruh sesi kelas.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() =>
                                    setDeleteModal({ isOpen: false, id: null })
                                }
                                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-black dark:text-gray-300 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => {
                                    if (deleteModal.id) {
                                        router.delete(
                                            `/guru/materials/${deleteModal.id}`,
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
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
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
