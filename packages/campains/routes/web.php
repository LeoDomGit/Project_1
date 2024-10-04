<?php

use Illuminate\Support\Facades\Route;
use Leo\Compains\Controllers\CampainsController;
use App\Http\Middleware\CheckLogin;
Route::middleware(['web', CheckLogin::class])->group(function () {
    Route::resource('campains', CampainsController::class);
});

Route::prefix('api')->group(function () {
    Route::get('/campains',[CampainsController::class,'api_index']);
    Route::get('/campains/{id}',[CampainsController::class,'api_show']);
});