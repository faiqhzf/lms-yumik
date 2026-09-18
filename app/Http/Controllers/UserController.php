<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Classroom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('classroom:id,nama_kelas')->latest();

        if ($request->has('role') && $request->role !== 'all') {
            $query->where('role', $request->role);
        }

        $users = $query->paginate(10)->withQueryString();
        $classrooms = Classroom::select('id', 'nama_kelas')->get();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'classrooms' => $classrooms,
            'filters' => $request->only(['role'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => ['required', Rule::in(['admin_master', 'guru', 'siswa'])],
            'classroom_id' => 'nullable|exists:classrooms,id',
        ]);

        if ($validated['role'] !== 'siswa') {
            $validated['classroom_id'] = null;
        }

        $validated['password'] = Hash::make($validated['password']);

        User::create($validated);

        return back();
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'role' => ['required', Rule::in(['admin_master', 'guru', 'siswa'])],
            'classroom_id' => 'nullable|exists:classrooms,id',
            'password' => 'nullable|string|min:8',
        ]);

        if ($validated['role'] !== 'siswa') {
            $validated['classroom_id'] = null;
        }

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return back();
    }

    public function destroy(User $user)
    {
        if ($user->id === Auth::id()) {
            abort(403, 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        $user->delete();

        return back();
    }
}
