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

    //Route View Diskon
    Route::get('/diskon', function () {
        return view('pages.master.diskon');
    })->name('admin.diskon');

    //Route View Jenis Produk
    Route::get('/jenisproduk', function () {
        return view('pages.master.jenisproduk');
    })->name('admin.jenisproduk');

    //Route View Produk
    Route::get('/produk', function () {
        return view('pages.master.produk');
    })->name('admin.produk');

    //Route View Produk
    Route::get('/nampan', function () {
        return view('pages.master.nampan');
    })->name('admin.nampan');

    Route::get('/nampan/NampanProduk', function () {
        return view('pages.master.nampanproduk');
    })->name('admin.nampanproduk');

    //Route View Print Barcode
    Route::get('/printbarcode', function () {
        return view('pages.master.printbarcode');
    })->name('admin.printbarcode');

    //Route View Scanbarcode
    Route::get('/scanbarcode', function () {
        return view('pages.master.scanbarcode');
    })->name('admin.scanbarcode');

    //Route View Pelanggan
    Route::get('/pelanggan', function () {
        return view('pages.master.pelanggan');
    })->name('admin.pelanggan');

    //Route View Pelanggan
    Route::get('/suplier', function () {
        return view('pages.master.suplier');
    })->name('admin.suplier');

    //Route View POS
    Route::get('/pos', function () {
        return view('pages.transaksi.pos');
    })->name('admin.pos');

    //Route View Transaksi
    Route::get('/transaksi', function () {
        return view('pages.transaksi.transaksi');
    })->name('admin.transaksi');

    //Route View Pembelian
    Route::get('/pembelian', function () {
        return view('pages.transaksi.pembelian');
    })->name('admin.pembelian');

    //Route View Pembelian Dari Toko
    Route::get('/pembeliandaritoko', function () {
        return view('pages.transaksi.pembeliandaritoko');
    })->name('admin.pembeliandaritoko');

    //Route View Pembelian Dari Luar Toko
    Route::get('/pembeliandariluartoko', function () {
        return view('pages.transaksi.pembeliandariluartoko');
    })->name('admin.pembeliandariluartoko');

    //Route View Perbaikan
    Route::get('/perbaikan', function () {
        return view('pages.transaksi.perbaikan');
    })->name('admin.perbaikan');

    //Route View stok
    Route::get('/stokopname', function () {
        return view('pages.stok.stokopname');
    })->name('admin.stokopname');

    //Route View stok
    Route::get('/stoknampan', function () {
        return view('pages.stok.stoknampan');
    })->name('admin.stoknampan');

    //Route View Perbaikan
    Route::get('/detailstoknampan', function () {
        return view('pages.stok.detailstoknampan');
    })->name('admin.stoknampan');
});

