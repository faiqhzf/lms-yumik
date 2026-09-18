import { useState, FormEvent } from "react";
import { Head, useForm, router, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import {
    Users,
    UserPlus,
    UserMinus,
    ArrowLeft,
    AlertCircle,
    GraduationCap,
} from "lucide-react";

interface User {
    id: string;
    name: string;
    nis?: string;
}

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
    classroom: Classroom;
    studentsInClass: User[];
    availableStudents: User[];
    activeAcademic: AcademicYear | null;
}

export default function Members({
    classroom,
    studentsInClass,
    availableStudents,
    activeAcademic,
}: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        user_id: "",
    });

    const [isRemoving, setIsRemoving] = useState<string | null>(null);

    const addStudent = (e: FormEvent) => {
        e.preventDefault();
        post(`/admin/classrooms/${classroom.id}/members`, {
            onSuccess: () => reset("user_id"),
        });
    };

    const removeStudent = (studentId: string) => {
        if (
            confirm(
                "Keluarkan siswa ini dari kelas? (Hanya untuk semester ini)",
            )
        ) {
            setIsRemoving(studentId);
            router.delete(
                `/admin/classrooms/${classroom.id}/members/${studentId}`,
                {
                    onFinish: () => setIsRemoving(null),
                },
            );
        }
    };

    if (!activeAcademic) {
        return (
            <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#09090b] flex items-center justify-center p-6">
                <div className="bg-white dark:bg-[#18181b] p-8 rounded-2xl shadow-sm text-center max-w-md border border-red-100 dark:border-red-900/30">
                    <AlertCircle
                        size={48}
                        className="text-red-500 mx-auto mb-4"
                    />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Tidak Ada Tahun Ajaran Aktif
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Anda harus mengaktifkan tahun ajaran terlebih dahulu di
                        menu Akademik sebelum mengatur anggota kelas.
                    </p>
                    <Link
                        href="/admin/academics"
                        className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
                    >
                        Ke Menu Akademik
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head title={`Anggota Kelas ${classroom.nama_kelas}`} />

            <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#09090b] p-4 sm:p-6 lg:p-8 font-sans transition-colors duration-200">
                <div className="max-w-5xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#18181b] border border-gray-100 dark:border-gray-800 p-5 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/admin/classrooms"
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-[#27272a] rounded-xl transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </Link>
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl">
                                <Users size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Kelas {classroom.nama_kelas}
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Periode Aktif:{" "}
                                    <strong className="text-orange-600 dark:text-orange-400">
                                        {activeAcademic.tahun_ajaran} -{" "}
                                        {activeAcademic.semester}
                                    </strong>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Kolom Kiri: Form Tambah Siswa */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white dark:bg-[#18181b] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                                    <UserPlus
                                        size={18}
                                        className="text-gray-400"
                                    />{" "}
                                    Tambah Siswa
                                </h3>
                                <form
                                    onSubmit={addStudent}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5 dark:text-gray-300">
                                            Pilih Siswa
                                        </label>
                                        <select
                                            value={data.user_id}
                                            onChange={(e) =>
                                                setData(
                                                    "user_id",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-[#09090b] dark:text-white p-2.5 text-sm focus:ring-blue-500"
                                            required
                                        >
                                            <option value="" disabled>
                                                -- Pilih dari daftar --
                                            </option>
                                            {availableStudents.map(
                                                (student) => (
                                                    <option
                                                        key={student.id}
                                                        value={student.id}
                                                    >
                                                        {student.name}
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                        {errors.user_id && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.user_id}
                                            </p>
                                        )}
                                        {availableStudents.length === 0 && (
                                            <p className="text-xs text-orange-500 mt-2">
                                                Semua siswa sudah mendapatkan
                                                kelas di semester ini.
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={processing || !data.user_id}
                                        className="w-full py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl transition-colors"
                                    >
                                        Masukkan ke Kelas
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Kolom Kanan: Daftar Siswa Aktif */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-[#18181b] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
                                <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <GraduationCap
                                            size={18}
                                            className="text-gray-400"
                                        />{" "}
                                        Daftar Anggota Kelas
                                    </h3>
                                    <span className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 py-1 px-3 rounded-full text-xs font-bold">
                                        {studentsInClass.length} Siswa
                                    </span>
                                </div>
                                <div className="divide-y divide-gray-50 dark:divide-gray-800/50 max-h-[500px] overflow-y-auto">
                                    {studentsInClass.length > 0 ? (
                                        studentsInClass.map((student) => (
                                            <div
                                                key={student.id}
                                                className="p-4 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-[#27272a]/50 transition-colors group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 font-bold">
                                                        {student.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                                                            {student.name}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        removeStudent(
                                                            student.id,
                                                        )
                                                    }
                                                    disabled={
                                                        isRemoving ===
                                                        student.id
                                                    }
                                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50"
                                                    title="Keluarkan dari kelas"
                                                >
                                                    <UserMinus size={18} />
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                            <Users
                                                size={32}
                                                className="mx-auto mb-3 opacity-20"
                                            />
                                            <p className="text-sm">
                                                Belum ada siswa di kelas ini
                                                untuk semester berjalan.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Members.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
