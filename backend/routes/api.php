<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\ContactMessageController;
use Illuminate\Support\Facades\Route;

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
