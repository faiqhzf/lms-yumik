import { useState, FormEvent } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import {
    GraduationCap,
    Plus,
    Edit2,
    Trash2,
    CalendarDays,
    CheckCircle,
    Power,
    Calendar,
} from "lucide-react";

interface AcademicYear {
    id: string;
    tahun_ajaran: string;
    semester: "Ganjil" | "Genap";
    tanggal_mulai: string;
    tanggal_selesai: string;
    is_active: boolean;
}

interface PaginatedData {
    data: AcademicYear[];
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    academics: PaginatedData;
}

export default function Index({ academics }: Props) {
    const [formModal, setFormModal] = useState<{
        isOpen: boolean;
        mode: "add" | "edit";
        data: AcademicYear | null;
    }>({ isOpen: false, mode: "add", data: null });
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        id: string | null;
    }>({ isOpen: false, id: null });

    const { data, setData, post, put, processing, reset, errors, clearErrors } =
        useForm({
            tahun_ajaran: "",
            semester: "Ganjil",
            tanggal_mulai: "",
            tanggal_selesai: "",
        });

    const openAddModal = () => {
        clearErrors();
        reset();
        setFormModal({ isOpen: true, mode: "add", data: null });
    };

    const openEditModal = (academic: AcademicYear) => {
        clearErrors();
        setData({
            tahun_ajaran: academic.tahun_ajaran,
            semester: academic.semester,
            tanggal_mulai: academic.tanggal_mulai.split("T")[0], // Format YYYY-MM-DD
            tanggal_selesai: academic.tanggal_selesai.split("T")[0],
        });
        setFormModal({ isOpen: true, mode: "edit", data: academic });
    };

    const submitForm = (e: FormEvent) => {
        e.preventDefault();
        if (formModal.mode === "add") {
            post("/admin/academics", {
                onSuccess: () => {
                    setFormModal({ isOpen: false, mode: "add", data: null });
                    reset();
                },
            });
        } else if (formModal.mode === "edit" && formModal.data) {
            put(`/admin/academics/${formModal.data.id}`, {
                onSuccess: () => {
                    setFormModal({ isOpen: false, mode: "add", data: null });
                    reset();
                },
            });
        }
    };

    const toggleActive = (id: string) => {
        router.put(
            `/admin/academics/${id}/toggle-active`,
            {},
            { preserveScroll: true },
        );
    };

    // Helper format tanggal Indonesia
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <>
            <Head title="Tahun Akademik" />

            <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#09090b] p-4 sm:p-6 lg:p-8 font-sans transition-colors duration-200">
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#18181b] border border-gray-100 dark:border-gray-800 p-5 rounded-2xl shadow-sm transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-orange-50 dark:bg-orange-900/30 text-orange-600 rounded-xl">
                                <GraduationCap size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Tahun Ajaran & Akademik
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Kelola periode aktif sebagai wadah data KBM.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={openAddModal}
                            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm"
                        >
                            <Plus size={18} /> Tambah Periode
                        </button>
                    </div>

                    <div className="bg-white dark:bg-[#18181b] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden transition-colors">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50/50 dark:bg-[#09090b]/50 text-gray-500 dark:text-gray-400">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">
                                            Tahun Ajaran
                                        </th>
                                        <th className="px-6 py-4 font-medium">
                                            Semester
                                        </th>
                                        <th className="px-6 py-4 font-medium">
                                            Periode Kalender
                                        </th>
                                        <th className="px-6 py-4 font-medium">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 font-medium text-right">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                                    {academics.data.length > 0 ? (
                                        academics.data.map((item) => (
                                            <tr
                                                key={item.id}
                                                className={`hover:bg-gray-50/50 dark:hover:bg-[#27272a]/50 transition-colors group ${item.is_active ? "bg-orange-50/30 dark:bg-orange-900/10" : ""}`}
                                            >
                                                <td className="px-6 py-4 font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                                    <CalendarDays
                                                        size={16}
                                                        className="text-gray-400"
                                                    />{" "}
                                                    {item.tahun_ajaran}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${item.semester === "Ganjil" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" : "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400"}`}
                                                    >
                                                        {item.semester}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                                    <div className="flex items-center gap-1.5 text-xs">
                                                        <Calendar
                                                            size={12}
                                                            className="text-gray-400"
                                                        />
                                                        {formatDate(
                                                            item.tanggal_mulai,
                                                        )}{" "}
                                                        -{" "}
                                                        {formatDate(
                                                            item.tanggal_selesai,
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.is_active ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                            <CheckCircle
                                                                size={14}
                                                            />{" "}
                                                            Aktif Sekarang
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={() =>
                                                                toggleActive(
                                                                    item.id,
                                                                )
                                                            }
                                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-700 dark:bg-[#27272a] dark:text-gray-400 transition-colors"
                                                        >
                                                            <Power size={14} />{" "}
                                                            Set Aktif
                                                        </button>
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
                                                            className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 rounded-lg"
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
                                                            className="p-2 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 rounded-lg"
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
                                                colSpan={5}
                                                className="px-6 py-12 text-center text-gray-400"
                                            >
                                                Belum ada data Tahun Ajaran.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {formModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/20 dark:bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-[#18181b] rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100 dark:border-gray-800">
                        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                            {formModal.mode === "add"
                                ? "Tambah Periode Akademik"
                                : "Edit Periode"}
                        </h2>
                        <form onSubmit={submitForm} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1.5 dark:text-gray-300">
                                    Tahun Ajaran
                                </label>
                                <input
                                    type="text"
                                    value={data.tahun_ajaran}
                                    onChange={(e) =>
                                        setData("tahun_ajaran", e.target.value)
                                    }
                                    placeholder="Contoh: 2026/2027"
                                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-[#09090b] dark:text-white p-2.5 text-sm focus:ring-orange-500"
                                    required
                                />
                                {errors.tahun_ajaran && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.tahun_ajaran}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5 dark:text-gray-300">
                                    Semester
                                </label>
                                <select
                                    value={data.semester}
                                    onChange={(e) =>
                                        setData(
                                            "semester",
                                            e.target.value as
                                                | "Ganjil"
                                                | "Genap",
                                        )
                                    }
                                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-[#09090b] dark:text-white p-2.5 text-sm focus:ring-orange-500"
                                >
                                    <option value="Ganjil">Ganjil</option>
                                    <option value="Genap">Genap</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 dark:text-gray-300">
                                        Tanggal Mulai
                                    </label>
                                    <input
                                        type="date"
                                        value={data.tanggal_mulai}
                                        onChange={(e) =>
                                            setData(
                                                "tanggal_mulai",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-[#09090b] dark:text-white p-2.5 text-sm focus:ring-orange-500"
                                        required
                                    />
                                    {errors.tanggal_mulai && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.tanggal_mulai}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 dark:text-gray-300">
                                        Tanggal Selesai
                                    </label>
                                    <input
                                        type="date"
                                        value={data.tanggal_selesai}
                                        onChange={(e) =>
                                            setData(
                                                "tanggal_selesai",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-[#09090b] dark:text-white p-2.5 text-sm focus:ring-orange-500"
                                        required
                                    />
                                    {errors.tanggal_selesai && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.tanggal_selesai}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800 mt-4">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormModal({
                                            isOpen: false,
                                            mode: "add",
                                            data: null,
                                        })
                                    }
                                    className="px-4 py-2 text-sm bg-gray-50 rounded-xl dark:bg-[#09090b] dark:text-gray-300"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 text-sm text-white bg-orange-600 rounded-xl"
                                >
                                    Simpan Data
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/20 dark:bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-[#18181b] rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
                        <Trash2
                            size={24}
                            className="text-red-500 mx-auto mb-4"
                        />
                        <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                            Hapus Periode?
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Penghapusan ini bersifat permanen.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() =>
                                    setDeleteModal({ isOpen: false, id: null })
                                }
                                className="px-4 py-2 text-sm bg-gray-100 rounded-xl dark:bg-[#09090b] dark:text-gray-300"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => {
                                    if (deleteModal.id) {
                                        router.delete(
                                            `/admin/academics/${deleteModal.id}`,
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
                                className="px-4 py-2 text-sm text-white bg-red-600 rounded-xl"
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
