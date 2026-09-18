import { useState, FormEvent } from "react";
import { Head, useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Link } from "lucide-react";

interface Exam {
    id: string;
    judul: string;
    deskripsi: string | null;
    durasi_menit: number;
    waktu_buka: string;
    waktu_tutup: string;
    izinkan_upload: boolean;
    questions_count: number;
    sessions_count: number;
    teaching_schedule: {
        id: string;
        subject: { name: string };
        classroom: { nama_kelas: string };
    };
}

interface Props {
    exams: Exam[];
    schedules: {
        id: string;
        subject: { name: string };
        classroom: { nama_kelas: string };
    }[];
}

export default function Index({ exams, schedules = [] }: Props) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const { data, setData, post, processing, reset, errors, clearErrors } =
        useForm({
            teaching_schedule_id: "",
            judul: "",
            deskripsi: "",
            durasi_menit: 90,
            waktu_buka: "",
            waktu_tutup: "",
            izinkan_upload: false,
        });

    const openAddModal = () => {
        clearErrors();
        reset();
        setIsAddModalOpen(true);
    };

    const submitForm = (e: FormEvent) => {
        e.preventDefault();
        post("/guru/exams", {
            onSuccess: () => {
                setIsAddModalOpen(false);
                reset();
            },
        });
    };

    return (
        <>
            <Head title="Manajemen Ujian" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 sm:p-6 lg:p-8 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            Manajemen Ujian (CBT)
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Kelola UTS, UAS, atau Kuis untuk kelas Anda.
                        </p>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        + Buat Ujian Baru
                    </button>
                </div>

                <div className="bg-white dark:bg-sidebar border border-sidebar-border/70 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                            <thead className="bg-gray-50 dark:bg-black border-b border-sidebar-border/70 text-gray-900 dark:text-gray-100 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">
                                        Informasi Ujian
                                    </th>
                                    <th className="px-6 py-4 font-semibold">
                                        Jadwal Akses
                                    </th>
                                    <th className="px-6 py-4 font-semibold">
                                        Statistik
                                    </th>
                                    <th className="px-6 py-4 font-semibold text-right">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border/70">
                                {exams.length > 0 ? (
                                    exams.map((exam) => (
                                        <tr
                                            key={exam.id}
                                            className="hover:bg-gray-50 dark:hover:bg-sidebar/50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900 dark:text-gray-100">
                                                    {exam.judul}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {
                                                        exam.teaching_schedule
                                                            .subject.name
                                                    }{" "}
                                                    -{" "}
                                                    {
                                                        exam.teaching_schedule
                                                            .classroom
                                                            .nama_kelas
                                                    }
                                                </div>
                                                {exam.izinkan_upload && (
                                                    <span className="inline-block mt-2 bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                                                        Hybrid Mode
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-xs">
                                                <div>
                                                    <span className="font-medium text-green-600">
                                                        Buka:
                                                    </span>{" "}
                                                    {new Date(
                                                        exam.waktu_buka,
                                                    ).toLocaleString("id-ID")}
                                                </div>
                                                <div className="mt-1">
                                                    <span className="font-medium text-red-600">
                                                        Tutup:
                                                    </span>{" "}
                                                    {new Date(
                                                        exam.waktu_tutup,
                                                    ).toLocaleString("id-ID")}
                                                </div>
                                                <div className="mt-1 font-semibold">
                                                    {exam.durasi_menit} Menit
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs">
                                                <div>
                                                    {exam.questions_count} Soal
                                                    PG
                                                </div>
                                                <div>
                                                    {exam.sessions_count}{" "}
                                                    Peserta Mengerjakan
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-3">
                                                <Link
                                                    href={`/guru/exams/${exam.id}/questions`}
                                                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-xs"
                                                >
                                                    Kelola Soal
                                                </Link>
                                                <Link
                                                    href={`/guru/exams/${exam.id}/sessions`}
                                                    className="text-green-600 dark:text-green-400 hover:underline font-medium text-xs"
                                                >
                                                    Monitoring
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-6 py-8 text-center text-gray-500 italic"
                                        >
                                            Belum ada data ujian.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Tambah Ujian */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-sidebar rounded-2xl p-6 w-full max-w-lg shadow-xl border border-gray-200 dark:border-sidebar-border max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                            Buat Pengaturan Ujian
                        </h2>
                        <form onSubmit={submitForm} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Pilih Kelas & Mata Pelajaran
                                </label>
                                <select
                                    value={data.teaching_schedule_id}
                                    onChange={(e) =>
                                        setData(
                                            "teaching_schedule_id",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-lg border-gray-300 dark:border-sidebar-border dark:bg-black p-2.5 text-sm"
                                    required
                                >
                                    <option value="">-- Pilih --</option>
                                    {schedules.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.subject.name} -{" "}
                                            {s.classroom.nama_kelas}
                                        </option>
                                    ))}
                                </select>
                                {errors.teaching_schedule_id && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.teaching_schedule_id}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Judul Ujian
                                </label>
                                <input
                                    type="text"
                                    value={data.judul}
                                    onChange={(e) =>
                                        setData("judul", e.target.value)
                                    }
                                    placeholder="Cth: Ujian Akhir Semester"
                                    className="w-full rounded-lg border-gray-300 dark:border-sidebar-border dark:bg-black p-2.5 text-sm"
                                    required
                                />
                                {errors.judul && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.judul}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Waktu Buka
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={data.waktu_buka}
                                        onChange={(e) =>
                                            setData(
                                                "waktu_buka",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-lg border-gray-300 dark:border-sidebar-border dark:bg-black p-2.5 text-sm"
                                        required
                                    />
                                    {errors.waktu_buka && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.waktu_buka}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Waktu Tutup
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={data.waktu_tutup}
                                        onChange={(e) =>
                                            setData(
                                                "waktu_tutup",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-lg border-gray-300 dark:border-sidebar-border dark:bg-black p-2.5 text-sm"
                                        required
                                    />
                                    {errors.waktu_tutup && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.waktu_tutup}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Durasi Pengerjaan (Menit)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={data.durasi_menit}
                                    onChange={(e) =>
                                        setData(
                                            "durasi_menit",
                                            parseInt(e.target.value),
                                        )
                                    }
                                    className="w-full rounded-lg border-gray-300 dark:border-sidebar-border dark:bg-black p-2.5 text-sm"
                                    required
                                />
                                {errors.durasi_menit && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.durasi_menit}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/50">
                                <input
                                    type="checkbox"
                                    id="izinkan_upload"
                                    checked={data.izinkan_upload}
                                    onChange={(e) =>
                                        setData(
                                            "izinkan_upload",
                                            e.target.checked,
                                        )
                                    }
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label
                                    htmlFor="izinkan_upload"
                                    className="text-sm font-medium text-blue-900 dark:text-blue-100 cursor-pointer"
                                >
                                    Sertakan Opsi Upload File (Essay/Kertas)
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                >
                                    Simpan Ujian
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
