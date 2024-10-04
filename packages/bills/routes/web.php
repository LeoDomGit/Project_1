<?php
use Illuminate\Support\Facades\Route;

use App\Http\Middleware\CheckLogin;
use Leo\Bills\Controllers\BillsController1;
use Leo\Bills\Controllers\BillsController;

Route::middleware(['web',CheckLogin::class])->group(function () {
    Route::resource('bills', BillsController1::class);
});

Route::get('/vnpay',[BillsController1::class,'vnpay']);
Route::get('/return-vnpay',[BillsController1::class,'return']);

Route::prefix('api')->group(function () {
    Route::prefix('bills')->group(function () {
        Route::post('/',[BillsController1::class,'store']);
        Route::post('/login',[BillsController1::class,'store2']);
    });
});
