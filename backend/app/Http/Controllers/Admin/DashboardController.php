<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

class DashboardController extends Controller
{
    public function index(Request $request): View
    {
        $status = (string) $request->query('status', '');
        $search = trim((string) $request->query('search', ''));

        $messagesQuery = ContactMessage::query()->latest();

        if (in_array($status, ['new', 'in_progress', 'closed'], true)) {
            $messagesQuery->where('status', $status);
        }

        if ($search !== '') {
            $messagesQuery->where(function ($query) use ($search): void {
                $query
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('service', 'like', "%{$search}%")
                    ->orWhere('message', 'like', "%{$search}%");
            });
        }

        $messages = $messagesQuery->paginate(10)->withQueryString();

        $selectedMessage = null;
        $selectedMessageId = $request->query('message');

        if ($selectedMessageId) {
            $selectedMessage = ContactMessage::find($selectedMessageId);
        }

        if (! $selectedMessage) {
            $selectedMessage = $messages->first();
        }

        $stats = [
            'total' => ContactMessage::count(),
            'new' => ContactMessage::where('status', 'new')->count(),
            'in_progress' => ContactMessage::where('status', 'in_progress')->count(),
            'closed' => ContactMessage::where('status', 'closed')->count(),
        ];

        return view('admin.dashboard', [
            'messages' => $messages,
            'selectedMessage' => $selectedMessage,
            'stats' => $stats,
            'filters' => [
                'status' => $status,
                'search' => $search,
            ],
        ]);
    }

    public function updateStatus(Request $request, ContactMessage $contactMessage): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['new', 'in_progress', 'closed'])],
        ]);

        $contactMessage->update([
            'status' => $validated['status'],
        ]);

        return back()->with('status', 'Message status updated successfully.');
    }
}
