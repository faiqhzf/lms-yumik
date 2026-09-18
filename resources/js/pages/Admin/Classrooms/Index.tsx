import { useState, FormEvent } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import {
    Plus,
    Edit2,
    Trash2,
    Users,
    LayoutDashboard,
    Filter,
} from "lucide-react";

interface User {
    id: string;
    name: string;
}

interface Classroom {
    id: string;
    nama_kelas: string;
    wali_kelas_id: string | null;
    wali_kelas: User | null;
}

interface PaginatedData {
    data: Classroom[];
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    classrooms: PaginatedData;
    gurus: User[];
}

export default function Index({ classrooms, gurus }: Props) {
    const [formModal, setFormModal] = useState<{
        isOpen: boolean;
        mode: "add" | "edit";
        data: Classroom | null;
    }>({ isOpen: false, mode: "add", data: null });

    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        id: string | null;
    }>({ isOpen: false, id: null });

    // State untuk Filter Tingkat Kelas
    const [filterTingkat, setFilterTingkat] = useState<string>("all");

    const {
        data,
        setData,
        post,
        put,
        processing,
        reset,
        errors,
        clearErrors,
        transform,
    } = useForm({
        tingkat: "10",
        grup: "",
        wali_kelas_id: "",
        nama_kelas: "",
    });

    transform((data) => ({
        nama_kelas: `${data.tingkat}-${data.grup.toUpperCase()}`,
        wali_kelas_id: data.wali_kelas_id,
    }));

    // Logika Filter Real-time
    const filteredClassrooms = classrooms.data.filter((item) =>
        filterTingkat === "all"
            ? true
            : item.nama_kelas.startsWith(filterTingkat),
    );

    const openAddModal = () => {
        clearErrors();
        reset();
        setData({ tingkat: "10", grup: "", wali_kelas_id: "", nama_kelas: "" });
        setFormModal({ isOpen: true, mode: "add", data: null });
    };

    const openEditModal = (classroom: Classroom) => {
        clearErrors();
        const parts = classroom.nama_kelas.split("-");
        const tingkat = parts[0] || "10";
        const grup = parts.slice(1).join("-") || "";

        setData({
            tingkat: tingkat,
            grup: grup,
            wali_kelas_id: classroom.wali_kelas_id || "",
            nama_kelas: "",
        });

        setFormModal({ isOpen: true, mode: "edit", data: classroom });
    };

    const submitForm = (e: FormEvent) => {
        e.preventDefault();
        if (formModal.mode === "add") {
            post("/admin/classrooms", {
                onSuccess: () => {
                    setFormModal({ isOpen: false, mode: "add", data: null });
                    reset();
                },
            });
        } else if (formModal.mode === "edit" && formModal.data) {
            put(`/admin/classrooms/${formModal.data.id}`, {
                onSuccess: () => {
                    setFormModal({ isOpen: false, mode: "add", data: null });
                    reset();
                },
            });
        }
    };

    return (
        <>
            <Head title="Manajemen Kelas" />

            <div className="min-h-screen bg-[#F8F9FA] dark:bg-black p-4 sm:p-6 lg:p-8 font-sans">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header & Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-sidebar border border-gray-100 dark:border-sidebar-border p-5 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl">
                                <LayoutDashboard size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                    Data Kelas
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Kelola daftar kelas dan tentukan wali kelas.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="relative w-full sm:w-auto">
                                <Filter
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                                <select
                                    value={filterTingkat}
                                    onChange={(e) =>
                                        setFilterTingkat(e.target.value)
                                    }
                                    className="w-full sm:w-40 pl-9 pr-4 py-2 bg-gray-50 dark:bg-black border-transparent rounded-xl text-sm focus:border-blue-500 focus:ring-blue-500 dark:text-gray-200"
                                >
                                    <option value="all">Semua Tingkat</option>
                                    <option value="10">Kelas 10</option>
                                    <option value="11">Kelas 11</option>
                                    <option value="12">Kelas 12</option>
                                </select>
                            </div>
                            <button
                                onClick={openAddModal}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap shadow-sm"
                            >
                                <Plus size={18} /> Tambah Kelas
                            </button>
                        </div>
                    </div>

                    {/* Table Card */}
                    <div className="bg-white dark:bg-sidebar border border-gray-100 dark:border-sidebar-border rounded-2xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50/50 dark:bg-black/50 text-gray-500 dark:text-gray-400">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">
                                            Nama Kelas
                                        </th>
                                        <th className="px-6 py-4 font-medium">
                                            Wali Kelas
                                        </th>
                                        <th className="px-6 py-4 font-medium text-right">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-sidebar-border/50">
                                    {filteredClassrooms.length > 0 ? (
                                        filteredClassrooms.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="hover:bg-gray-50/50 dark:hover:bg-sidebar/50 transition-colors group"
                                            >
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center justify-center bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-bold px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-800">
                                                        {item.nama_kelas}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.wali_kelas ? (
                                                        <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
                                                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-black flex items-center justify-center text-gray-500">
                                                                <Users
                                                                    size={14}
                                                                />
                                                            </div>
                                                            {
                                                                item.wali_kelas
                                                                    .name
                                                            }
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 italic flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-full border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                                                                -
                                                            </div>
                                                            Belum ditentukan
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() =>
                                                                openEditModal(
                                                                    item,
                                                                )
                                                            }
                                                            className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                setDeleteModal({
                                                                    isOpen: true,
                                                                    id: item.id,
                                                                })
                                                            }
                                                            className="p-2 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                                                            title="Hapus"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={3}
                                                className="px-6 py-12 text-center"
                                            >
                                                <div className="flex flex-col items-center justify-center text-gray-400">
                                                    <LayoutDashboard
                                                        size={32}
                                                        className="mb-3 opacity-20"
                                                    />
                                                    <p>
                                                        Tidak ada data kelas
                                                        untuk filter ini.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Tambah & Edit */}
            {formModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/20 dark:bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-sidebar rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100 dark:border-sidebar-border transform transition-all">
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-sidebar-border pb-4">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                                {formModal.mode === "add" ? (
                                    <Plus size={20} />
                                ) : (
                                    <Edit2 size={20} />
                                )}
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {formModal.mode === "add"
                                    ? "Tambah Kelas Baru"
                                    : "Edit Data Kelas"}
                            </h2>
                        </div>

                        <form onSubmit={submitForm} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Tingkat
                                    </label>
                                    <select
                                        value={data.tingkat}
                                        onChange={(e) =>
                                            setData("tingkat", e.target.value)
                                        }
                                        className="w-full rounded-xl border-gray-200 dark:border-sidebar-border dark:bg-black focus:ring-blue-500 focus:border-blue-500 p-2.5 text-sm"
                                    >
                                        <option value="10">Kelas 10</option>
                                        <option value="11">Kelas 11</option>
                                        <option value="12">Kelas 12</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Grup/Jurusan
                                    </label>
                                    <input
                                        type="text"
                                        value={data.grup}
                                        onChange={(e) =>
                                            setData("grup", e.target.value)
                                        }
                                        className="w-full rounded-xl border-gray-200 dark:border-sidebar-border dark:bg-black focus:ring-blue-500 focus:border-blue-500 p-2.5 text-sm uppercase"
                                        placeholder="Contoh: A, RPL 1"
                                        required
                                    />
                                    {errors.nama_kelas && (
                                        <p className="text-red-500 text-xs mt-1.5">
                                            {errors.nama_kelas}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Wali Kelas (Opsional)
                                </label>
                                <select
                                    value={data.wali_kelas_id}
                                    onChange={(e) =>
                                        setData("wali_kelas_id", e.target.value)
                                    }
                                    className="w-full rounded-xl border-gray-200 dark:border-sidebar-border dark:bg-black focus:ring-blue-500 focus:border-blue-500 p-2.5 text-sm"
                                >
                                    <option value="">
                                        -- Tidak ada Wali Kelas --
                                    </option>
                                    {gurus.map((guru) => (
                                        <option key={guru.id} value={guru.id}>
                                            {guru.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.wali_kelas_id && (
                                    <p className="text-red-500 text-xs mt-1.5">
                                        {errors.wali_kelas_id}
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
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-50"
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
                            Hapus Kelas?
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                            Menghapus kelas ini akan berdampak pada jadwal
                            mengajar dan siswa yang terhubung.
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
                                            `/admin/classrooms/${deleteModal.id}`,
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
