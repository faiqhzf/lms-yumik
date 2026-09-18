<?php

namespace App\Http\Controllers;

use App\Models\Classroom;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClassroomController extends Controller
{
    public function index()
    {
        $classrooms = Classroom::with('waliKelas:id,name')->latest()->paginate(10);

        $gurus = User::where('role', 'guru')->select('id', 'name')->get();

        return Inertia::render('Admin/Classrooms/Index', [
            'classrooms' => $classrooms,
            'gurus' => $gurus
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_kelas' => 'required|string|max:255|unique:classrooms,nama_kelas',
            'wali_kelas_id' => 'nullable|exists:users,id',
        ]);

        Classroom::create($validated);

        return back();
    }

    public function update(Request $request, Classroom $classroom)
    {
        $validated = $request->validate([
            'nama_kelas' => 'required|string|max:255|unique:classrooms,nama_kelas,' . $classroom->id,
            'wali_kelas_id' => 'nullable|exists:users,id',
        ]);

        $classroom->update($validated);

        return back();
    }

    public function destroy(Classroom $classroom)
    {
        $classroom->delete();

        return back();
    }
}
