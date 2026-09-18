<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $navMenu = [];

        if ($user) {
            $navMenu = match ($user->role) {
                'admin_master' => [
                    ['title' => 'Dashboard', 'url' => '/admin/dashboard', 'icon' => 'LayoutDashboard'],
                    ['title' => 'Kelola Pengguna', 'url' => '/admin/users', 'icon' => 'Users'],
                    ['title' => 'Mata Pelajaran', 'url' => '/admin/subjects', 'icon' => 'BookOpen'],
                    ['title' => 'Manajemen Kelas', 'url' => '/admin/classrooms', 'icon' => 'Library'],
                    ['title' => 'Penugasan Mengajar', 'url' => '/admin/teaching-schedules', 'icon' => 'ClipboardList'],
                    [
                        'title' => 'Tahun Akademik',
                        'url' => '/admin/academics',
                        'icon' => 'GraduationCap',
                    ],
                    [
                        'title' => 'Laporan & Statistik',
                        'url' => '/admin/reports',
                        'icon' => 'BarChart2',
                    ],
                ],
                'guru' => [
                    ['title' => 'Dashboard', 'url' => '/guru/dashboard', 'icon' => 'LayoutDashboard'],
                    ['title' => 'Bank Materi', 'url' => '/guru/materials', 'icon' => 'FileText'],
                    ['title' => 'Tugas & Ujian', 'url' => '/guru/assignments', 'icon' => 'GraduationCap'],
                ],
                'siswa' => [
                    ['title' => 'Dashboard', 'url' => '/siswa/dashboard', 'icon' => 'LayoutDashboard'],
                    ['title' => 'Ruang Belajar', 'url' => '/siswa/assignments', 'icon' => 'Library'],
                    ['title' => 'Ujian Aktif', 'url' => '/siswa/exams', 'icon' => 'PenTool'],
                ],
                default => [],
            };
        }

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user,
            ],
            'nav_menu' => $navMenu, // Inject array menu ke frontend
        ]);
    }
}
