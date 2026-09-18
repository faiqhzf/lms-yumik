import { useState, FormEvent, useEffect } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";

interface Material {
    id: string;
    judul: string;
    file_url: string;
}

interface Assignment {
    id: string;
    judul: string;
    deskripsi: string;
    deadline: string;
}

interface Attendance {
    siswa_id: string;
    status: string;
}

interface Meeting {
    id: string;
    pertemuan_ke: number;
    tanggal: string | null;
    rencana_materi: string | null;
    metode: "online" | "offline";
    link_vicon: string | null;
    materials: Material[];
    assignments: Assignment[];
    attendances: Attendance[];
}

interface Schedule {
    id: string;
    subject: { name: string };
    classroom: { nama_kelas: string };
    meetings: Meeting[];
}

interface BankMateri {
    id: string;
    judul: string;
}

interface Student {
    id: string;
    name: string;
}

interface Props {
    schedule: Schedule;
    bankMateri: BankMateri[];
    students: Student[];
}

export default function Show({
    schedule,
    bankMateri = [],
    students = [],
}: Props) {
    const [activeTab, setActiveTab] = useState<number>(1);

    // State untuk Modals
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isAbsensiModalOpen, setIsAbsensiModalOpen] = useState(false);

    const activeMeeting =
        schedule.meetings.find((m) => m.pertemuan_ke === activeTab) ||
        schedule.meetings[0];

    // Form 1: Edit Sesi & Materi
    const editForm = useForm({
        rencana_materi: activeMeeting.rencana_materi || "",
        metode: activeMeeting.metode || "offline",
        link_vicon: activeMeeting.link_vicon || "",
        material_ids: activeMeeting.materials.map((m) => m.id),
    });

    // Form 2: Tambah Tugas
    const taskForm = useForm({
        meeting_id: activeMeeting.id,
        judul: "",
        deskripsi: "",
        deadline: "",
    });

    // Form 3: Absensi Kelas
    const absensiForm = useForm({
        attendances: [] as { siswa_id: string; status: string }[],
    });

    // Sinkronisasi data form ketika tab pertemuan berpindah
    useEffect(() => {
        editForm.setData({
            rencana_materi: activeMeeting.rencana_materi || "",
            metode: activeMeeting.metode || "offline",
            link_vicon: activeMeeting.link_vicon || "",
            material_ids: activeMeeting.materials.map((m) => m.id),
        });

        taskForm.setData("meeting_id", activeMeeting.id);
    }, [activeMeeting]);

    const handleMaterialChange = (id: string, checked: boolean) => {
        if (checked) {
            editForm.setData("material_ids", [
                ...editForm.data.material_ids,
                id,
            ]);
        } else {
            editForm.setData(
                "material_ids",
                editForm.data.material_ids.filter((mId) => mId !== id),
            );
        }
    };

    const submitEdit = (e: FormEvent) => {
        e.preventDefault();
        editForm.put(`/guru/meetings/${activeMeeting.id}`, {
            onSuccess: () => setIsEditModalOpen(false),
        });
    };

    const submitTask = (e: FormEvent) => {
        e.preventDefault();
        taskForm.post("/guru/assignments", {
            onSuccess: () => {
                setIsTaskModalOpen(false);
                taskForm.reset("judul", "deskripsi", "deadline");
            },
        });
    };

    const openAbsensiModal = () => {
        const existingAttendances = activeMeeting.attendances || [];
        absensiForm.setData(
            "attendances",
            students.map((student) => {
                const record = existingAttendances.find(
                    (a) => a.siswa_id === student.id,
                );
                return {
                    siswa_id: student.id,
                    status: record ? record.status : "hadir",
                };
            }),
        );
        setIsAbsensiModalOpen(true);
    };

    const submitAbsensi = (e: FormEvent) => {
        e.preventDefault();
        absensiForm.put(`/guru/meetings/${activeMeeting.id}/attendances`, {
            onSuccess: () => setIsAbsensiModalOpen(false),
        });
    };

    return (
        <>
            <Head title={`Kelas ${schedule.subject.name}`} />

            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                <div className="bg-blue-600 text-white rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center shadow-lg">
                    <div>
                        <h1 className="text-3xl font-bold">
                            {schedule.subject.name}
                        </h1>
                        <p className="text-blue-100 mt-2">
                            Kelas: {schedule.classroom.nama_kelas}
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex gap-4 text-center">
                        <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                            <p className="text-xs uppercase tracking-wider opacity-80">
                                Total Pertemuan
                            </p>
                            <p className="text-2xl font-bold">
                                {schedule.meetings.length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-1 space-y-2">
                        <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-4 px-2">
                            Aktivitas Pertemuan
                        </h3>
                        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                            {schedule.meetings.map((meeting) => (
                                <button
                                    key={meeting.id}
                                    onClick={() =>
                                        setActiveTab(meeting.pertemuan_ke)
                                    }
                                    className={`whitespace-nowrap text-left px-4 py-3 rounded-xl transition-all ${
                                        activeTab === meeting.pertemuan_ke
                                            ? "bg-blue-100 text-blue-700 border border-blue-300 font-semibold shadow-sm"
                                            : "bg-white dark:bg-sidebar text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-sidebar-border hover:bg-gray-50 dark:hover:bg-sidebar/50"
                                    }`}
                                >
                                    Pertemuan {meeting.pertemuan_ke}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white dark:bg-sidebar border border-gray-200 dark:border-sidebar-border rounded-2xl p-6 shadow-sm">
                            <div className="flex justify-between items-start border-b border-gray-200 dark:border-sidebar-border pb-4 mb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                        Pertemuan {activeMeeting.pertemuan_ke}
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {activeMeeting.tanggal
                                            ? new Date(
                                                  activeMeeting.tanggal,
                                              ).toLocaleDateString("id-ID")
                                            : "Tanggal belum diatur"}
                                    </p>
                                </div>
                                <div className="space-x-3">
                                    <button
                                        onClick={openAbsensiModal}
                                        className="text-sm bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800 px-3 py-1.5 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                                    >
                                        Kelola Absensi
                                    </button>
                                    <button
                                        onClick={() => setIsEditModalOpen(true)}
                                        className="text-sm bg-gray-100 dark:bg-black border border-gray-200 dark:border-sidebar-border px-3 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-900 transition-colors"
                                    >
                                        Edit Sesi
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                        Rencana Materi
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-black p-4 rounded-xl border border-gray-200 dark:border-sidebar-border">
                                        {activeMeeting.rencana_materi ||
                                            "Belum ada rencana materi yang ditulis."}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 dark:bg-black p-4 rounded-xl border border-gray-200 dark:border-sidebar-border">
                                        <h4 className="font-semibold text-sm text-gray-500 mb-1">
                                            Metode Pembelajaran
                                        </h4>
                                        <p className="capitalize text-gray-900 dark:text-gray-100 font-medium">
                                            {activeMeeting.metode}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-black p-4 rounded-xl border border-gray-200 dark:border-sidebar-border">
                                        <h4 className="font-semibold text-sm text-gray-500 mb-1">
                                            Link Video Conference
                                        </h4>
                                        {activeMeeting.link_vicon ? (
                                            <a
                                                href={activeMeeting.link_vicon}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                                            >
                                                {activeMeeting.link_vicon}
                                            </a>
                                        ) : (
                                            <span className="text-gray-400 italic">
                                                Tidak tersedia
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-3 border-b border-gray-200 dark:border-sidebar-border pb-2">
                                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                                            Tugas Pertemuan
                                        </h4>
                                        <button
                                            onClick={() =>
                                                setIsTaskModalOpen(true)
                                            }
                                            className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded-md transition-colors"
                                        >
                                            + Tambah Tugas
                                        </button>
                                    </div>
                                    {activeMeeting.assignments.length > 0 ? (
                                        <ul className="space-y-3">
                                            {activeMeeting.assignments.map(
                                                (task) => (
                                                    <li
                                                        key={task.id}
                                                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 border border-gray-200 dark:border-sidebar-border rounded-lg bg-gray-50 dark:bg-black gap-2"
                                                    >
                                                        <div>
                                                            <span className="font-medium text-sm text-gray-800 dark:text-gray-200 block">
                                                                {task.judul}
                                                            </span>
                                                            <span className="text-xs text-red-500 font-mono">
                                                                Tenggat:{" "}
                                                                {new Date(
                                                                    task.deadline,
                                                                ).toLocaleString(
                                                                    "id-ID",
                                                                )}
                                                            </span>
                                                        </div>
                                                        <Link
                                                            href={`/guru/assignments/${task.id}/submissions`}
                                                            className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline text-left sm:text-right"
                                                        >
                                                            Lihat Pengumpulan
                                                        </Link>
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-gray-500 italic">
                                            Tidak ada tugas pada sesi ini.
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 border-b border-gray-200 dark:border-sidebar-border pb-2">
                                        Materi Belajar
                                    </h4>
                                    {activeMeeting.materials.length > 0 ? (
                                        <ul className="space-y-3">
                                            {activeMeeting.materials.map(
                                                (mat) => (
                                                    <li
                                                        key={mat.id}
                                                        className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                                    >
                                                        📄{" "}
                                                        <a href={mat.file_url}>
                                                            {mat.judul}
                                                        </a>
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-gray-500 italic">
                                            Tidak ada file materi yang
                                            dilampirkan.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Edit Sesi */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-sidebar rounded-2xl p-6 w-full max-w-lg shadow-xl border border-gray-200 dark:border-sidebar-border max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                            Edit Pertemuan {activeMeeting.pertemuan_ke}
                        </h2>

                        <form onSubmit={submitEdit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Metode
                                </label>
                                <select
                                    value={editForm.data.metode}
                                    onChange={(e) =>
                                        editForm.setData(
                                            "metode",
                                            e.target.value as
                                                | "online"
                                                | "offline",
                                        )
                                    }
                                    className="w-full rounded-lg border-gray-300 dark:border-sidebar-border dark:bg-black p-2.5"
                                >
                                    <option value="offline">
                                        Offline / Tatap Muka
                                    </option>
                                    <option value="online">
                                        Online / Daring
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Rencana Materi
                                </label>
                                <textarea
                                    value={editForm.data.rencana_materi}
                                    onChange={(e) =>
                                        editForm.setData(
                                            "rencana_materi",
                                            e.target.value,
                                        )
                                    }
                                    rows={3}
                                    className="w-full rounded-lg border-gray-300 dark:border-sidebar-border dark:bg-black p-2.5"
                                    placeholder="Tuliskan sub-bab atau topik yang akan dibahas..."
                                />
                            </div>

                            {editForm.data.metode === "online" && (
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Link Vicon (Gmeet/Zoom)
                                    </label>
                                    <input
                                        type="url"
                                        value={editForm.data.link_vicon}
                                        onChange={(e) =>
                                            editForm.setData(
                                                "link_vicon",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-lg border-gray-300 dark:border-sidebar-border dark:bg-black p-2.5"
                                        placeholder="https://meet.google.com/..."
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Tautkan Materi dari Bank Materi
                                </label>
                                <div className="space-y-2 max-h-40 overflow-y-auto p-3 border border-gray-300 dark:border-sidebar-border rounded-lg bg-gray-50/50 dark:bg-black/50">
                                    {bankMateri.length > 0 ? (
                                        bankMateri.map((mat) => (
                                            <label
                                                key={mat.id}
                                                className="flex items-center gap-3 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-sidebar/50 p-1.5 rounded-md transition-colors"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={editForm.data.material_ids.includes(
                                                        mat.id,
                                                    )}
                                                    onChange={(e) =>
                                                        handleMaterialChange(
                                                            mat.id,
                                                            e.target.checked,
                                                        )
                                                    }
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-white dark:bg-sidebar"
                                                />
                                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                                    📄 {mat.judul}
                                                </span>
                                            </label>
                                        ))
                                    ) : (
                                        <p className="text-xs text-gray-500 italic">
                                            Belum ada materi di Bank Materi
                                            Anda.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditModalOpen(false);
                                        editForm.reset();
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-black dark:text-gray-300 dark:hover:bg-gray-900"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    Simpan Perubahan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Tambah Tugas */}
            {isTaskModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-sidebar rounded-2xl p-6 w-full max-w-lg shadow-xl border border-gray-200 dark:border-sidebar-border">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                            Buat Tugas - Pertemuan {activeMeeting.pertemuan_ke}
                        </h2>

                        <form onSubmit={submitTask} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Judul Tugas
                                </label>
                                <input
                                    type="text"
                                    value={taskForm.data.judul}
                                    onChange={(e) =>
                                        taskForm.setData(
                                            "judul",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-lg border-gray-300 dark:border-sidebar-border dark:bg-black p-2.5"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Batas Waktu (Deadline)
                                </label>
                                <input
                                    type="datetime-local"
                                    value={taskForm.data.deadline}
                                    onChange={(e) =>
                                        taskForm.setData(
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
                                    Deskripsi / Instruksi
                                </label>
                                <textarea
                                    value={taskForm.data.deskripsi}
                                    onChange={(e) =>
                                        taskForm.setData(
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
                                        setIsTaskModalOpen(false);
                                        taskForm.reset();
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-black"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={taskForm.processing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                >
                                    Simpan Tugas
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Absensi Kelas */}
            {isAbsensiModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-sidebar rounded-2xl p-6 w-full max-w-2xl shadow-xl border border-gray-200 dark:border-sidebar-border max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                            Absensi Kelas - {schedule.classroom.nama_kelas}
                        </h2>

                        <form onSubmit={submitAbsensi}>
                            <table className="w-full text-sm text-left mb-6 text-gray-700 dark:text-gray-300">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-sidebar-border">
                                        <th className="py-3 font-semibold">
                                            Nama Siswa
                                        </th>
                                        <th className="py-3 font-semibold text-center">
                                            Status Kehadiran
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((student, index) => (
                                        <tr
                                            key={student.id}
                                            className="border-b border-gray-100 dark:border-sidebar-border/50"
                                        >
                                            <td className="py-3">
                                                {student.name}
                                            </td>
                                            <td className="py-3">
                                                <div className="flex justify-center gap-3">
                                                    {[
                                                        "hadir",
                                                        "izin",
                                                        "sakit",
                                                        "alfa",
                                                    ].map((status) => (
                                                        <label
                                                            key={status}
                                                            className="flex items-center gap-1.5 cursor-pointer hover:opacity-80"
                                                        >
                                                            <input
                                                                type="radio"
                                                                name={`status_${student.id}`}
                                                                value={status}
                                                                checked={
                                                                    absensiForm
                                                                        .data
                                                                        .attendances[
                                                                        index
                                                                    ]
                                                                        ?.status ===
                                                                    status
                                                                }
                                                                onChange={(
                                                                    e,
                                                                ) => {
                                                                    const newAttendances =
                                                                        [
                                                                            ...absensiForm
                                                                                .data
                                                                                .attendances,
                                                                        ];
                                                                    newAttendances[
                                                                        index
                                                                    ].status =
                                                                        e.target.value;
                                                                    absensiForm.setData(
                                                                        "attendances",
                                                                        newAttendances,
                                                                    );
                                                                }}
                                                                className="text-blue-600 focus:ring-blue-500 bg-white dark:bg-black border-gray-300 dark:border-sidebar-border"
                                                            />
                                                            <span className="capitalize text-xs font-medium">
                                                                {status}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAbsensiModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-black dark:text-gray-300"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={absensiForm.processing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    Simpan Absensi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

Show.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
