<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\Meeting;
use App\Models\Attendance;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function update(Request $request, Meeting $meeting)
    {
        $validated = $request->validate([
            'attendances' => 'required|array',
            'attendances.*.siswa_id' => 'required|exists:users,id',
            'attendances.*.status' => 'required|in:hadir,izin,sakit,alfa',
        ]);

        foreach ($validated['attendances'] as $data) {
            Attendance::updateOrCreate(
                ['meeting_id' => $meeting->id, 'siswa_id' => $data['siswa_id']],
                ['status' => $data['status']]
            );
        }

        return back();
    }
}
