<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    private const DEFAULT_WHATSAPP_NUMBER = '+1 (617) 412-8999';
    private const STATS_CACHE_KEY = 'admin.message.counts';
    private const STATS_CACHE_TTL = 60;
    public const PUBLIC_SETTINGS_CACHE_KEY = 'site.settings.public';
    private const SETTINGS_CACHE_TTL = 600;

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $admin = User::where('email', $credentials['email'])
            ->where('is_admin', true)
            ->first();

        if (! $admin || ! Hash::check($credentials['password'], $admin->password)) {
            return response()->json([
                'message' => 'Invalid admin email or password.',
            ], 422);
        }

        return response()->json([
            'token' => $this->adminToken(),
            'admin' => [
                'name' => $admin->name,
                'email' => $admin->email,
            ],
        ]);
    }

    public function messages(Request $request): JsonResponse
    {
        if (! $this->hasValidToken($request)) {
            return $this->unauthorized();
        }

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

        $messages = $messagesQuery->paginate(20);

        return response()->json([
            'messages' => $messages,
            'stats' => Cache::remember(self::STATS_CACHE_KEY, self::STATS_CACHE_TTL, function (): array {
                $rows = ContactMessage::query()
                    ->selectRaw('status, COUNT(*) as c')
                    ->groupBy('status')
                    ->pluck('c', 'status');

                return [
                    'total' => (int) $rows->sum(),
                    'new' => (int) ($rows['new'] ?? 0),
                    'in_progress' => (int) ($rows['in_progress'] ?? 0),
                    'closed' => (int) ($rows['closed'] ?? 0),
                ];
            }),
        ]);
    }

    public static function forgetStatsCache(): void
    {
        Cache::forget(self::STATS_CACHE_KEY);
    }

    public function settings(Request $request): JsonResponse
    {
        if (! $this->hasValidToken($request)) {
            return $this->unauthorized();
        }

        return response()->json([
            'settings' => $this->siteSettingsPayload(),
        ]);
    }

    public function publicSettings(): JsonResponse
    {
        $settings = Cache::remember(
            self::PUBLIC_SETTINGS_CACHE_KEY,
            self::SETTINGS_CACHE_TTL,
            fn () => $this->siteSettingsPayload(),
        );

        return response()
            ->json(['settings' => $settings])
            ->header('Cache-Control', 'public, max-age=300');
    }

    public function updateMessageStatus(Request $request, ContactMessage $contactMessage): JsonResponse
    {
        if (! $this->hasValidToken($request)) {
            return $this->unauthorized();
        }

        $validated = $request->validate([
            'status' => ['required', Rule::in(['new', 'in_progress', 'closed'])],
        ]);

        $contactMessage->update($validated);
        self::forgetStatsCache();

        return response()->json([
            'message' => 'Message status updated.',
            'contactMessage' => $contactMessage->fresh(),
        ]);
    }

    public function destroyMessage(Request $request, ContactMessage $contactMessage): JsonResponse
    {
        if (! $this->hasValidToken($request)) {
            return $this->unauthorized();
        }

        $contactMessage->delete();
        self::forgetStatsCache();

        return response()->json([
            'message' => 'Message deleted successfully.',
        ]);
    }

    public function changePassword(Request $request): JsonResponse
    {
        if (! $this->hasValidToken($request)) {
            return $this->unauthorized();
        }

        $validated = $request->validate([
            'email' => ['required', 'email'],
            'current_password' => ['required', 'string'],
            'password' => ['required', 'confirmed', Password::min(8)->mixedCase()->numbers()],
        ]);

        $admin = User::where('email', $validated['email'])
            ->where('is_admin', true)
            ->first();

        if (! $admin || ! Hash::check($validated['current_password'], $admin->password)) {
            return response()->json([
                'message' => 'The current password is not correct.',
            ], 422);
        }

        $admin->update([
            'password' => $validated['password'],
        ]);

        return response()->json([
            'message' => 'Admin password updated successfully.',
        ]);
    }

    public function updateSettings(Request $request): JsonResponse
    {
        if (! $this->hasValidToken($request)) {
            return $this->unauthorized();
        }

        $validated = $request->validate([
            'whatsapp_number' => ['required', 'string', 'max:40'],
        ]);

        SiteSetting::updateOrCreate(
            ['key' => 'whatsapp_number'],
            ['value' => trim($validated['whatsapp_number'])]
        );
        Cache::forget(self::PUBLIC_SETTINGS_CACHE_KEY);

        return response()->json([
            'message' => 'Site settings updated successfully.',
            'settings' => $this->siteSettingsPayload(),
        ]);
    }

    private function hasValidToken(Request $request): bool
    {
        return hash_equals($this->adminToken(), (string) $request->bearerToken());
    }

    private function adminToken(): string
    {
        return (string) env('ADMIN_API_TOKEN', 'easyacct-admin-local-token');
    }

    private function unauthorized(): JsonResponse
    {
        return response()->json([
            'message' => 'Admin login is required.',
        ], 401);
    }

    private function siteSettingsPayload(): array
    {
        return [
            'whatsapp_number' => $this->settingValue('whatsapp_number', self::DEFAULT_WHATSAPP_NUMBER),
        ];
    }

    private function settingValue(string $key, string $default): string
    {
        return (string) (SiteSetting::query()->where('key', $key)->value('value') ?? $default);
    }
}
