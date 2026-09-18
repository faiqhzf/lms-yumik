<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Response;

class UserImportController extends Controller
{
    public function downloadTemplate()
    {
        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=template_import_pengguna.csv",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $columns = ['name', 'email', 'password', 'role', 'classroom_id'];

        $callback = function () use ($columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            fputcsv($file, ['Nama Siswa', 'siswa1@sekolah.com', 'password123', 'siswa', '1']);
            fputcsv($file, ['Nama Guru', 'guru1@sekolah.com', 'password123', 'guru', '']);

            fclose($file);
        };

        return Response::stream($callback, 200, $headers);
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:csv,txt|max:2048',
        ]);

        $file = $request->file('file');
        $fileHandle = fopen($file->getRealPath(), 'r');

        fgetcsv($fileHandle);

        $users = [];
        $existingEmails = User::pluck('email')->toArray();

        while (($row = fgetcsv($fileHandle)) !== false) {
            if (count($row) < 4 || empty($row[0]) || empty($row[1]) || empty($row[2]) || empty($row[3])) {
                continue;
            }

            $email = trim($row[1]);

            if (in_array($email, $existingEmails)) {
                continue;
            }

            $role = in_array(trim($row[3]), ['siswa', 'guru', 'admin_master']) ? trim($row[3]) : 'siswa';
            $classroomId = (isset($row[4]) && $role === 'siswa' && $row[4] !== '') ? trim($row[4]) : null;

            $users[] = [
                'name' => trim($row[0]),
                'email' => $email,
                'password' => Hash::make(trim($row[2])),
                'role' => $role,
                'classroom_id' => $classroomId,
                'created_at' => now(),
                'updated_at' => now(),
            ];

            $existingEmails[] = $email;
        }
        fclose($fileHandle);

        if (!empty($users)) {
            User::insert($users);
        }

        return back();
    }
}
