<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactMessageController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'service' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
            'meeting_type' => ['nullable', 'string', 'max:255'],
        ]);

        $contactMessage = ContactMessage::create([
            ...$validated,
            'service' => trim((string) ($validated['service'] ?? '')),
            'status' => 'new',
        ]);
        AdminController::forgetStatsCache();

        return response()->json([
            'message' => 'Your inquiry has been saved successfully.',
            'submissionId' => $contactMessage->id,
        ], 201);
    }
}
