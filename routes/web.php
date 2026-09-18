<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

// Controllers - General & Admin
use App\Http\Controllers\AdminController;
use App\Http\Controllers\GuruController;
use App\Http\Controllers\SiswaController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\SubmissionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\ClassroomController;
use App\Http\Controllers\TeachingScheduleController;
use App\Http\Controllers\UserImportController;
use App\Http\Controllers\AcademicYearController;

// Controllers - Guru (Menggunakan Alias agar tidak bentrok)
use App\Http\Controllers\Guru\CourseController as GuruCourseController;
use App\Http\Controllers\Guru\MeetingController as GuruMeetingController;
use App\Http\Controllers\Guru\ExamController as GuruExamController;
use App\Http\Controllers\Guru\ExamQuestionController as GuruExamQuestionController;
use App\Http\Controllers\Guru\ExamSessionController as GuruExamSessionController;
use App\Http\Controllers\Guru\AttendanceController as GuruAttendanceController;

// Controllers - Siswa (Menggunakan Alias agar tidak bentrok)
use App\Http\Controllers\Siswa\CourseController as SiswaCourseController;
use App\Http\Controllers\Siswa\ExamController as SiswaExamController;
use App\Http\Controllers\Siswa\ExamEngineController as SiswaExamEngineController;

// ==========================================
// BYPASS LOGIN UNTUK DEVELOPMENT
// ==========================================
if (app()->environment('local')) {
    Route::get('{role}', function ($role) {
        $user = \App\Models\User::where('role', $role)->first();
        if (!$user) return "User dengan role {$role} tidak ditemukan.";

        Auth::login($user);

        // Redirect dinamis sesuai role
        if ($role === 'admin_master') return redirect('/admin/dashboard');
        if ($role === 'guru') return redirect('/guru/dashboard');
        return redirect('/siswa/dashboard');
    });
}

Route::inertia('/', 'welcome')->name('home');

require __DIR__ . '/settings.php';

Route::middleware(['auth', 'verified'])->group(function () {

    // Redirect /dashboard ke dashboard masing-masing role
    Route::get('/dashboard', function () {
        return match (Auth::user()->role) {
            'admin_master' => redirect('/admin/dashboard'),
            'guru' => redirect('/guru/dashboard'),
            'siswa' => redirect('/siswa/dashboard'),
            default => redirect('/'),
        };
    })->name('dashboard');

    // ==========================================
    // AKSES SISWA
    // ==========================================
    Route::middleware('role:siswa')->prefix('siswa')->group(function () {
        Route::get('/dashboard', [SiswaController::class, 'index'])->name('siswa.dashboard');
        Route::get('/courses/{id}', [SiswaCourseController::class, 'show'])->name('siswa.courses.show');

        Route::get('/assignments', [AssignmentController::class, 'indexSiswa'])->name('siswa.assignments.index');
        Route::post('/assignments/{assignment}/submit', [SubmissionController::class, 'store']);

        // Modul Ujian / CBT
        Route::get('/exams', [SiswaExamController::class, 'index'])->name('siswa.exams.index');
        Route::get('/exams/{exam}/take', [SiswaExamEngineController::class, 'start'])->name('siswa.exams.take');
        Route::post('/exams/sessions/{session}/answer', [SiswaExamEngineController::class, 'saveAnswer']);
        Route::post('/exams/sessions/{session}/finish', [SiswaExamEngineController::class, 'finish'])->name('siswa.exams.finish');
    });

    // ==========================================
    // AKSES GURU
    // ==========================================
    Route::middleware('role:guru')->prefix('guru')->group(function () {
        Route::get('/dashboard', [GuruController::class, 'index'])->name('guru.dashboard');

        Route::resource('materials', MaterialController::class);
        Route::get('/courses/{id}', [GuruCourseController::class, 'show'])->name('guru.courses.show');
        Route::put('/meetings/{meeting}', [GuruMeetingController::class, 'update'])->name('guru.meetings.update');

        Route::get('/assignments', [AssignmentController::class, 'index'])->name('guru.assignments.index');
        Route::post('/assignments', [AssignmentController::class, 'store'])->name('guru.assignments.store');
        Route::put('/assignments/{assignment}', [AssignmentController::class, 'update'])->name('guru.assignments.update');
        Route::delete('/assignments/{assignment}', [AssignmentController::class, 'destroy'])->name('guru.assignments.destroy');

        Route::get('/assignments/{assignment}/submissions', [SubmissionController::class, 'indexGuru'])->name('guru.assignments.submissions');
        Route::post('/submissions/{submission}/grade', [SubmissionController::class, 'grade'])->name('guru.submissions.grade');

        // Modul Ujian / CBT
        Route::get('/exams', [GuruExamController::class, 'index'])->name('guru.exams.index');
        Route::post('/exams', [GuruExamController::class, 'store'])->name('guru.exams.store');

        Route::get('/exams/questions/template', [GuruExamQuestionController::class, 'downloadTemplate'])->name('guru.exams.questions.template');
        Route::get('/exams/{exam}/questions', [GuruExamQuestionController::class, 'index'])->name('guru.exams.questions.index');
        Route::post('/exams/{exam}/questions', [GuruExamQuestionController::class, 'store']);
        Route::post('/exams/{exam}/questions/import', [GuruExamQuestionController::class, 'import']);
        Route::put('/exams/questions/{question}', [GuruExamQuestionController::class, 'update']);
        Route::delete('/exams/questions/{question}', [GuruExamQuestionController::class, 'destroy']);

        Route::get('/exams/{exam}/sessions', [GuruExamSessionController::class, 'index'])->name('guru.exams.sessions');
        Route::put('/exams/sessions/{session}', [GuruExamSessionController::class, 'updateNilaiEssay']);

        // absen
        Route::put('/meetings/{meeting}/attendances', [GuruAttendanceController::class, 'update'])->name('guru.attendances.update');
    });

    // ==========================================
    // AKSES ADMIN MASTER
    // ==========================================
    Route::middleware('role:admin_master')->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'index'])->name('admin.dashboard');

        Route::get('/users/template', [UserImportController::class, 'downloadTemplate'])->name('admin.users.template');
        Route::post('/users/import', [UserImportController::class, 'store'])->name('admin.users.import');

        Route::resource('users', UserController::class);
        Route::resource('subjects', SubjectController::class);
        Route::resource('classrooms', ClassroomController::class);

        Route::get('/teaching-schedules', [TeachingScheduleController::class, 'indexAdmin'])->name('admin.teaching-schedules.index');
        Route::post('/teaching-schedules', [TeachingScheduleController::class, 'store'])->name('admin.teaching-schedules.store');
        Route::delete('/teaching-schedules/{teaching_schedule}', [TeachingScheduleController::class, 'destroy'])->name('admin.teaching-schedules.destroy');

        Route::resource('academics', AcademicYearController::class)->except(['create', 'show', 'edit']);
        Route::put('academics/{academic}/toggle-active', [AcademicYearController::class, 'toggleActive'])->name('academics.toggle-active');
    });
});
