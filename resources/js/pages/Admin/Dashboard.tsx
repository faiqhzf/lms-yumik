import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import {
    Users,
    UserCheck,
    BookOpen,
    LayoutDashboard,
    TrendingUp,
    Calendar as CalendarIcon,
    Plus,
    FileText,
    Activity,
    GraduationCap,
    BarChart2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Header, StatCard, ActionItem } from "@/components/DashboardWidgets";

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

interface Props {
    auth: { user: { name: string; role: string } };
    stats?: {
        totalSiswa: number;
        totalGuru: number;
        totalKelas: number;
        totalMapel: number;
    };
    recentStudents?: {
        id: string;
        nis: string;
        name: string;
        classroom: string;
    }[];
}

export default function Dashboard({ auth, stats, recentStudents = [] }: Props) {
    const [currentTime, setCurrentTime] = useState("");
    const [currentDate, setCurrentDate] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(
                now.toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            );
            setCurrentDate(
                now.toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                }),
            );
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const safeStats = stats || {
        totalSiswa: 0,
        totalGuru: 0,
        totalKelas: 0,
        totalMapel: 0,
    };

    return (
        <>
            <Head title="Dashboard Admin" />
            <div className="min-h-screen bg-[#F8F9FA] dark:bg-black p-4 sm:p-6 lg:p-8 font-sans transition-colors duration-200">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* BAGIAN KIRI */}
                    <div className="lg:col-span-3 space-y-6">
                        <Header
                            user={auth.user}
                            date={currentDate}
                            time={currentTime}
                            subtitle="Administrator • Sistem Informasi Akademik"
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                            <StatCard
                                title="Total Siswa"
                                value={safeStats.totalSiswa}
                                icon={<Users size={20} />}
                                color="blue"
                                link="/admin/users?role=siswa"
                            />
                            <StatCard
                                title="Total Guru"
                                value={safeStats.totalGuru}
                                icon={<UserCheck size={20} />}
                                color="purple"
                                link="/admin/users?role=guru"
                            />
                            <StatCard
                                title="Total Kelas"
                                value={safeStats.totalKelas}
                                icon={<LayoutDashboard size={20} />}
                                color="indigo"
                                link="/admin/classrooms"
                            />
                            <StatCard
                                title="Mata Pelajaran"
                                value={safeStats.totalMapel}
                                icon={<BookOpen size={20} />}
                                color="pink"
                                link="/admin/subjects"
                            />
                        </div>

                        <ChartSection />
                        <StudentTable students={recentStudents} />
                    </div>

                    {/* BAGIAN KANAN */}
                    <div className="lg:col-span-1 space-y-6">
                        <QuickActions />
                        <RecentActivity />
                        <CalendarMini />
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;

// ==========================================
// KOMPONEN LOKAL (Khusus Admin)
// ==========================================

