<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\ContactMessageController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;

// Resolve the admin API token. Prefer config (cached, fast) but fall back to
// reading the .env file directly — necessary on shared hosting after a deploy
// where bootstrap/cache/config.php was built BEFORE services.admin existed.
$adminApiToken = static function (): string {
    static $cached = null;
    if ($cached !== null) {
        return $cached;
    }
    $fromConfig = (string) config('services.admin.api_token', '');
    if ($fromConfig !== '') {
        return $cached = $fromConfig;
    }
    $envFile = base_path('.env');
    if (is_readable($envFile)) {
        foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
            if (preg_match('/^\s*ADMIN_API_TOKEN\s*=\s*(.+?)\s*$/', $line, $m)) {
                return $cached = trim($m[1], "\"'");
            }
        }
    }
    return $cached = '';
};

// Token-guarded ops endpoint — IONOS shared hosting has no shell, so deploys
// trigger migrations + cache warm by GET-ing this route after upload.
Route::get('/_admin/migrate', function (Request $request) use ($adminApiToken) {
    $expected = $adminApiToken();
    $given = (string) $request->query('token', '');
    abort_if($expected === '' || ! hash_equals($expected, $given), 403);

    $output = [];
    foreach ([
        ['migrate', ['--force' => true]],
        ['config:cache', []],
        ['route:cache', []],
        ['view:cache', []],
        ['event:cache', []],
    ] as [$cmd, $args]) {
        Artisan::call($cmd, $args);
        $output[] = "$ php artisan {$cmd}\n" . Artisan::output();
    }

    return response('<pre>' . e(implode("\n", $output)) . '</pre>')
        ->header('Content-Type', 'text/html; charset=utf-8');
})->middleware('throttle:5,1')->name('api.admin.migrate');

// One-shot admin credential reset — token-guarded, takes ?email= and ?password=.
// Use this to rotate the admin login without redeploying.
Route::post('/_admin/reset-credentials', function (Request $request) use ($adminApiToken) {
    $expected = $adminApiToken();
    $given = (string) $request->query('token', '');
    abort_if($expected === '' || ! hash_equals($expected, $given), 403);

    $data = $request->validate([
        'email'    => ['required', 'email'],
        'password' => ['required', 'string', 'min:12'],
        'old_email' => ['nullable', 'email'],
    ]);

    $lookup = $data['old_email'] ?? $data['email'];
    $user = User::where('email', $lookup)->first();
    if (! $user) {
        // Fall back to first admin user
        $user = User::where('is_admin', true)->first();
    }
    if (! $user) {
        return response()->json(['error' => 'No admin user found'], 404);
    }

    $user->forceFill([
        'email'    => $data['email'],
        'password' => Hash::make($data['password']),
        'is_admin' => true,
    ])->save();

    return response()->json([
        'ok'    => true,
        'email' => $user->email,
        'id'    => $user->id,
    ]);
})->middleware('throttle:5,1')->name('api.admin.reset_credentials');

Route::post('/contact', [ContactMessageController::class, 'store'])
    ->middleware('throttle:20,1')
    ->name('api.contact.store');

Route::get('/settings/public', [AdminController::class, 'publicSettings'])
    ->middleware('throttle:120,1')
    ->name('api.settings.public');

Route::post('/appointments', [\App\Http\Controllers\AppointmentController::class, 'store'])
    ->middleware('throttle:10,1')
    ->name('api.appointments.store');

Route::get('/appointments/blocked-dates', [\App\Http\Controllers\AppointmentController::class, 'blockedDates'])
    ->name('api.appointments.blocked-dates');

Route::prefix('admin')->name('api.admin.')->group(function () {
    Route::post('/login', [AdminController::class, 'login'])
        ->middleware('throttle:5,1')
        ->name('login');
    Route::get('/messages', [AdminController::class, 'messages'])->name('messages');
    Route::delete('/messages/{contactMessage}', [AdminController::class, 'destroyMessage'])->name('messages.destroy');
    Route::get('/settings', [AdminController::class, 'settings'])->name('settings');
    Route::patch('/settings', [AdminController::class, 'updateSettings'])->name('settings.update');
    Route::patch('/messages/{contactMessage}/status', [AdminController::class, 'updateMessageStatus'])->name('messages.status');
    Route::patch('/password', [AdminController::class, 'changePassword'])->name('password');

    // Appointments Admin
    Route::get('/appointments', [\App\Http\Controllers\Admin\AdminAppointmentController::class, 'index']);
    Route::patch('/appointments/{id}/status', [\App\Http\Controllers\Admin\AdminAppointmentController::class, 'updateStatus']);
    Route::delete('/appointments/{id}', [\App\Http\Controllers\Admin\AdminAppointmentController::class, 'destroy']);
    
    // Blocked Dates Admin
    Route::get('/blocked-dates', [\App\Http\Controllers\Admin\AdminAppointmentController::class, 'blockedDates']);
    Route::post('/weekly-off-days', [\App\Http\Controllers\Admin\AdminAppointmentController::class, 'updateWeeklyOffDays']);
    Route::post('/blocked-dates', [\App\Http\Controllers\Admin\AdminAppointmentController::class, 'storeBlockedDate']);
    Route::delete('/blocked-dates/{id}', [\App\Http\Controllers\Admin\AdminAppointmentController::class, 'destroyBlockedDate']);
});
