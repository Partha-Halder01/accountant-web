<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\BlockedDate;
use Illuminate\Http\Request;

class AdminAppointmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Appointment::query();

        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $appointments = $query->orderBy('appointment_date', 'desc')->paginate(20);

        $stats = [
            'total' => Appointment::count(),
            'new' => Appointment::where('status', 'new')->count(),
            'confirmed' => Appointment::where('status', 'confirmed')->count(),
            'canceled' => Appointment::where('status', 'canceled')->count(),
        ];

        return response()->json([
            'appointments' => $appointments,
            'stats' => $stats
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $appointment = Appointment::findOrFail($id);
        
        $validated = $request->validate([
            'status' => 'required|in:new,confirmed,canceled'
        ]);

        $appointment->status = $validated['status'];
        $appointment->save();

        return response()->json(['message' => 'Status updated.']);
    }

    public function destroy($id)
    {
        $appointment = Appointment::findOrFail($id);
        $appointment->delete();
        return response()->json(['message' => 'Appointment deleted.']);
    }

    // Blocked Dates Management
    public function blockedDates()
    {
        $blocked = BlockedDate::orderBy('date', 'desc')->get();
        $weeklyOff = \App\Models\SiteSetting::where('key', 'weekly_off_days')->value('value');
        $weeklyOffDays = $weeklyOff ? json_decode($weeklyOff, true) : [];
        return response()->json([
            'blocked_dates' => $blocked,
            'weekly_off_days' => $weeklyOffDays
        ]);
    }

    public function updateWeeklyOffDays(Request $request)
    {
        $validated = $request->validate([
            'weekly_off_days' => 'array',
            'weekly_off_days.*' => 'integer|min:0|max:6'
        ]);

        \App\Models\SiteSetting::updateOrCreate(
            ['key' => 'weekly_off_days'],
            ['value' => json_encode($validated['weekly_off_days'] ?? [])]
        );

        return response()->json(['message' => 'Weekly off days updated successfully.']);
    }

    public function storeBlockedDate(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date|unique:blocked_dates,date',
            'reason' => 'nullable|string|max:255'
        ]);

        $blocked = BlockedDate::create($validated);
        return response()->json(['message' => 'Date blocked.', 'blocked_date' => $blocked]);
    }

    public function destroyBlockedDate($id)
    {
        $blocked = BlockedDate::findOrFail($id);
        $blocked->delete();
        return response()->json(['message' => 'Date unblocked.']);
    }
}
