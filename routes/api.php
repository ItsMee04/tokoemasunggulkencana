<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Master\RoleController;
use App\Http\Controllers\Master\UserController;
use App\Http\Controllers\Master\DiskonController;
use App\Http\Controllers\Master\JabatanController;
use App\Http\Controllers\Master\KondisiController;
use App\Http\Controllers\Master\PegawaiController;
use App\Http\Controllers\Master\JenisProdukController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/



Route::middleware(['auth:sanctum'])->group(function () {

    //API JABATAN
    Route::get('jabatan/getJabatan', [JabatanController::class, 'getJabatan']);
    Route::post('jabatan/storeJabatan', [JabatanController::class, 'storeJabatan']);
    Route::get('jabatan/getJabatanByID/{id}', [JabatanController::class, 'getJabatanByID']);
    Route::post('jabatan/updateJabatan/{id}', [JabatanController::class, 'updateJabatan']);
    Route::delete('jabatan/deleteJabatan/{id}', [JabatanController::class, 'deleteJabatan']);

    //API ROLE
    Route::get('role/getRole', [RoleController::class, 'getRole']);
    Route::post('role/storeRole', [RoleController::class, 'storeRole']);
    Route::get('role/getRoleByID/{id}', [RoleController::class, 'getRoleByID']);
    Route::post('role/updateRole/{id}', [RoleController::class, 'updateRole']);
    Route::delete('role/deleteRole/{id}', [RoleController::class, 'deleteRole']);

    //API PEGAWAI
    Route::get('pegawai/getPegawai', [PegawaiController::class, 'getPegawai']);
    Route::post('pegawai/storePegawai', [PegawaiController::class, 'storePegawai']);
    Route::get('pegawai/getPegawaiByID/{id}', [PegawaiController::class, 'getPegawaiByID']);
    Route::post('pegawai/updatePegawai/{id}', [PegawaiController::class, 'updatePegawai']);
    Route::delete('pegawai/deletePegawai/{id}', [PegawaiController::class, 'deletePegawai']);

    //API USERS
    Route::get('users/getUsers', [UserController::class, 'getUsers']);
    Route::get('users/getUsersByID/{id}', [UserController::class, 'getUsersByID']);
    Route::post('users/updateUsers/{id}', [UserController::class, 'updateUsers']);

    //API KONDISI
    Route::get('kondisi/getKondisi', [KondisiController::class, 'getKondisi']);
    Route::post('kondisi/storeKondisi', [KondisiController::class, 'storeKondisi']);
    Route::get('kondisi/getKondisiByID/{id}', [KondisiController::class, 'getKondisiByID']);
    Route::post('kondisi/updateKondisi/{id}', [KondisiController::class, 'updateKondisi']);
    Route::delete('kondisi/deleteKondisi/{id}', [KondisiController::class, 'deletekondisi']);

    //API DISKON
    Route::get('diskon/getDiskon', [DiskonController::class, 'getDiskon']);
    Route::post('diskon/storeDiskon', [DiskonController::class, 'storeDiskon']);
    Route::get('diskon/getDiskonByID/{id}', [DiskonController::class, 'getDiskonByID']);
    Route::post('diskon/updateDiskon/{id}', [DiskonController::class, 'updateDiskon']);
    Route::delete('diskon/deleteDiskon/{id}', [DiskonController::class, 'deleteDiskon']);

    //API JENISPRODUK
    Route::get('jenisproduk/getJenisProduk', [JenisProdukController::class, 'getJenisProduk']);
    Route::post('jenisproduk/storeJenisProduk', [JenisProdukController::class, 'storeJenisProduk']);
    Route::get('jenisproduk/getJenisProdukByID/{id}', [JenisProdukController::class, 'getJenisProdukByID']);
    Route::post('jenisproduk/updateJenisProduk/{id}', [JenisProdukController::class, 'updateJenisProduk']);
    Route::delete('jenisproduk/deleteJenisProduk/{id}', [JenisProdukController::class, 'deleteJenisProduk']);

    //API LOGOUT
    Route::post('/logout', [AuthController::class, 'logoutToken']);
});