const ChartSection = () => {
    // Data dummy sementara (nanti bisa di-replace dengan props dari backend)
    const data = [
        { name: "Jul", aktivitas: 120 },
        { name: "Agu", aktivitas: 210 },
        { name: "Sep", aktivitas: 380 },
        { name: "Okt", aktivitas: 450 },
        { name: "Nov", aktivitas: 590 },
    ];

    return (
        <div className="bg-white dark:bg-[#18181b] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm transition-colors">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <TrendingUp size={18} className="text-gray-400" /> Grafik
                    Aktivitas
                </h3>
            </div>

            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient
                                id="colorAktivitas"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#3B82F6"
                                    stopOpacity={0.3}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#3B82F6"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        {/* Garis Grid Horizontal */}
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#52525b"
                            opacity={0.2}
                        />

                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: "#71717a" }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: "#71717a" }}
                        />

                        {/* Tooltip Interaktif saat di-hover */}
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#18181b",
                                border: "1px solid #27272a",
                                borderRadius: "12px",
                                color: "#fff",
                            }}
                            itemStyle={{ color: "#60A5FA", fontWeight: "bold" }}
                            labelStyle={{
                                color: "#a1a1aa",
                                marginBottom: "4px",
                            }}
                        />

                        <Area
                            type="monotone"
                            dataKey="aktivitas"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorAktivitas)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const StudentTable = ({ students }: { students: any[] }) => (
    <div className="bg-white dark:bg-sidebar border border-gray-100 dark:border-sidebar-border rounded-2xl shadow-sm overflow-hidden transition-colors">
        <div className="p-6 border-b border-gray-50 dark:border-sidebar-border/50 flex justify-between items-center">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Users size={18} className="text-gray-400" /> Data Siswa Terbaru
            </h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/50 dark:bg-black/50 text-gray-500 dark:text-gray-400">
                    <tr>
                        <th className="px-6 py-4">NIS</th>
                        <th className="px-6 py-4">Nama Siswa</th>
                        <th className="px-6 py-4">Kelas</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-sidebar-border/50">
                    {students.length > 0 ? (
                        students.map((s, i) => (
                            <tr
                                key={i}
                                className="hover:bg-gray-50/50 dark:hover:bg-sidebar/50 text-gray-900 dark:text-gray-200"
                            >
                                <td className="px-6 py-4">{s.nis}</td>
                                <td className="px-6 py-4">{s.name}</td>
                                <td className="px-6 py-4">{s.classroom}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={3}
                                className="px-6 py-8 text-center text-gray-500 italic"
                            >
                                Belum ada data siswa terbaru.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

const QuickActions = () => (
    <div className="bg-white dark:bg-sidebar border border-gray-100 dark:border-sidebar-border rounded-2xl p-5 shadow-sm transition-colors">
        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
            <Activity size={18} className="text-gray-400" /> Aksi Cepat
        </h3>
        <div className="space-y-2">
            <ActionItem
                title="Tambah Pengguna"
                desc="Input data siswa/guru"
                icon={<Plus size={16} />}
                link="/admin/users"
            />
            <ActionItem
                title="Manajemen Kelas"
                desc="Atur wali & data kelas"
                icon={<LayoutDashboard size={16} />}
                link="/admin/classrooms"
            />
            <ActionItem
                title="Atur Jadwal"
                desc="Kelola penugasan mengajar"
                icon={<CalendarIcon size={16} />}
                link="/admin/teaching-schedules"
            />
            <ActionItem
                title="Tahun Akademik"
                desc="Kelola periode & semester"
                icon={<GraduationCap size={16} />}
                link="/admin/academics"
            />
            <ActionItem
                title="Laporan & Statistik"
                desc="Unduh rekap data sistem"
                icon={<BarChart2 size={16} />}
                link="/admin/reports"
            />
        </div>
    </div>
);

const RecentActivity = () => (
    <div className="bg-white dark:bg-sidebar border border-gray-100 dark:border-sidebar-border rounded-2xl p-5 shadow-sm transition-colors">
        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
            <FileText size={18} className="text-gray-400" /> Aktivitas (Log)
        </h3>
        <div className="space-y-4">
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <CalendarIcon size={16} />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                        Sistem Berjalan Normal
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Pembaruan UI Dashboard selesai
                    </p>
                </div>
            </div>
        </div>
    </div>
);

const CalendarMini = () => {
    const today = new Date();
    const currentMonth = today.toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
    });
    const daysInMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0,
    ).getDate();
    const firstDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
    ).getDay();

    const startOffset = firstDay === 0 ? 6 : firstDay - 1;

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: startOffset }, (_, i) => null);

    return (
        <div className="bg-white dark:bg-sidebar border border-gray-100 dark:border-sidebar-border rounded-2xl p-5 shadow-sm transition-colors">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                <CalendarIcon size={18} className="text-gray-400" /> Kalender
            </h3>
            <div className="text-center mb-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {currentMonth}
                </span>
            </div>
            <div className="grid grid-cols-7 text-center text-xs mb-2 text-gray-400 font-medium">
                <div>Sn</div>
                <div>Sl</div>
                <div>Rb</div>
                <div>Km</div>
                <div>Jm</div>
                <div>Sb</div>
                <div>Mg</div>
            </div>
            <div className="grid grid-cols-7 text-center text-sm gap-y-2 text-gray-600 dark:text-gray-400">
                {blanks.map((_, i) => (
                    <div key={`blank-${i}`}></div>
                ))}
                {days.map((day) => (
                    <div
                        key={day}
                        className={
                            day === today.getDate()
                                ? "bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center mx-auto"
                                : "flex items-center justify-center w-7 h-7 mx-auto"
                        }
                    >
                        {day}
                    </div>
                ))}
            </div>
        </div>
    );
};
