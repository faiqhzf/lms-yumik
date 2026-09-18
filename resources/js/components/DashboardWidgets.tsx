import { Link } from "@inertiajs/react";
import { Clock, ChevronRight } from "lucide-react";

export const Header = ({ user, date, time, subtitle }: any) => (
    <div className="flex justify-between items-end">
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Selamat datang,
            </p>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user?.name}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                {subtitle || "Sistem Informasi Akademik"}
            </p>
        </div>
        <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                {date}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-end gap-1 mt-1">
                <Clock size={14} /> {time} WIB
            </p>
        </div>
    </div>
);

export const StatCard = ({
    title,
    value,
    trend,
    subtext,
    icon,
    color,
    link,
}: any) => {
    const colorClasses: Record<string, string> = {
        blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
        purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
        indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
        pink: "bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
        green: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    };

    const CardContent = (
        <div className="bg-white dark:bg-sidebar p-5 rounded-2xl border border-gray-100 dark:border-sidebar-border shadow-sm flex flex-col justify-between h-full transition-all hover:border-gray-300 dark:hover:border-gray-600 group">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div
                        className={`p-2 rounded-lg ${colorClasses[color] || colorClasses.blue}`}
                    >
                        {icon}
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {title}
                    </span>
                </div>
                {link && (
                    <ChevronRight
                        size={16}
                        className="text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                )}
            </div>
            <div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {value}
                </h3>
                {trend && (
                    <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
                        {trend}
                    </p>
                )}
                {subtext && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                        {subtext}
                    </p>
                )}
            </div>
        </div>
    );

    return link ? (
        <Link
            href={link}
            className="block h-full cursor-pointer focus:outline-none"
        >
            {CardContent}
        </Link>
    ) : (
        <div className="h-full">{CardContent}</div>
    );
};

export const ActionItem = ({ title, desc, icon, link }: any) => (
    <Link
        href={link}
        className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors group border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
    >
        <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-50 dark:bg-black group-hover:bg-white dark:group-hover:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300 transition-colors">
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                    {title}
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    {desc}
                </p>
            </div>
        </div>
        <ChevronRight
            size={16}
            className="text-gray-300 dark:text-gray-600 group-hover:text-gray-500"
        />
    </Link>
);
