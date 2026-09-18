import { useState, FormEvent } from "react";
import { Head, useForm, router, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";

interface Question {
    id: string;
    pertanyaan: string;
    opsi_a: string;
    opsi_b: string;
    opsi_c: string;
    opsi_d: string;
    opsi_e: string | null;
    jawaban_benar: string;
    bobot_nilai: number;
}

interface Props {
    exam: {
        id: string;
        judul: string;
        durasi_menit: number;
    };
    questions: Question[];
}

export default function Questions({ exam, questions }: Props) {
    const [formModal, setFormModal] = useState<{
        isOpen: boolean;
        mode: "add" | "edit";
        data: Question | null;
    }>({ isOpen: false, mode: "add", data: null });
    const [importModal, setImportModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        id: string | null;
    }>({ isOpen: false, id: null });

    const { data, setData, post, put, processing, reset, errors, clearErrors } =
        useForm({
            pertanyaan: "",
            opsi_a: "",
            opsi_b: "",
            opsi_c: "",
            opsi_d: "",
            opsi_e: "",
            jawaban_benar: "A",
            bobot_nilai: 1,
        });

    const importForm = useForm({ file: null as File | null });

    const openEditModal = (q: Question) => {
        clearErrors();
        setData({
            pertanyaan: q.pertanyaan,
            opsi_a: q.opsi_a,
            opsi_b: q.opsi_b,
            opsi_c: q.opsi_c,
            opsi_d: q.opsi_d,
            opsi_e: q.opsi_e || "",
            jawaban_benar: q.jawaban_benar,
            bobot_nilai: q.bobot_nilai,
        });
        setFormModal({ isOpen: true, mode: "edit", data: q });
    };

    const submitForm = (e: FormEvent) => {
        e.preventDefault();
        if (formModal.mode === "add") {
            post(`/guru/exams/${exam.id}/questions`, {
                onSuccess: () => {
                    setFormModal({ isOpen: false, mode: "add", data: null });
                    reset();
                },
            });
        } else if (formModal.mode === "edit" && formModal.data) {
            put(`/guru/exams/questions/${formModal.data.id}`, {
                onSuccess: () => {
                    setFormModal({ isOpen: false, mode: "add", data: null });
                    reset();
                },
            });
        }
    };

    const submitImport = (e: FormEvent) => {
        e.preventDefault();
        importForm.post(`/guru/exams/${exam.id}/questions/import`, {
            onSuccess: () => {
                setImportModal(false);
                importForm.reset();
            },
        });
    };

    return (
        <>
            <Head title={`Bank Soal: ${exam.judul}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 sm:p-6 lg:p-8 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <Link
                            href="/guru/exams"
                            className="text-sm text-blue-600 hover:underline mb-1 block"
                        >
                            &larr; Kembali ke Daftar Ujian
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            Bank Soal: {exam.judul}
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Total Soal: {questions.length} | Durasi:{" "}
                            {exam.durasi_menit} Menit
                        </p>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <button
                            onClick={() => {
                                importForm.clearErrors();
                                importForm.reset();
                                setImportModal(true);
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full md:w-auto text-center"
                        >
                            Import CSV
                        </button>
                        <button
                            onClick={() => {
                                clearErrors();
                                reset();
                                setFormModal({
                                    isOpen: true,
                                    mode: "add",
                                    data: null,
                                });
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full md:w-auto text-center"
                        >
                            + Tambah Manual
                        </button>
                    </div>
                </div>

                <div className="bg-white dark:bg-sidebar border border-sidebar-border/70 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                            <thead className="bg-gray-50 dark:bg-black border-b border-sidebar-border/70 text-gray-900 dark:text-gray-100 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4 font-semibold w-12 text-center">
                                        No
                                    </th>
                                    <th className="px-6 py-4 font-semibold">
                                        Pertanyaan & Opsi
                                    </th>
                                    <th className="px-6 py-4 font-semibold text-center w-24">
                                        Kunci
                                    </th>
                                    <th className="px-6 py-4 font-semibold text-center w-24">
                                        Bobot
                                    </th>
                                    <th className="px-6 py-4 font-semibold text-right w-32">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border/70">
                                {questions.length > 0 ? (
                                    questions.map((q, index) => (
                                        <tr
                                            key={q.id}
                                            className="hover:bg-gray-50 dark:hover:bg-sidebar/50 transition-colors"
                                        >
                                            <td className="px-6 py-4 text-center font-medium">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                                                    {q.pertanyaan}
                                                </div>
                                                <ul className="text-xs text-gray-500 space-y-1">
                                                    <li>A. {q.opsi_a}</li>
                                                    <li>B. {q.opsi_b}</li>
                                                    <li>C. {q.opsi_c}</li>
                                                    <li>D. {q.opsi_d}</li>
                                                    {q.opsi_e && (
                                                        <li>E. {q.opsi_e}</li>
                                                    )}
                                                </ul>
                                            </td>
                                            <td className="px-6 py-4 text-center font-bold text-green-600">
                                                {q.jawaban_benar}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {q.bobot_nilai}
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-3">
                                                <button
                                                    onClick={() =>
                                                        openEditModal(q)
                                                    }
                                                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setDeleteModal({
                                                            isOpen: true,
                                                            id: q.id,
                                                        })
                                                    }
                                                    className="text-red-600 dark:text-red-400 hover:underline font-medium"
                                                >
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-6 py-8 text-center text-gray-500 italic"
                                        >
                                            Belum ada soal untuk ujian ini.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Input Manual */}
            {formModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-sidebar rounded-2xl p-6 w-full max-w-2xl shadow-xl border border-gray-200 dark:border-sidebar-border max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                            {formModal.mode === "add"
                                ? "Tambah Soal"
                                : "Edit Soal"}
                        </h2>
                        <form onSubmit={submitForm} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Pertanyaan
                                </label>
                                <textarea
                                    value={data.pertanyaan}
                                    onChange={(e) =>
                                        setData("pertanyaan", e.target.value)
                                    }
                                    rows={3}
                                    className="w-full rounded-lg border-gray-300 dark:border-sidebar-border dark:bg-black p-2.5 text-sm"
                                    required
                                />
                                {errors.pertanyaan && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.pertanyaan}
                                    </p>
                                )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {["A", "B", "C", "D"].map((opt) => (
                                    <div key={opt}>
                                        <label className="block text-sm font-medium mb-1">
                                            Opsi {opt}
                                        </label>
                                        <input
                                            type="text"
                                            value={
                                                data[
                                                    `opsi_${opt.toLowerCase()}` as keyof typeof data
                                                ] as string
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    `opsi_${opt.toLowerCase()}` as any,
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-lg border-gray-300 dark:border-sidebar-border dark:bg-black p-2.5 text-sm"
                                            required
                                        />
                                    </div>
                                ))}
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Opsi E (Opsional)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.opsi_e}
                                        onChange={(e) =>
                                            setData("opsi_e", e.target.value)
                                        }
                                        className="w-full rounded-lg border-gray-300 dark:border-sidebar-border dark:bg-black p-2.5 text-sm"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Jawaban Benar
                                    </label>
                                    <select
                                        value={data.jawaban_benar}
                                        onChange={(e) =>
                                            setData(
                                                "jawaban_benar",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-lg border-gray-300 dark:border-sidebar-border dark:bg-black p-2.5 text-sm"
                                        required
                                    >
                                        {["A", "B", "C", "D", "E"].map(
                                            (opt) => (
                                                <option key={opt} value={opt}>
                                                    Opsi {opt}
                                                </option>
                                            ),
                                        )}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Bobot Nilai
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={data.bobot_nilai}
                                        onChange={(e) =>
                                            setData(
                                                "bobot_nilai",
                                                parseInt(e.target.value),
                                            )
                                        }
                                        className="w-full rounded-lg border-gray-300 dark:border-sidebar-border dark:bg-black p-2.5 text-sm"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
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
                                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                >
                                    Simpan Soal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Import CSV */}
            {importModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-sidebar rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-200 dark:border-sidebar-border">
                        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                            Import Soal dari CSV
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">
                            Unduh{" "}
                            <a
                                href="/guru/exams/questions/template"
                                className="text-blue-600 hover:underline font-medium"
                            >
                                Template CSV
                            </a>{" "}
                            untuk memastikan struktur kolom (opsi dan kunci
                            jawaban) sesuai format.
                        </p>
                        <form onSubmit={submitImport} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    File CSV (.csv)
                                </label>
                                <input
                                    type="file"
                                    accept=".csv, .txt"
                                    onChange={(e) =>
                                        importForm.setData(
                                            "file",
                                            e.target.files
                                                ? e.target.files[0]
                                                : null,
                                        )
                                    }
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-sidebar dark:file:text-gray-300"
                                    required
                                />
                                {importForm.errors.file && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {importForm.errors.file}
                                    </p>
                                )}
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImportModal(false);
                                        importForm.reset();
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={importForm.processing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
                                >
                                    Upload & Import
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Hapus */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-sidebar rounded-2xl p-6 w-full max-w-sm shadow-xl border border-gray-200 dark:border-sidebar-border text-center">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                            Hapus Soal?
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Soal ini akan dihapus permanen dari sistem.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() =>
                                    setDeleteModal({ isOpen: false, id: null })
                                }
                                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => {
                                    if (deleteModal.id) {
                                        router.delete(
                                            `/guru/exams/questions/${deleteModal.id}`,
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
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
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

Questions.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
