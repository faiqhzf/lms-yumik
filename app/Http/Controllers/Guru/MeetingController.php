<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\Meeting;
use Illuminate\Http\Request;

class MeetingController extends Controller
{
    public function update(Request $request, Meeting $meeting)
    {
        $validated = $request->validate([
            'rencana_materi' => 'nullable|string|max:1000',
            'metode' => 'required|in:online,offline',
            'link_vicon' => 'nullable|url|max:255',
            'material_ids' => 'nullable|array',
            'material_ids.*' => 'exists:materials,id',
        ]);

        if ($validated['metode'] === 'offline') {
            $validated['link_vicon'] = null;
        }

        $meeting->update([
            'rencana_materi' => $validated['rencana_materi'],
            'metode' => $validated['metode'],
            'link_vicon' => $validated['link_vicon'],
        ]);

        $meeting->materials()->sync($request->material_ids ?? []);

        return back();
    }
}
