<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Master\RoleController;
use App\Http\Controllers\Master\UserController;
use App\Http\Controllers\Master\DiskonController;
use App\Http\Controllers\Master\NampanController;
use App\Http\Controllers\Master\ProdukController;
use App\Http\Controllers\Master\JabatanController;
use App\Http\Controllers\Master\KondisiController;
use App\Http\Controllers\Master\PegawaiController;
use App\Http\Controllers\Master\SuplierController;
use App\Http\Controllers\Master\PelangganController;
use App\Http\Controllers\Master\JenisProdukController;
use App\Http\Controllers\Master\NampanProdukController;

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

    //API PRODUK
    Route::get('produk/getProduk', [ProdukController::class, 'getProduk']);
    Route::post('produk/storeProduk', [ProdukController::class, 'storeProduk']);
    Route::get('produk/getProdukByID/{id}', [ProdukController::class, 'getProdukByID']);
    Route::post('produk/updateProduk/{id}', [ProdukController::class, 'updateProduk']);
    Route::delete('produk/deleteProduk/{id}', [ProdukController::class, 'deleteProduk']);

    //API NAMPAN
    Route::get('nampan/getNampan', [NampanController::class, 'getNampan']);
    Route::post('nampan/storeNampan', [NampanController::class, 'storeNampan']);
    Route::get('nampan/getNampanByID/{id}', [NampanController::class, 'getNampanByID']);
    Route::post('nampan/updateNampan/{id}', [NampanController::class, 'updateNampan']);
    Route::get('nampan/finalNampan/{id}', [NampanController::class, 'finalNampan']);
    Route::get('nampan/tutupNampan/{id}', [NampanController::class, 'tutupNampan']);

    //API NAMPAN PRODUK
    Route::get('nampan/nampanProduk/getNampanProduk/{id}', [NampanProdukController::class, 'getNampanProduk']);
    Route::get('nampan/nampanProduk/getProdukNampan/{id}', [NampanProdukController::class, 'getProdukNampan']);
    Route::post('nampan/nampanproduk/storeProdukNampan/{id}', [NampanProdukController::class, 'storeProdukNampan']);
    Route::delete('nampan/nampanproduk/deleteNampanProduk/{id}', [NampanProdukController::class, 'deleteNampanProduk']);

    //API SCANBARCODE
    Route::get('scanbarcode/getProdukByScanbarcode/{id}', [ProdukController::class, 'getProdukByScanbarcode']);


    //API PELANGGAN
    Route::get('pelanggan/getPelanggan', [PelangganController::class, 'getPelanggan']);
    Route::post('pelanggan/storePelanggan', [PelangganController::class, 'storePelanggan']);
    Route::get('pelanggan/getPelangganByID/{id}', [PelangganController::class, 'getPelangganByID']);
    Route::post('pelanggan/updatePelanggan/{id}', [PelangganController::class, 'updatePelanggan']);
    Route::delete('pelanggan/deletePelanggan/{id}', [PelangganController::class, 'deletePelanggan']);

    //API SUPLIER
    Route::get('suplier/getSuplier', [SuplierController::class, 'getSuplier']);
    Route::post('suplier/storeSuplier', [SuplierController::class, 'storeSuplier']);
    Route::get('suplier/getSuplierByID/{id}', [SuplierController::class, 'getSuplierByID']);
    Route::post('suplier/updateSuplier/{id}', [SuplierController::class, 'updateSuplier']);
    Route::delete('suplier/deleteSuplier/{id}', [SuplierController::class, 'deleteSuplier']);


    //API LOGOUT
    Route::post('/logout', [AuthController::class, 'logoutToken']);
});