//ROUTE OWNER
Route::prefix('owner')->middleware(['auth', 'role:owner'])->group(function () {
    //Route View Dashboard
    Route::get('/dashboard', function () {
        return view('pages.dashboard.dashboard');
    })->name('owner.dashboard');

    //Route View Jabatan
    Route::get('/jabatan', function () {
        return view('pages.master.jabatan');
    })->name('owner.jabatan');

    //Route View Role
    Route::get('/role', function () {
        return view('pages.master.role');
    })->name('owner.role');

    //Route View Pegawai
    Route::get('/pegawai', function () {
        return view('pages.master.pegawai');
    })->name('owner.pegawai');

    //Route View User
    Route::get('/users', function () {
        return view('pages.master.user');
    })->name('owner.user');

    //Route View Kondisi
    Route::get('/kondisi', function () {
        return view('pages.master.kondisi');
    })->name('owner.kondisi');

    //Route View Diskon
    Route::get('/diskon', function () {
        return view('pages.master.diskon');
    })->name('owner.diskon');

    //Route View Jenis Produk
    Route::get('/jenisproduk', function () {
        return view('pages.master.jenisproduk');
    })->name('owner.jenisproduk');

    //Route View Produk
    Route::get('/produk', function () {
        return view('pages.master.produk');
    })->name('owner.produk');

    //Route View Produk
    Route::get('/nampan', function () {
        return view('pages.master.nampan');
    })->name('owner.nampan');

    Route::get('/nampan/NampanProduk', function () {
        return view('pages.master.nampanproduk');
    })->name('owner.nampanproduk');

    //Route View Print Barcode
    Route::get('/printbarcode', function () {
        return view('pages.master.printbarcode');
    })->name('owner.printbarcode');

    //Route View Scanbarcode
    Route::get('/scanbarcode', function () {
        return view('pages.master.scanbarcode');
    })->name('owner.scanbarcode');

    //Route View Pelanggan
    Route::get('/pelanggan', function () {
        return view('pages.master.pelanggan');
    })->name('owner.pelanggan');

    //Route View Pelanggan
    Route::get('/suplier', function () {
        return view('pages.master.suplier');
    })->name('owner.suplier');

    //Route View POS
    Route::get('/pos', function () {
        return view('pages.transaksi.pos');
    })->name('owner.pos');

    //Route View Transaksi
    Route::get('/transaksi', function () {
        return view('pages.transaksi.transaksi');
    })->name('owner.transaksi');

    //Route View Pembelian
    Route::get('/pembelian', function () {
        return view('pages.transaksi.pembelian');
    })->name('owner.pembelian');

    //Route View Pembelian Dari Toko
    Route::get('/pembeliandaritoko', function () {
        return view('pages.transaksi.pembeliandaritoko');
    })->name('owner.pembeliandaritoko');

    //Route View Pembelian Dari Luar Toko
    Route::get('/pembeliandariluartoko', function () {
        return view('pages.transaksi.pembeliandariluartoko');
    })->name('owner.pembeliandariluartoko');
});

//ROUTE PEGAWAI
Route::prefix('pegawai')->middleware(['auth', 'role:pegawai'])->group(function () {
    //Route View Dashboard
    Route::get('/dashboard', function () {
        return view('pages.dashboard.dashboard');
    })->name('pegawai.dashboard');

    //Route View Diskon
    Route::get('/diskon', function () {
        return view('pages.master.diskon');
    })->name('pegawai.diskon');

    //Route View Jenis Produk
    Route::get('/jenisproduk', function () {
        return view('pages.master.jenisproduk');
    })->name('pegawai.jenisproduk');

    //Route View Produk
    Route::get('/produk', function () {
        return view('pages.master.produk');
    })->name('pegawai.produk');

    //Route View Produk
    Route::get('/nampan', function () {
        return view('pages.master.nampan');
    })->name('pegawai.nampan');

    Route::get('/nampan/NampanProduk', function () {
        return view('pages.master.nampanproduk');
    })->name('pegawai.nampanproduk');

    //Route View Scanbarcode
    Route::get('/scanbarcode', function () {
        return view('pages.master.scanbarcode');
    })->name('pegawai.scanbarcode');

    //Route View Pelanggan
    Route::get('/pelanggan', function () {
        return view('pages.master.pelanggan');
    })->name('pegawai.pelanggan');

    //Route View Pelanggan
    Route::get('/suplier', function () {
        return view('pages.master.suplier');
    })->name('pegawai.suplier');

    //Route View POS
    Route::get('/pos', function () {
        return view('pages.transaksi.pos');
    })->name('owpegawainer.pos');

    //Route View Transaksi
    Route::get('/transaksi', function () {
        return view('pages.transaksi.transaksi');
    })->name('pegawai.transaksi');

    //Route View Pembelian
    Route::get('/pembelian', function () {
        return view('pages.transaksi.pembelian');
    })->name('pegawai.pembelian');

    //Route View Pembelian Dari Toko
    Route::get('/pembeliandaritoko', function () {
        return view('pages.transaksi.pembeliandaritoko');
    })->name('owpegawainer.pembeliandaritoko');

    //Route View Pembelian Dari Luar Toko
    Route::get('/pembeliandariluartoko', function () {
        return view('pages.transaksi.pembeliandariluartoko');
    })->name('pegawai.pembeliandariluartoko');
});

Route::post('/logout', [AuthController::class, 'logoutSession'])->middleware('auth');
