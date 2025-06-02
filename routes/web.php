<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;

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


Route::middleware(['guest'])->group(function () {
    Route::get('/', function () {
        return redirect()->route('login');
    });

    Route::get('/login', function () {
        return view('login');
    })->name('login');
    Route::post('/pushlogin', [AuthController::class, 'login']);
});

//ROUTE ADMIN
Route::prefix('admin')->middleware(['auth', 'role:admin'])->group(function () {
    //Route View Dashboard
    Route::get('/dashboard', function () {
        return view('pages.dashboard.dashboard');
    })->name('admin.dashboard');

    //Route View Jabatan
    Route::get('/jabatan', function () {
        return view('pages.master.jabatan');
    })->name('admin.jabatan');

    //Route View Role
    Route::get('/role', function () {
        return view('pages.master.role');
    })->name('admin.role');

    //Route View Pegawai
    Route::get('/pegawai', function () {
        return view('pages.master.pegawai');
    })->name('admin.pegawai');

    //Route View User
    Route::get('/users', function () {
        return view('pages.master.user');
    })->name('admin.user');

    //Route View Kondisi
    Route::get('/kondisi', function () {
        return view('pages.master.kondisi');
    })->name('admin.kondisi');

    //Route View Kondisi
    Route::get('/diskon', function () {
        return view('pages.master.diskon');
    })->name('admin.diskon');
});

// // Owner Routes
// Route::prefix('owner')->middleware(['auth', 'role:owner'])->group(function () {
//     Route::get('/dashboard', [OwnerController::class, 'dashboard']);
// });

// // Pegawai Routes
// Route::prefix('pegawai')->middleware(['auth', 'role:pegawai'])->group(function () {
//     Route::get('/dashboard', [PegawaiController::class, 'dashboard']);
// });

Route::post('/logout', [AuthController::class, 'logoutSession'])->middleware('auth');
