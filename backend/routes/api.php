<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\ContactMessageController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;

// Token-guarded ops endpoint — IONOS shared hosting has no shell, so deploys
// trigger migrations + cache warm by GET-ing this route after upload.
Route::get('/_admin/migrate', function (Request $request) {
    $expected = (string) env('ADMIN_API_TOKEN', '');
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

Route::post('/contact', [ContactMessageController::class, 'store'])
    ->middleware('throttle:20,1')
    ->name('api.contact.store');

Route::get('/settings/public', [AdminController::class, 'publicSettings'])
    ->middleware('throttle:120,1')
    ->name('api.settings.public');

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
});
