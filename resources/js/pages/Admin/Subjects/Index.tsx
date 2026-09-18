import { useState, FormEvent } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import {
    Plus,
    Edit2,
    Trash2,
    BookOpen,
    LayoutDashboard,
    Filter,
    Search,
} from "lucide-react";

interface Subject {
    id: string;
    name: string;
    tingkat: string;
}

interface PaginatedData {
    data: Subject[];
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    subjects: PaginatedData;
}

export default function Index({ subjects }: Props) {
    const [formModal, setFormModal] = useState<{
        isOpen: boolean;
        mode: "add" | "edit";
        data: Subject | null;
    }>({ isOpen: false, mode: "add", data: null });

    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        id: string | null;
    }>({ isOpen: false, id: null });

    // State untuk Filter & Pencarian
    const [filterTingkat, setFilterTingkat] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");

    const { data, setData, post, put, processing, reset, errors, clearErrors } =
        useForm({
            name: "",
            tingkat: "",
        });

    // Logika Filter Real-time (Berdasarkan Tingkat ATAU Pencarian Nama)
    const filteredSubjects = subjects.data.filter((item) => {
        const matchTingkat =
            filterTingkat === "all" || item.tingkat === filterTingkat;
        const matchSearch = item.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        return matchTingkat && matchSearch;
    });

    const openAddModal = () => {
        clearErrors();
        reset();
        setData({ name: "", tingkat: "" });
        setFormModal({ isOpen: true, mode: "add", data: null });
    };

    const openEditModal = (subject: Subject) => {
        clearErrors();
        setData({
            name: subject.name,
            tingkat: subject.tingkat,
        });
        setFormModal({ isOpen: true, mode: "edit", data: subject });
    };

    const submitForm = (e: FormEvent) => {
        e.preventDefault();

        if (formModal.mode === "add") {
            post("/admin/subjects", {
                onSuccess: () => {
                    setFormModal({ isOpen: false, mode: "add", data: null });
                    reset();
                },
            });
        } else if (formModal.mode === "edit" && formModal.data) {
            put(`/admin/subjects/${formModal.data.id}`, {
                onSuccess: () => {
                    setFormModal({ isOpen: false, mode: "add", data: null });
                    reset();
                },
            });
        }
    };

    return (
        <>
            <Head title="Manajemen Mata Pelajaran" />

            <div className="min-h-screen bg-[#F8F9FA] dark:bg-black p-4 sm:p-6 lg:p-8 font-sans">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header & Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-sidebar border border-gray-100 dark:border-sidebar-border p-5 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-pink-50 dark:bg-pink-900/30 text-pink-600 rounded-xl">
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                    Mata Pelajaran
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Kelola master data mata pelajaran sekolah.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                            {/* Input Pencarian */}
                            <div className="relative flex-grow sm:flex-grow-0">
                                <Search
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type="text"
                                    placeholder="Cari nama mapel..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full sm:w-48 pl-9 pr-4 py-2 bg-gray-50 dark:bg-black border-transparent rounded-xl text-sm focus:border-pink-500 focus:ring-pink-500 dark:text-gray-200"
                                />
                            </div>

                            {/* Filter Dropdown */}
                            <div className="relative flex-grow sm:flex-grow-0">
                                <Filter
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                                <select
                                    value={filterTingkat}
                                    onChange={(e) =>
                                        setFilterTingkat(e.target.value)
                                    }
                                    className="w-full sm:w-40 pl-9 pr-4 py-2 bg-gray-50 dark:bg-black border-transparent rounded-xl text-sm focus:border-pink-500 focus:ring-pink-500 dark:text-gray-200"
                                >
                                    <option value="all">Semua Tingkat</option>
                                    <option value="10">Kelas 10</option>
                                    <option value="11">Kelas 11</option>
                                    <option value="12">Kelas 12</option>
                                </select>
                            </div>

                            <button
                                onClick={openAddModal}
                                className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap shadow-sm w-full sm:w-auto justify-center"
                            >
                                <Plus size={18} /> Tambah Mapel
                            </button>
                        </div>
                    </div>

                    {/* Content Area - Menggunakan Layout Grid/Cards (Bukan Tabel Linier) */}
                    {filteredSubjects.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredSubjects.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white dark:bg-sidebar border border-gray-100 dark:border-sidebar-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden"
                                >
                                    {/* Aksi (Muncul saat Hover) */}
                                    <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => openEditModal(item)}
                                            className="p-2 text-blue-600 bg-white shadow-sm border border-gray-100 hover:bg-blue-50 dark:bg-sidebar dark:border-gray-700 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            onClick={() =>
                                                setDeleteModal({
                                                    isOpen: true,
                                                    id: item.id,
                                                })
                                            }
                                            className="p-2 text-red-600 bg-white shadow-sm border border-gray-100 hover:bg-red-50 dark:bg-sidebar dark:border-gray-700 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                            title="Hapus"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>

                                    {/* Isi Kartu */}
                                    <div className="mb-4">
                                        <span
                                            className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md mb-3 
                                            ${
                                                item.tingkat === "10"
                                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                    : item.tingkat === "11"
                                                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                            }`}
                                        >
                                            Tingkat {item.tingkat}
                                        </span>
                                        <h3 className="font-bold text-gray-900 dark:text-white leading-tight mb-1 pr-14">
                                            {item.name}
                                        </h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-sidebar border border-gray-100 dark:border-sidebar-border rounded-2xl shadow-sm p-12 text-center">
                            <div className="flex flex-col items-center justify-center text-gray-400">
                                <BookOpen
                                    size={48}
                                    className="mb-4 opacity-20"
                                />
                                <p className="text-gray-500 font-medium">
                                    Tidak ada mata pelajaran ditemukan.
                                </p>
                                <p className="text-sm mt-1">
                                    Coba sesuaikan filter tingkat kelas atau
                                    kata kunci pencarian.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Tambah & Edit */}
            {formModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/20 dark:bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-sidebar rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100 dark:border-sidebar-border transform transition-all">
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-sidebar-border pb-4">
                            <div className="p-2 bg-pink-50 dark:bg-pink-900/30 text-pink-600 rounded-lg">
                                {formModal.mode === "add" ? (
                                    <Plus size={20} />
                                ) : (
                                    <Edit2 size={20} />
                                )}
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {formModal.mode === "add"
                                    ? "Tambah Mata Pelajaran"
                                    : "Edit Mata Pelajaran"}
                            </h2>
                        </div>

                        <form onSubmit={submitForm} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Nama Mata Pelajaran
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="w-full rounded-xl border-gray-200 dark:border-sidebar-border dark:bg-black focus:ring-pink-500 focus:border-pink-500 p-2.5 text-sm"
                                    placeholder="Contoh: Matematika Lanjut"
                                    required
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs mt-1.5">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Tingkat Kelas
                                </label>
                                <select
                                    value={data.tingkat}
                                    onChange={(e) =>
                                        setData("tingkat", e.target.value)
                                    }
                                    className="w-full rounded-xl border-gray-200 dark:border-sidebar-border dark:bg-black focus:ring-pink-500 focus:border-pink-500 p-2.5 text-sm"
                                    required
                                >
                                    <option value="">
                                        -- Pilih Tingkat --
                                    </option>
                                    <option value="10">Kelas 10</option>
                                    <option value="11">Kelas 11</option>
                                    <option value="12">Kelas 12</option>
                                </select>
                                {errors.tingkat && (
                                    <p className="text-red-500 text-xs mt-1.5">
                                        {errors.tingkat}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-sidebar-border">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormModal({
                                            isOpen: false,
                                            mode: "add",
                                            data: null,
                                        });
                                        reset();
                                        clearErrors();
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors dark:bg-black dark:text-gray-300"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 rounded-xl transition-colors disabled:opacity-50"
                                >
                                    Simpan Data
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Hapus */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/20 dark:bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-sidebar rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-gray-100 dark:border-sidebar-border text-center transform transition-all">
                        <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-900/30 text-red-600 flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                            Hapus Mata Pelajaran?
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                            Data ini akan dihapus permanen dan tidak bisa
                            dikembalikan.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() =>
                                    setDeleteModal({ isOpen: false, id: null })
                                }
                                className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors dark:bg-black dark:text-gray-300"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => {
                                    if (deleteModal.id) {
                                        router.delete(
                                            `/admin/subjects/${deleteModal.id}`,
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
                                className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm"
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
