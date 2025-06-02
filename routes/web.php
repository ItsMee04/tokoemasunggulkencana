<?php

use Illuminate\Support\Facades\Route;

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


Route::middleware(['guest.role'])->group(function () {
    Route::get('/', function () {
        return redirect()->route('login');
    });

    Route::get('/login', function () {
        return view('login');
    })->name('login');
});



Route::prefix('admin')->middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/dashboard', function () {
        return view('pages.dashboard.dashboard');
    })->name('admin.dashboard');
});
// // Owner Routes
// Route::prefix('owner')->middleware(['auth', 'role:owner'])->group(function () {
//     Route::get('/dashboard', [OwnerController::class, 'dashboard']);
// });

// // Pegawai Routes
// Route::prefix('pegawai')->middleware(['auth', 'role:pegawai'])->group(function () {
//     Route::get('/dashboard', [PegawaiController::class, 'dashboard']);
// });
