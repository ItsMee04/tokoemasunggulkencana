<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Master\RoleController;
use App\Http\Controllers\Master\UserController;
use App\Http\Controllers\Master\DiskonController;
use App\Http\Controllers\Master\NampanController;
use App\Http\Controllers\Master\ProdukController;
use App\Http\Controllers\Report\ReportController;
use App\Http\Controllers\Master\JabatanController;
use App\Http\Controllers\Master\KondisiController;
use App\Http\Controllers\Master\PegawaiController;
use App\Http\Controllers\Master\SuplierController;
use App\Http\Controllers\Stok\StokNampanController;
use App\Http\Controllers\Master\PelangganController;
use App\Http\Controllers\Master\JenisProdukController;
use App\Http\Controllers\Master\NampanProdukController;
use App\Http\Controllers\Transaksi\KeranjangController;
use App\Http\Controllers\Transaksi\PembelianController;
use App\Http\Controllers\Transaksi\PerbaikanController;
use App\Http\Controllers\Transaksi\TransaksiController;
use App\Http\Controllers\Transaksi\PembelianDariTokoController;
use App\Http\Controllers\Transaksi\PembelianDariLuarTokoController;

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

    //ROUTE ADMIN
    Route::middleware(['role:admin,owner'])->group(function () {
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
    });

    Route::middleware(['role:admin,owner,pegawai'])->group(function () {
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

        //API SEARCH PRODUK
        Route::get('produk/getProdukBySearch', [ProdukController::class, 'getProdukBySearch']);

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

        //API POS
        Route::get('keranjang/getKeranjang', [KeranjangController::class, 'getKeranjang']);
        Route::get('keranjang/getKodeKeranjang', [KeranjangController::class, 'getKodeKeranjang']);
        Route::get('transaksi/getKodeTransaksi', [TransaksiController::class, 'getKodeTransaksi']);
        Route::post('keranjang/addToCart', [KeranjangController::class, 'addToCart']);
        Route::delete('keranjang/deleteKeranjangAll', [KeranjangController::class, 'deleteKeranjangAll']);
        Route::delete('keranjang/deleteKeranjangByID/{id}', [KeranjangController::class, 'deleteKeranjangByID']);

        //API TRANSAKSI
        Route::get('transaksi/getTransaksi', [TransaksiController::class, 'getTransaksi']);
        Route::get('transaksi/konfirmasiPembayaran/{id}', [TransaksiController::class, 'konfirmasiPembayaran']);
        Route::get('transaksi/konfirmasiPembatalanPembayaran/{id}', [TransaksiController::class, 'konfirmasiPembatalanPembayaran']);
        Route::get('transaksi/getTransaksiByID/{id}', [TransaksiController::class, 'getTransaksiByID']);
        Route::post('transaksi/payment', [TransaksiController::class, 'payment']);

        //API PEMBELIAN
        Route::get('pembelian/getPembelian', [PembelianController::class, 'getPembelian']);
        Route::get('pembelian/getPembelianByID/{id}', [PembelianController::class, 'getPembelianByID']);
        Route::get('pembelian/konfirmasiPembelian/{id}', [PembelianController::class, 'konfirmasiPembelian']);
        Route::get('pembelian/konfirmasiPembatalanPembelian/{id}', [PembelianController::class, 'konfirmasiPembatalanPembelian']);

        // API PEMBELIAN DARI TOKO
        Route::post('pembelian/pembeliandaritoko/getTransaksiByKodeTransaksi', [PembelianDariTokoController::class, 'getTransaksiByKodeTransaksi']);
        Route::get('pembelian/pembeliandaritoko/getPembelianProduk', [PembelianDariTokoController::class, 'getPembelianProduk']);
        Route::post('pembelian/pembeliandaritoko/storeProdukToPembelianProduk', [PembelianDariTokoController::class, 'storeProdukToPembelianProduk']);
        Route::post('pembelian/pembeliandaritoko/updatehargaPembelianProduk/{id}', [PembelianDariTokoController::class, 'updatehargaPembelianProduk']);
        Route::get('pembelian/pembeliandaritoko/showPembelianProduk/{id}', [PembelianDariTokoController::class, 'showPembelianProduk']);
        Route::delete('pembelian/pembeliandaritoko/deletePembelianProduk/{id}', [PembelianDariTokoController::class, 'deletePembelianProduk']);
        Route::post('pembelian/pembeliandaritoko/storePembelianPelanggan', [PembelianDariTokoController::class, 'storePembelianPelanggan']);

        //API PEMBELIAN DARI LUAR TOKO
        Route::get('pembelian/pembeliandariluartoko/getPembelianProduk', [PembelianDariLuarTokoController::class, 'getPembelianProduk']);
        Route::post('pembelian/pembeliandariluartoko/storePembelianProduk', [PembelianDariLuarTokoController::class, 'storePembelianProduk']);
        Route::get('pembelian/pembeliandariluartoko/getPembelianByID/{id}', [PembelianDariLuarTokoController::class, 'getPembelianByID']);
        Route::post('pembelian/pembeliandariluartoko/updatePembelianByID/{id}', [PembelianDariLuarTokoController::class, 'updatePembelianByID']);
        Route::delete('pembelian/pembeliandariluartoko/deletePembelianProduk/{id}', [PembelianDariLuarTokoController::class, 'deletePembelianProduk']);
        Route::post('pembelian/pembeliandariluartoko/storePembelianLuarToko', [PembelianDariLuarTokoController::class, 'storePembelianLuarToko']);

        //API PERBAIKAN
        Route::get('perbaikan/getPerbaikan', [PerbaikanController::class, 'getPerbaikan']);
        Route::get('perbaikan/getPerbaikanByID/{id}', [PerbaikanController::class, 'getPerbaikanByID']);
        Route::get('perbaikan/konfirmasiPerbaikan/{id}', [PerbaikanController::class, 'konfirmasiPerbaikan']);
        Route::get('perbaikan/konfirmasiBatalPerbaikan/{id}', [PerbaikanController::class, 'konfirmasiBatalPerbaikan']);

        //API STOK NAMPAN
        Route::get('stoknampan/getNampanStok', [StokNampanController::class, 'getNampanStok']);
        Route::get('stoknampan/getDetailNampanStok/{id}', [StokNampanController::class, 'detailNampanStok']);

        //API STOK REPORT
        Route::post('report/cetakBarcodeProduk', [ReportController::class, 'cetakBarcodeProduk']);
        Route::post('report/cetakSuratBarang', [ReportController::class, 'cetakSuratBarang']);
    });
    //API LOGOUT
    Route::post('/logout', [AuthController::class, 'logoutToken']);
});
