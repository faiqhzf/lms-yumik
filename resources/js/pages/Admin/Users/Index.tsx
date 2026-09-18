import { useState, FormEvent, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import {
    Users,
    UserPlus,
    UploadCloud,
    Edit2,
    Trash2,
    Filter,
    Mail,
    LayoutDashboard,
} from "lucide-react";

interface Classroom {
    id: string;
    nama_kelas: string;
}

interface User {
    id: string;
    name: string;
    email: string;
    role: "admin_master" | "guru" | "siswa";
    classroom_id: string | null;
    classroom: Classroom | null;
}

interface PaginatedData {
    data: User[];
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    users: PaginatedData;
    classrooms: Classroom[];
    filters: { role?: string };
}

export default function Index({ users, classrooms, filters }: Props) {
    const [formModal, setFormModal] = useState<{
        isOpen: boolean;
        mode: "add" | "edit";
        data: User | null;
    }>({ isOpen: false, mode: "add", data: null });
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        id: string | null;
    }>({ isOpen: false, id: null });
    const [importModal, setImportModal] = useState(false);

    const [filterRole, setFilterRole] = useState(filters.role || "all");

    // Form CRUD Standar
    const { data, setData, post, put, processing, reset, errors, clearErrors } =
        useForm({
            name: "",
            email: "",
            password: "",
            role: "siswa",
            classroom_id: "",
        });

    // Form Khusus Import
    const {
        data: importData,
        setData: setImportData,
        post: postImport,
        processing: importProcessing,
        reset: resetImport,
        errors: importErrors,
        clearErrors: clearImportErrors,
    } = useForm({
        file: null as File | null,
    });

    // Filter Trigger
    useEffect(() => {
        if (filterRole !== (filters.role || "all")) {
            router.get(
                "/admin/users",
                { role: filterRole },
                { preserveState: true, replace: true },
            );
        }
    }, [filterRole]);

    const openAddModal = () => {
        clearErrors();
        reset();
        setFormModal({ isOpen: true, mode: "add", data: null });
    };

    const openEditModal = (user: User) => {
        clearErrors();
        setData({
            name: user.name,
            email: user.email,
            password: "",
            role: user.role,
            classroom_id: user.classroom_id || "",
        });
        setFormModal({ isOpen: true, mode: "edit", data: user });
    };

    const submitForm = (e: FormEvent) => {
        e.preventDefault();
        if (formModal.mode === "add") {
            post("/admin/users", {
                onSuccess: () => {
                    setFormModal({ isOpen: false, mode: "add", data: null });
                    reset();
                },
            });
        } else if (formModal.mode === "edit" && formModal.data) {
            put(`/admin/users/${formModal.data.id}`, {
                onSuccess: () => {
                    setFormModal({ isOpen: false, mode: "add", data: null });
                    reset();
                },
            });
        }
    };

    const submitImport = (e: FormEvent) => {
        e.preventDefault();
        postImport("/admin/users/import", {
            onSuccess: () => {
                setImportModal(false);
                resetImport();
            },
        });
    };

    return (
        <>
            <Head title="Manajemen Pengguna" />

            <div className="min-h-screen bg-[#F8F9FA] dark:bg-black p-4 sm:p-6 lg:p-8 font-sans">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header & Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-sidebar border border-gray-100 dark:border-sidebar-border p-5 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-xl">
                                <Users size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                    Data Pengguna
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Kelola akun Guru, Siswa, dan Administrator.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                            {/* Filter Role */}
                            <div className="relative flex-grow sm:flex-grow-0">
                                <Filter
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                                <select
                                    value={filterRole}
                                    onChange={(e) =>
                                        setFilterRole(e.target.value)
                                    }
                                    className="w-full sm:w-40 pl-9 pr-4 py-2 bg-gray-50 dark:bg-black border-transparent rounded-xl text-sm focus:border-emerald-500 focus:ring-emerald-500 dark:text-gray-200"
                                >
                                    <option value="all">Semua Peran</option>
                                    <option value="guru">Guru</option>
                                    <option value="siswa">Siswa</option>
                                    <option value="admin_master">Admin</option>
                                </select>
                            </div>

                            <button
                                onClick={() => {
                                    clearImportErrors();
                                    resetImport();
                                    setImportModal(true);
                                }}
                                className="flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap shadow-sm w-full sm:w-auto justify-center"
                            >
                                <UploadCloud size={18} /> Import CSV
                            </button>

                            <button
                                onClick={openAddModal}
                                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap shadow-sm w-full sm:w-auto justify-center"
                            >
                                <UserPlus size={18} /> Tambah Manual
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
                                            Profil Pengguna
                                        </th>
                                        <th className="px-6 py-4 font-medium">
                                            Peran
                                        </th>
                                        <th className="px-6 py-4 font-medium">
                                            Informasi Kelas
                                        </th>
                                        <th className="px-6 py-4 font-medium text-right">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-sidebar-border/50">
                                    {users.data.length > 0 ? (
                                        users.data.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="hover:bg-gray-50/50 dark:hover:bg-sidebar/50 transition-colors group"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-black flex items-center justify-center text-gray-500 font-bold shrink-0">
                                                            {user.name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-900 dark:text-gray-100">
                                                                {user.name}
                                                            </div>
                                                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                                <Mail
                                                                    size={12}
                                                                />{" "}
                                                                {user.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {user.role ===
                                                        "admin_master" && (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                                                            Admin
                                                        </span>
                                                    )}
                                                    {user.role === "guru" && (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                            Guru
                                                        </span>
                                                    )}
                                                    {user.role === "siswa" && (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                            Siswa
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {user.role === "siswa" ? (
                                                        user.classroom ? (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                                                <LayoutDashboard
                                                                    size={12}
                                                                />{" "}
                                                                {
                                                                    user
                                                                        .classroom
                                                                        .nama_kelas
                                                                }
                                                            </span>
                                                        ) : (
                                                            <span className="text-red-500 text-xs italic">
                                                                Belum diatur
                                                            </span>
                                                        )
                                                    ) : (
                                                        <span className="text-gray-300 dark:text-gray-600">
                                                            -
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() =>
                                                                openEditModal(
                                                                    user,
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
                                                                    id: user.id,
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
                                                colSpan={4}
                                                className="px-6 py-12 text-center"
                                            >
                                                <div className="flex flex-col items-center justify-center text-gray-400">
                                                    <Users
                                                        size={32}
                                                        className="mb-3 opacity-20"
                                                    />
                                                    <p>
                                                        Tidak ada data pengguna.
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

            {/* Modal Import CSV */}
            {importModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/20 dark:bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-sidebar rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100 dark:border-sidebar-border transform transition-all">
                        <div className="flex items-center gap-3 mb-4 border-b border-gray-100 dark:border-sidebar-border pb-4">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                                <UploadCloud size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Import Pengguna
                            </h2>
                        </div>

                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
                            Unduh{" "}
                            <a
                                href="/admin/users/template"
                                className="text-blue-600 hover:underline font-semibold"
                            >
                                Template CSV
                            </a>{" "}
                            untuk memastikan struktur data sesuai.
                        </p>

                        <form onSubmit={submitImport} className="space-y-5">
                            <div>
                                <input
                                    type="file"
                                    accept=".csv, .txt"
                                    onChange={(e) =>
                                        setImportData(
                                            "file",
                                            e.target.files
                                                ? e.target.files[0]
                                                : null,
                                        )
                                    }
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-black dark:file:text-gray-300 border border-gray-200 dark:border-sidebar-border rounded-xl p-2"
                                    required
                                />
                                {importErrors.file && (
                                    <p className="text-red-500 text-xs mt-1.5">
                                        {importErrors.file}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImportModal(false);
                                        resetImport();
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors dark:bg-black dark:text-gray-300"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={importProcessing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-xl transition-colors disabled:opacity-50"
                                >
                                    {importProcessing
                                        ? "Memproses..."
                                        : "Upload & Import"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Tambah & Edit */}
            {formModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/20 dark:bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-sidebar rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100 dark:border-sidebar-border transform transition-all max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-sidebar-border pb-4">
                            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-lg">
                                {formModal.mode === "add" ? (
                                    <UserPlus size={20} />
                                ) : (
                                    <Edit2 size={20} />
                                )}
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {formModal.mode === "add"
                                    ? "Tambah Pengguna"
                                    : "Edit Pengguna"}
                            </h2>
                        </div>

                        <form onSubmit={submitForm} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Nama Lengkap
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="w-full rounded-xl border-gray-200 dark:border-sidebar-border dark:bg-black focus:ring-emerald-500 focus:border-emerald-500 p-2.5 text-sm"
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
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    className="w-full rounded-xl border-gray-200 dark:border-sidebar-border dark:bg-black focus:ring-emerald-500 focus:border-emerald-500 p-2.5 text-sm"
                                    required
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1.5">
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Password{" "}
                                    {formModal.mode === "edit" && (
                                        <span className="font-normal text-gray-400">
                                            (Opsional)
                                        </span>
                                    )}
                                </label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    className="w-full rounded-xl border-gray-200 dark:border-sidebar-border dark:bg-black focus:ring-emerald-500 focus:border-emerald-500 p-2.5 text-sm"
                                    required={formModal.mode === "add"}
                                    minLength={8}
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-xs mt-1.5">
                                        {errors.password}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Peran (Role)
                                </label>
                                <select
                                    value={data.role}
                                    onChange={(e) =>
                                        setData(
                                            "role",
                                            e.target.value as
                                                | "siswa"
                                                | "guru"
                                                | "admin_master",
                                        )
                                    }
                                    className="w-full rounded-xl border-gray-200 dark:border-sidebar-border dark:bg-black focus:ring-emerald-500 focus:border-emerald-500 p-2.5 text-sm"
                                    required
                                >
                                    <option value="siswa">Siswa</option>
                                    <option value="guru">Guru</option>
                                    <option value="admin_master">
                                        Administrator
                                    </option>
                                </select>
                            </div>
                            {data.role === "siswa" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Pilih Kelas
                                    </label>
                                    <select
                                        value={data.classroom_id}
                                        onChange={(e) =>
                                            setData(
                                                "classroom_id",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-xl border-gray-200 dark:border-sidebar-border dark:bg-black focus:ring-emerald-500 focus:border-emerald-500 p-2.5 text-sm"
                                        required={data.role === "siswa"}
                                    >
                                        <option value="">
                                            -- Pilih Kelas --
                                        </option>
                                        {classrooms.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.nama_kelas}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
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
                                    className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors disabled:opacity-50"
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
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/20 dark:bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-sidebar rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-gray-100 dark:border-sidebar-border text-center transform transition-all">
                        <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-900/30 text-red-600 flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                            Hapus Pengguna?
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                            Data pengguna akan dihapus permanen dari sistem dan
                            tidak dapat dikembalikan.
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
                                            `/admin/users/${deleteModal.id}`,
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
