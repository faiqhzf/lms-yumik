import { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";

// Interfaces (disingkat untuk keringkasan, mengacu pada struktur jadwal)
interface Schedule {
    id: string;
    subject: { name: string };
    user: { name: string };
    meetings: Array<any>; // Menggunakan array relasi dari backend
}

export default function Show({ schedule }: { schedule: Schedule }) {
    const [activeTab, setActiveTab] = useState<number>(1);
    const activeMeeting =
        schedule.meetings.find((m) => m.pertemuan_ke === activeTab) ||
        schedule.meetings[0];

    return (
        <>
            <Head title={`Kelas ${schedule.subject.name}`} />
            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-6 shadow-lg">
                    <h1 className="text-3xl font-bold">
                        {schedule.subject.name}
                    </h1>
                    <p className="text-blue-100 mt-2">
                        Pengajar: {schedule.user.name}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-1 space-y-2">
                        <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-4 px-2">
                            Daftar Pertemuan
                        </h3>
                        <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2">
                            {schedule.meetings.map((meeting) => (
                                <button
                                    key={meeting.id}
                                    onClick={() =>
                                        setActiveTab(meeting.pertemuan_ke)
                                    }
                                    className={`whitespace-nowrap text-left px-4 py-3 rounded-xl transition-all ${
                                        activeTab === meeting.pertemuan_ke
                                            ? "bg-blue-100 text-blue-700 border border-blue-300 font-semibold shadow-sm"
                                            : "bg-white dark:bg-sidebar text-gray-600 border border-gray-200 hover:bg-gray-50"
                                    }`}
                                >
                                    Pertemuan {meeting.pertemuan_ke}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white dark:bg-sidebar border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <h2 className="text-xl font-bold border-b pb-4 mb-6">
                                Pertemuan {activeMeeting.pertemuan_ke}
                            </h2>

                            <div className="space-y-8">
                                <div>
                                    <h4 className="font-semibold mb-2">
                                        Instruksi Pembelajaran
                                    </h4>
                                    <p className="text-sm text-gray-600 bg-gray-50 dark:bg-black p-4 rounded-xl border">
                                        {activeMeeting.rencana_materi ||
                                            "Tidak ada instruksi khusus."}
                                    </p>
                                </div>

                                {activeMeeting.link_vicon && (
                                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                                        <h4 className="font-semibold text-blue-900 mb-1">
                                            Tautan Kelas Online
                                        </h4>
                                        <a
                                            href={activeMeeting.link_vicon}
                                            target="_blank"
                                            className="text-blue-600 hover:underline"
                                        >
                                            {activeMeeting.link_vicon}
                                        </a>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-semibold mb-3 border-b pb-2">
                                            Materi Kelas
                                        </h4>
                                        <ul className="space-y-2">
                                            {activeMeeting.materials.length >
                                            0 ? (
                                                activeMeeting.materials.map(
                                                    (mat: any) => (
                                                        <li key={mat.id}>
                                                            <a
                                                                href={
                                                                    mat.file_url
                                                                }
                                                                target="_blank"
                                                                className="text-sm text-blue-600 hover:underline flex items-center gap-2"
                                                            >
                                                                📄 {mat.judul}
                                                            </a>
                                                        </li>
                                                    ),
                                                )
                                            ) : (
                                                <span className="text-sm text-gray-500">
                                                    Belum ada materi.
                                                </span>
                                            )}
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-3 border-b pb-2">
                                            Tugas
                                        </h4>
                                        <ul className="space-y-2">
                                            {activeMeeting.assignments.length >
                                            0 ? (
                                                activeMeeting.assignments.map(
                                                    (task: any) => (
                                                        <li
                                                            key={task.id}
                                                            className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded border"
                                                        >
                                                            <span className="font-medium">
                                                                {task.judul}
                                                            </span>
                                                            <Link
                                                                href="/siswa/assignments"
                                                                className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                                                            >
                                                                Lihat
                                                            </Link>
                                                        </li>
                                                    ),
                                                )
                                            ) : (
                                                <span className="text-sm text-gray-500">
                                                    Tidak ada tugas.
                                                </span>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Show.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
