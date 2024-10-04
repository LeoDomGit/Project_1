<?php

use Illuminate\Support\Facades\Route;
use Leo\Categories\Controllers\CategoriesController;
use App\Http\Middleware\CheckLogin;
use Leo\Chat\Controllers\ChatController;
use Leo\Chat\Controllers\ConversationController;
Route::middleware(['web', CheckLogin::class])->group(function () {
    Route::resource('chat', ChatController::class);
    Route::resource('conversations', ConversationController::class);
});