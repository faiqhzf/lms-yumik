<?php

namespace App\Http\Controllers;

use App\Models\Material;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class MaterialController extends Controller
{
    public function index()
    {
        $materials = Material::with(['meetings.teachingSchedule.subject', 'meetings.teachingSchedule.classroom'])
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return Inertia::render('Guru/Materials/Index', [
            'materials' => $materials
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'file' => 'required|file|max:10240', 
        ]);

        $path = $request->file('file')->store('materials', 'public');

        Material::create([
            'user_id' => Auth::id(),
            'judul' => $request->judul,
            'file_url' => '/storage/' . $path,
        ]);

        return back();
    }

    public function destroy(Material $material)
    {

        if ($material->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        if ($material->file_url) {
            $path = str_replace('/storage/', '', $material->file_url);
            Storage::disk('public')->delete($path);
        }

        $material->delete();

        return back();
    }
}
