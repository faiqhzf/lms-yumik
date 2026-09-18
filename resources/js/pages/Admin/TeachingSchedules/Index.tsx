import { useState, FormEvent, useMemo } from "react";
import { Head, useForm, router, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import {
    Plus,
    Edit2,
    Trash2,
    Calendar,
    LayoutDashboard,
    Filter,
    AlertCircle,
    Users,
} from "lucide-react";

interface Teacher {
    id: string;
    name: string;
}

interface Subject {
    id: string;
    name: string;
    tingkat: string;
}

interface Classroom {
    id: string;
    nama_kelas: string;
    wali_kelas_id?: string | null;
}

interface AcademicYear {
    id: string;
    tahun_ajaran: string;
    semester: string;
}

interface TeachingSchedule {
    id: string;
    user: Teacher;
    subject: Subject;
    classroom: Classroom;
}

interface PaginatedData {
    data: TeachingSchedule[];
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    teaching_schedules: PaginatedData;
    teachers: Teacher[];
    subjects: Subject[];
    classrooms: Classroom[];
    activeAcademic: AcademicYear | null;
}

export default function Index({
    teaching_schedules,
    teachers,
    subjects,
    classrooms,
    activeAcademic,
}: Props) {
    const [modal, setModal] = useState<{
        type: "create" | "edit" | null;
        data?: TeachingSchedule;
    }>({ type: null });
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        id: string | null;
    }>({ isOpen: false, id: null });
    const [filterTingkat, setFilterTingkat] = useState<string>("all");

    const { data, setData, post, put, processing, reset, errors, clearErrors } =
        useForm({
            id: "",
            user_id: "",
            subject_id: "",
            classroom_id: [] as string[] | string,
        });

    const filteredClassrooms = useMemo(() => {
        if (!data.subject_id) return classrooms;
        const selectedSubject = subjects.find((s) => s.id === data.subject_id);
        if (!selectedSubject) return classrooms;
        return classrooms.filter((c) =>
            c.nama_kelas.startsWith(selectedSubject.tingkat.toString()),
        );
    }, [data.subject_id, classrooms, subjects]);

    const groupedSchedules = Object.values(
        teaching_schedules.data.reduce(
            (acc, curr) => {
                if (
                    filterTingkat !== "all" &&
                    !curr.classroom.nama_kelas.startsWith(filterTingkat)
                )
                    return acc;

                if (!acc[curr.user.id]) {
                    const waliKelasData = classrooms.find(
                        (c) => c.wali_kelas_id === curr.user.id,
                    );
                    acc[curr.user.id] = {
                        teacher: curr.user,
                        isWaliKelas: waliKelasData
                            ? waliKelasData.nama_kelas
                            : null,
                        assignments: [],
                    };
                }
                acc[curr.user.id].assignments.push(curr);
                return acc;
            },
            {} as Record<
                string,
                {
                    teacher: Teacher;
                    isWaliKelas: string | null;
                    assignments: TeachingSchedule[];
                }
            >,
        ),
    );

    const openModal = (type: "create" | "edit", item?: TeachingSchedule) => {
        clearErrors();
        if (type === "create") {
            reset();
            setData({ id: "", user_id: "", subject_id: "", classroom_id: [] });
        } else if (item) {
            setData({
                id: item.id,
                user_id: item.user.id,
                subject_id: item.subject.id,
                classroom_id: item.classroom.id,
            });
        }
        setModal({ type, data: item });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (modal.type === "create") {
            post("/admin/teaching-schedules", {
                onSuccess: () => {
                    setModal({ type: null });
                    reset();
                },
            });
        } else if (modal.type === "edit") {
            put(`/admin/teaching-schedules/${data.id}`, {
                onSuccess: () => {
                    setModal({ type: null });
                    reset();
                },
            });
        }
    };

    if (!activeAcademic) {
        return (
            <div className="min-h-screen bg-[#F8F9FA] dark:bg-black flex items-center justify-center p-6">
                <div className="bg-white dark:bg-sidebar p-8 rounded-2xl shadow-sm text-center max-w-md border border-red-100 dark:border-red-900/30">
                    <AlertCircle
                        size={48}
                        className="text-red-500 mx-auto mb-4"
                    />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Periode Akademik Belum Aktif
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Penjadwalan mengajar memerlukan Tahun Ajaran yang aktif.
                        Silakan atur terlebih dahulu.
                    </p>
                    <Link
                        href="/admin/academics"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
                    >
                        Ke Menu Akademik
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head title="Manajemen Penugasan" />
            <div className="min-h-screen bg-[#F8F9FA] dark:bg-black p-4 sm:p-6 lg:p-8 font-sans">
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-sidebar border border-gray-100 dark:border-sidebar-border p-5 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                    Penugasan Mengajar
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Semester Aktif:{" "}
                                    <strong className="text-indigo-600 dark:text-indigo-400">
                                        {activeAcademic.tahun_ajaran} -{" "}
                                        {activeAcademic.semester}
                                    </strong>
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
                                    className="w-full sm:w-40 pl-9 pr-4 py-2 bg-gray-50 dark:bg-black border-transparent rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:text-gray-200"
                                >
                                    <option value="all">Semua Tingkat</option>
                                    <option value="10">Kelas 10</option>
                                    <option value="11">Kelas 11</option>
                                    <option value="12">Kelas 12</option>
                                </select>
                            </div>
                            <button
                                onClick={() => openModal("create")}
                                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap shadow-sm"
                            >
                                <Plus size={18} /> Penugasan Baru
                            </button>
                        </div>
                    </div>

                    {groupedSchedules.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {groupedSchedules.map((group, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white dark:bg-sidebar border border-gray-100 dark:border-sidebar-border rounded-2xl p-5 shadow-sm"
                                >
                                    <div className="flex justify-between items-start mb-4 border-b border-gray-50 dark:border-sidebar-border/50 pb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-black flex items-center justify-center text-gray-500 shrink-0">
                                                    <Users size={14} />
                                                </div>
                                                <h3 className="font-bold text-gray-900 dark:text-white leading-tight">
                                                    {group.teacher.name}
                                                </h3>
                                            </div>
                                            {group.isWaliKelas && (
                                                <span className="inline-block mt-2 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md ml-10">
                                                    Wali Kelas:{" "}
                                                    {group.isWaliKelas}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xs font-medium text-gray-500 bg-gray-50 dark:bg-black px-2 py-1 rounded-lg shrink-0">
                                            {group.assignments.length} Kelas
                                        </div>
                                    </div>
                                    <ul className="space-y-3">
                                        {group.assignments.map((item) => (
                                            <li
                                                key={item.id}
                                                className="flex justify-between items-center p-3 bg-gray-50/50 dark:bg-black/50 rounded-xl group relative overflow-hidden hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                            >
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm mb-1">
                                                        {item.subject.name}
                                                    </p>
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                        <LayoutDashboard
                                                            size={12}
                                                        />{" "}
                                                        Kelas{" "}
                                                        {
                                                            item.classroom
                                                                .nama_kelas
                                                        }
                                                    </div>
                                                </div>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-3 top-1/2 -translate-y-1/2 bg-white dark:bg-sidebar p-1 shadow-sm rounded-lg border border-gray-100 dark:border-gray-700">
                                                    <button
                                                        onClick={() =>
                                                            openModal(
                                                                "edit",
                                                                item,
                                                            )
                                                        }
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-md"
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
                                                        className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded-md"
                                                        title="Cabut"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-sidebar border border-gray-100 dark:border-sidebar-border rounded-2xl shadow-sm p-12 text-center">
                            <div className="flex flex-col items-center justify-center text-gray-400">
                                <Calendar
                                    size={48}
                                    className="mb-4 opacity-20"
                                />
                                <p className="text-gray-500 font-medium">
                                    Belum ada penugasan mengajar.
                                </p>
                                <p className="text-sm mt-1">
                                    Gunakan tombol 'Penugasan Baru' atau
                                    sesuaikan filter tingkat.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {(modal.type === "create" || modal.type === "edit") && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/20 dark:bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-sidebar rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100 dark:border-sidebar-border">
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-sidebar-border pb-4">
                            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-lg">
                                {modal.type === "create" ? (
                                    <Plus size={20} />
                                ) : (
                                    <Edit2 size={20} />
                                )}
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {modal.type === "create"
                                    ? "Tambah Penugasan"
                                    : "Edit Penugasan"}
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Guru Pengajar
                                </label>
                                <select
                                    value={data.user_id}
                                    onChange={(e) =>
                                        setData("user_id", e.target.value)
                                    }
                                    className="w-full rounded-xl border-gray-200 dark:border-sidebar-border dark:bg-black p-2.5 text-sm"
                                    required
                                >
                                    <option value="">-- Pilih Guru --</option>
                                    {teachers.map((t) => (
                                        <option key={t.id} value={t.id}>
                                            {t.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.user_id && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.user_id}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Mata Pelajaran
                                </label>
                                <select
                                    value={data.subject_id}
                                    onChange={(e) =>
                                        setData("subject_id", e.target.value)
                                    }
                                    className="w-full rounded-xl border-gray-200 dark:border-sidebar-border dark:bg-black p-2.5 text-sm"
                                    required
                                >
                                    <option value="">-- Pilih Mapel --</option>
                                    {subjects.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.name} (Tingkat {s.tingkat})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Kelas Tujuan{" "}
                                    {modal.type === "create" &&
                                        "(Bisa Multi-Select)"}
                                </label>
                                <select
                                    multiple={modal.type === "create"}
                                    value={data.classroom_id}
                                    onChange={(e) => {
                                        modal.type === "create"
                                            ? setData(
                                                  "classroom_id",
                                                  Array.from(
                                                      e.target.selectedOptions,
                                                      (o) => o.value,
                                                  ),
                                              )
                                            : setData(
                                                  "classroom_id",
                                                  e.target.value,
                                              );
                                    }}
                                    className={`w-full rounded-xl border-gray-200 dark:border-sidebar-border dark:bg-black p-2.5 text-sm ${modal.type === "create" ? "h-32" : ""}`}
                                    required
                                >
                                    {modal.type === "edit" && (
                                        <option value="">
                                            -- Pilih Kelas --
                                        </option>
                                    )}
                                    {filteredClassrooms.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.nama_kelas}
                                        </option>
                                    ))}
                                </select>
                                {(errors as Record<string, string>).error && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {
                                            (errors as Record<string, string>)
                                                .error
                                        }
                                    </p>
                                )}
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-sidebar-border"></div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-sidebar-border"></div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-sidebar-border"></div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-sidebar-border">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setModal({ type: null });
                                        reset();
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/20 dark:bg-black/50 p-4">
                    <div className="bg-white dark:bg-sidebar rounded-2xl p-6 max-w-sm text-center">
                        <Trash2
                            size={24}
                            className="text-red-500 mx-auto mb-4"
                        />
                        <h3 className="font-bold mb-2">Cabut Penugasan?</h3>
                        <div className="flex gap-3 justify-center mt-6">
                            <button
                                onClick={() =>
                                    setDeleteModal({ isOpen: false, id: null })
                                }
                                className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-50 rounded-xl"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() =>
                                    router.delete(
                                        `/admin/teaching-schedules/${deleteModal.id}`,
                                        {
                                            onSuccess: () =>
                                                setDeleteModal({
                                                    isOpen: false,
                                                    id: null,
                                                }),
                                        },
                                    )
                                }
                                className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl"
                            >
                                Ya, Cabut
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

Index.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
