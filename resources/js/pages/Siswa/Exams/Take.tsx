import { useState, useEffect, FormEvent } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import axios from "axios";

interface Question {
    id: string;
    pertanyaan: string;
    opsi_a: string;
    opsi_b: string;
    opsi_c: string;
    opsi_d: string;
    opsi_e: string | null;
}

interface Exam {
    id: string;
    judul: string;
    durasi_menit: number;
    izinkan_upload: boolean;
    questions: Question[];
}

interface Props {
    exam: Exam;
    session: { id: string };
    endTime: string;
}

export default function Take({ exam, session, endTime }: Props) {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [timeLeft, setTimeLeft] = useState<string>("");
    const [answers, setAnswers] = useState<Record<string, string>>({});

    // Form untuk upload file essay (jika mode hybrid)
    const { data, setData, post, processing } = useForm({
        file: null as File | null,
    });

    // Sinkronisasi Countdown Timer
    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference =
                new Date(endTime).getTime() - new Date().getTime();
            if (difference <= 0) {
                forceSubmit();
                return "00:00:00";
            }
            const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const m = Math.floor((difference / 1000 / 60) % 60);
            const s = Math.floor((difference / 1000) % 60);
            return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
        };

        setTimeLeft(calculateTimeLeft());
        const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
        return () => clearInterval(timer);
    }, [endTime]);

    const handleAnswer = async (questionId: string, answer: string) => {
        // Optimistic UI update
        setAnswers((prev) => ({ ...prev, [questionId]: answer }));

        // Background save ke server
        try {
            await axios.post(`/siswa/exams/sessions/${session.id}/answer`, {
                question_id: questionId,
                jawaban: answer,
            });
        } catch (error) {
            console.error("Gagal menyimpan jawaban", error);
        }
    };

    const forceSubmit = () => {
        post(`/siswa/exams/sessions/${session.id}/finish`);
    };

    const submitExam = (e: FormEvent) => {
        e.preventDefault();
        if (
            confirm(
                "Apakah Anda yakin ingin menyelesaikan ujian ini? Waktu tersisa akan hangus.",
            )
        ) {
            forceSubmit();
        }
    };

    const activeQuestion = exam.questions[currentIdx];

    return (
        <>
            <Head title={`Ujian: ${exam.judul}`} />

            <div className="min-h-screen bg-gray-50 dark:bg-black flex flex-col">
                {/* CBT Header */}
                <header className="bg-white dark:bg-sidebar border-b border-gray-200 dark:border-sidebar-border px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                    <div>
                        <h1 className="font-bold text-lg text-gray-900 dark:text-white">
                            {exam.judul}
                        </h1>
                        <p className="text-xs text-gray-500">
                            Mode Pengerjaan CBT
                        </p>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 px-4 py-2 rounded-lg text-center">
                        <span className="text-[10px] uppercase font-bold text-red-600 dark:text-red-400 block leading-tight">
                            Sisa Waktu
                        </span>
                        <span className="font-mono text-xl font-bold text-red-700 dark:text-red-300">
                            {timeLeft}
                        </span>
                    </div>
                </header>

                <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Area Pertanyaan */}
                    <div className="md:col-span-3 space-y-6">
                        {activeQuestion ? (
                            <div className="bg-white dark:bg-sidebar border border-gray-200 dark:border-sidebar-border rounded-xl p-6 shadow-sm">
                                <div className="flex gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-sidebar-border">
                                    <div className="w-8 h-8 flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold rounded-lg flex items-center justify-center">
                                        {currentIdx + 1}
                                    </div>
                                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed pt-1">
                                        {activeQuestion.pertanyaan}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    {["A", "B", "C", "D", "E"].map((opt) => {
                                        const optionText =
                                            activeQuestion[
                                                `opsi_${opt.toLowerCase()}` as keyof Question
                                            ];
                                        if (!optionText) return null;

                                        return (
                                            <label
                                                key={opt}
                                                className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                                                    answers[
                                                        activeQuestion.id
                                                    ] === opt
                                                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                                        : "border-gray-200 dark:border-sidebar-border hover:bg-gray-50 dark:hover:bg-sidebar/70"
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name={`question-${activeQuestion.id}`}
                                                    value={opt}
                                                    checked={
                                                        answers[
                                                            activeQuestion.id
                                                        ] === opt
                                                    }
                                                    onChange={() =>
                                                        handleAnswer(
                                                            activeQuestion.id,
                                                            opt,
                                                        )
                                                    }
                                                    className="mt-1 w-4 h-4 text-blue-600"
                                                />
                                                <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                                    <span className="font-bold mr-2">
                                                        {opt}.
                                                    </span>{" "}
                                                    {optionText}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-sidebar border rounded-xl p-8 text-center text-gray-500 italic">
                                Soal pilihan ganda belum diatur oleh guru.
                            </div>
                        )}

                        {/* Navigasi Soal Bawah */}
                        {exam.questions.length > 0 && (
                            <div className="flex justify-between items-center">
                                <button
                                    onClick={() =>
                                        setCurrentIdx((prev) =>
                                            Math.max(0, prev - 1),
                                        )
                                    }
                                    disabled={currentIdx === 0}
                                    className="px-6 py-2.5 bg-gray-200 dark:bg-sidebar text-gray-700 dark:text-gray-300 font-medium rounded-lg disabled:opacity-50"
                                >
                                    &larr; Sebelumnya
                                </button>
                                <button
                                    onClick={() =>
                                        setCurrentIdx((prev) =>
                                            Math.min(
                                                exam.questions.length - 1,
                                                prev + 1,
                                            ),
                                        )
                                    }
                                    disabled={
                                        currentIdx === exam.questions.length - 1
                                    }
                                    className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    Selanjutnya &rarr;
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Sidebar: Navigasi Cepat & Submit */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white dark:bg-sidebar border border-gray-200 dark:border-sidebar-border rounded-xl p-5 shadow-sm">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">
                                Navigasi Soal
                            </h3>
                            <div className="grid grid-cols-5 gap-2">
                                {exam.questions.map((q, idx) => (
                                    <button
                                        key={q.id}
                                        onClick={() => setCurrentIdx(idx)}
                                        className={`w-full aspect-square rounded-md text-xs font-bold transition-colors ${
                                            currentIdx === idx
                                                ? "ring-2 ring-blue-500 bg-blue-100 text-blue-700"
                                                : answers[q.id]
                                                  ? "bg-green-500 text-white"
                                                  : "bg-gray-100 dark:bg-black text-gray-500 border border-gray-200 dark:border-gray-800"
                                        }`}
                                    >
                                        {idx + 1}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-sidebar-border">
                                <form
                                    onSubmit={submitExam}
                                    className="space-y-4"
                                >
                                    {exam.izinkan_upload && (
                                        <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-100 dark:border-blue-900/30">
                                            <label className="block text-xs font-bold text-blue-900 dark:text-blue-200 mb-2">
                                                Upload Kertas Jawaban (Essay)
                                            </label>
                                            <input
                                                type="file"
                                                onChange={(e) =>
                                                    setData(
                                                        "file",
                                                        e.target.files
                                                            ? e.target.files[0]
                                                            : null,
                                                    )
                                                }
                                                className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-medium file:bg-blue-600 file:text-white"
                                            />
                                        </div>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-sm"
                                    >
                                        Akhiri Ujian
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
