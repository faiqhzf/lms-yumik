<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class SubjectController extends Controller
{
    public function index()
    {
        $subjects = Subject::latest()->paginate(10);

        return Inertia::render('Admin/Subjects/Index', [
            'subjects' => $subjects
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                Rule::unique('subjects')->where(fn($query) => $query->where('tingkat', $request->tingkat))
            ],
            'tingkat' => 'required|string',
        ]);

        Subject::create($validated);
        return back();
    }
    public function update(Request $request, Subject $subject)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:subjects,name,' . $subject->id,
            'tingkat' => 'required|string|max:10',
        ]);

        $subject->update($validated);

        return back();
    }

    public function destroy(Subject $subject)
    {
        $subject->delete();

        return back();
    }
}
