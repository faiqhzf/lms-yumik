import { useState, FormEvent } from "react";
import { Head, useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import {
    FileText,
    Download,
    BarChart2,
    Users,
    Calendar,
    CheckCircle,
    BookOpen,
    Filter,
} from "lucide-react";

interface Classroom {
    id: string;
    nama_kelas: string;
}

interface AcademicYear {
    id: string;
    tahun_ajaran: string;
    semester: string;
}

interface Props {
    classrooms: Classroom[];
    academics: AcademicYear[];
    summary: {
        total_ujian: number;
        total_tugas: number;
        rata_kehadiran: string;
    };
}

export default function Index({ classrooms, academics, summary }: Props) {
    const [reportModal, setReportModal] = useState<{
        isOpen: boolean;
        type: "nilai" | "kehadiran" | "guru" | null;
        title: string;
    }>({ isOpen: false, type: null, title: "" });

    const { data, setData, post, processing, reset, errors, clearErrors } =
        useForm({
            academic_year_id: "",
            classroom_id: "all",
            format: "csv",
        });

    const openModal = (type: "nilai" | "kehadiran" | "guru", title: string) => {
        clearErrors();
        reset();
        setReportModal({ isOpen: true, type, title });
    };

    const handleDownload = (e: FormEvent) => {
        e.preventDefault();
        // Endpoint dinamis berdasarkan tipe laporan
        post(`/admin/reports/download/${reportModal.type}`, {
            onSuccess: () => {
                setReportModal({ isOpen: false, type: null, title: "" });
                reset();
            },
        });
    };

    return (
        <>
            <Head title="Laporan & Statistik" />

            <div className="min-h-screen bg-[#F8F9FA] dark:bg-black p-4 sm:p-6 lg:p-8 font-sans">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-sidebar border border-gray-100 dark:border-sidebar-border p-5 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-teal-50 dark:bg-teal-900/30 text-teal-600 rounded-xl">
                                <BarChart2 size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                    Laporan & Statistik
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Unduh rekapitulasi nilai, kehadiran, dan
                                    aktivitas sistem.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Ringkasan Cepat */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-sidebar border border-gray-100 dark:border-sidebar-border rounded-2xl p-5 shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-full">
                                <BookOpen size={20} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Total Tugas Diberikan
                                </p>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {summary.total_tugas || 0}
                                </h3>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-sidebar border border-gray-100 dark:border-sidebar-border rounded-2xl p-5 shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-full">
                                <FileText size={20} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Total Ujian (CBT)
                                </p>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {summary.total_ujian || 0}
                                </h3>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-sidebar border border-gray-100 dark:border-sidebar-border rounded-2xl p-5 shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-600 rounded-full">
                                <CheckCircle size={20} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Rata-rata Kehadiran
                                </p>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {summary.rata_kehadiran || "0%"}
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* Modul Ekspor Laporan */}
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white pt-2">
                        Generator Laporan
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {/* Laporan Nilai */}
                        <div className="bg-white dark:bg-sidebar border border-gray-100 dark:border-sidebar-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                                <BarChart2 size={24} />
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                                Rekap Nilai Siswa
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                Unduh kumpulan nilai tugas dan ujian (CBT) siswa
                                berdasarkan kelas.
                            </p>
                            <button
                                onClick={() =>
                                    openModal("nilai", "Unduh Rekap Nilai")
                                }
                                className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-indigo-50 text-indigo-600 dark:bg-black dark:hover:bg-indigo-900/30 dark:text-indigo-400 py-2.5 rounded-xl text-sm font-medium transition-colors border border-gray-200 dark:border-gray-800"
                            >
                                <Filter size={16} /> Filter & Unduh
                            </button>
                        </div>

                        {/* Laporan Kehadiran */}
                        <div className="bg-white dark:bg-sidebar border border-gray-100 dark:border-sidebar-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                                <Calendar size={24} />
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                                Rekap Absensi
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                Laporan persentase kehadiran, izin, sakit, dan
                                alfa siswa per semester.
                            </p>
                            <button
                                onClick={() =>
                                    openModal(
                                        "kehadiran",
                                        "Unduh Rekap Kehadiran",
                                    )
                                }
                                className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-emerald-50 text-emerald-600 dark:bg-black dark:hover:bg-emerald-900/30 dark:text-emerald-400 py-2.5 rounded-xl text-sm font-medium transition-colors border border-gray-200 dark:border-gray-800"
                            >
                                <Filter size={16} /> Filter & Unduh
                            </button>
                        </div>

                        {/* Laporan Kinerja Guru */}
                        <div className="bg-white dark:bg-sidebar border border-gray-100 dark:border-sidebar-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/30 text-orange-600 rounded-xl flex items-center justify-center mb-4">
                                <Users size={24} />
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                                Data & Jadwal Guru
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                Unduh daftar guru aktif beserta beban jam
                                mengajar dan kelas ampuannya.
                            </p>
                            <button
                                onClick={() =>
                                    openModal("guru", "Unduh Data Guru")
                                }
                                className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-orange-50 text-orange-600 dark:bg-black dark:hover:bg-orange-900/30 dark:text-orange-400 py-2.5 rounded-xl text-sm font-medium transition-colors border border-gray-200 dark:border-gray-800"
                            >
                                <Filter size={16} /> Filter & Unduh
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Filter & Unduh */}
            {reportModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/20 dark:bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-sidebar rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100 dark:border-sidebar-border">
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-sidebar-border pb-4">
                            <div className="p-2 bg-teal-50 dark:bg-teal-900/30 text-teal-600 rounded-lg">
                                <Download size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {reportModal.title}
                            </h2>
                        </div>

                        <form onSubmit={handleDownload} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Tahun Ajaran & Semester
                                </label>
                                <select
                                    value={data.academic_year_id}
                                    onChange={(e) =>
                                        setData(
                                            "academic_year_id",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-xl border-gray-200 dark:border-sidebar-border dark:bg-black focus:ring-teal-500 focus:border-teal-500 p-2.5 text-sm"
                                    required
                                >
                                    <option value="">
                                        -- Pilih Periode Akademik --
                                    </option>
                                    {academics.map((a) => (
                                        <option key={a.id} value={a.id}>
                                            {a.tahun_ajaran} - Semester{" "}
                                            {a.semester}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Opsi Kelas hanya muncul jika bukan laporan guru */}
                            {reportModal.type !== "guru" && (
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
                                        className="w-full rounded-xl border-gray-200 dark:border-sidebar-border dark:bg-black focus:ring-teal-500 focus:border-teal-500 p-2.5 text-sm"
                                    >
                                        <option value="all">Semua Kelas</option>
                                        {classrooms.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.nama_kelas}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Format Laporan
                                </label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="format"
                                            value="csv"
                                            checked={data.format === "csv"}
                                            onChange={(e) =>
                                                setData(
                                                    "format",
                                                    e.target.value,
                                                )
                                            }
                                            className="text-teal-600 focus:ring-teal-500 border-gray-300 dark:border-gray-600 dark:bg-black"
                                        />
                                        <span className="text-sm dark:text-gray-300">
                                            Spreadsheet (CSV/Excel)
                                        </span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="format"
                                            value="pdf"
                                            checked={data.format === "pdf"}
                                            onChange={(e) =>
                                                setData(
                                                    "format",
                                                    e.target.value,
                                                )
                                            }
                                            className="text-teal-600 focus:ring-teal-500 border-gray-300 dark:border-gray-600 dark:bg-black"
                                        />
                                        <span className="text-sm dark:text-gray-300">
                                            Dokumen (PDF)
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-sidebar-border">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setReportModal({
                                            isOpen: false,
                                            type: null,
                                            title: "",
                                        })
                                    }
                                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors dark:bg-black dark:text-gray-300"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors disabled:opacity-50"
                                >
                                    <Download size={16} /> Unduh File
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

Index.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
