<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\BlockedDate;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'staff_name' => 'nullable|string|max:255',
            'appointment_date' => 'required|date',
            'appointment_time' => 'required|string',
            'first_name' => 'required|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'purpose' => 'required|string|max:1000',
            'meeting_type' => 'nullable|string|max:255',
            'file' => 'nullable|file|max:10240', // max 10MB
        ]);

        if (empty($validated['staff_name'])) {
            $validated['staff_name'] = 'Any staff';
        }

        // Check if date is blocked
        $isBlocked = BlockedDate::where('date', $validated['appointment_date'])->exists();
        if ($isBlocked) {
            return response()->json(['message' => 'The selected date is no longer available.'], 422);
        }

        // Check if there is already an appointment for this time and staff? 
        // For now, we allow multiple if it's a generic firm, but usually it's unique per staff. Let's just create it.

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('appointments', 'public');
            $validated['file_path'] = $path;
        }
        
        // Remove the 'file' key from the validated array since it doesn't exist in the database table
        unset($validated['file']);

        $appointment = Appointment::create($validated);

        return response()->json([
            'message' => 'Appointment request submitted successfully.',
            'appointment' => $appointment
        ], 201);
    }

    public function blockedDates()
    {
        // Get all blocked dates >= today
        $blocked = BlockedDate::where('date', '>=', date('Y-m-d'))->pluck('date');
        $weeklyOff = \App\Models\SiteSetting::where('key', 'weekly_off_days')->value('value');
        $weeklyOffDays = $weeklyOff ? json_decode($weeklyOff, true) : [];
        
        $booked = Appointment::where('appointment_date', '>=', date('Y-m-d'))
            ->where('status', '!=', 'canceled')
            ->get(['appointment_date', 'appointment_time']);
            
        $bookedTimes = [];
        foreach ($booked as $b) {
            $date = $b->appointment_date;
            $time = $b->appointment_time;
            if (!isset($bookedTimes[$date])) {
                $bookedTimes[$date] = [];
            }
            if (!in_array($time, $bookedTimes[$date])) {
                $bookedTimes[$date][] = $time;
            }
        }

        return response()->json([
            'blocked_dates' => $blocked,
            'weekly_off_days' => $weeklyOffDays,
            'booked_times' => $bookedTimes
        ]);
    }
}
