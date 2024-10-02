<?php

use App\Http\Controllers\BrandController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\ConversationController;
use App\Http\Controllers\CrawlerController;
use App\Http\Controllers\PermissionsController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/
Route::get('/', [UserController::class, 'login'])->name('login');
Route::group(['middleware' => 'auth'], function () {
    Route::group(['prefix' => 'admin'], function () {
        Route::resource('/roles', RoleController::class);
        Route::resource('/permissions', PermissionsController::class);
        Route::post('/role-permissions', [PermissionsController::class, 'role_permission']);
        Route::get('/permissions/roles/{id}', [PermissionsController::class, 'get_permissions']);
        Route::resource('/users', UserController::class);
        Route::resource('/conversations', ConversationController::class);
        Route::put('users/switch/{id}',[UserController::class,'switch']);
        Route::resource('conversations', ConversationController::class);
        Route::resource('brands', BrandController::class);
        Route::resource('categories', CategoriesController::class);
        Route::resource('products', ProductController::class);


    });
    Route::resource('/chat', ChatController::class)->middleware('auth');
    Route::get('/logout', [UserController::class, 'logout']);

});
Route::post('/checkLogin', [UserController::class, 'checkLogin']);
Route::post('/checkLogin-email', [UserController::class, 'checkLoginEmail']);

Route::resource('crawlers', CrawlerController::class);

Route::group(['prefix' => 'laravel-filemanager', 'middleware' => ['web']], function () {
    \UniSharp\LaravelFilemanager\Lfm::routes();
});