<?php

namespace App\Http\Controllers\Report;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;

class ReportController extends Controller
{
    public function cetakBarcodeProduk(Request $request)
    {
        // Ambil array kodeproduk dari request
        $kodeProdukArray = $request->input('kodeproduk', []); // contoh: ["P001", "P002"]

        if (empty($kodeProdukArray)) {
            return response('Parameter kodeproduk dibutuhkan.', 400);
        }

        // Ubah array ke string untuk parameter JasperReports
        // Format: 'P001','P002','P003'
        $produkListString = "'" . implode("','", $kodeProdukArray) . "'";

        // Path file JRXML
        $jrxmlPath = storage_path('app/reports/barcode/CetakBarcodeProduk.jasper');

        // Folder output hasil PDF
        $outputDir = public_path('barcode');
        $outputFileName = 'CetakBarcodeProduk.pdf';

        // Path barcode (jika digunakan di Jasper, misal untuk lokasi file .png)
        $barcodePath = public_path('storage/barcode/');

        // Buat folder output jika belum ada
        if (!file_exists($outputDir)) {
            mkdir($outputDir, 0755, true);
        }

        // Path jasperstarter (ubah jika beda OS / path)
        $jasperstarterCmd = base_path('vendor/geekcom/phpjasper/bin/jasperstarter/bin/jasperstarter');

        // Ambil koneksi DB dari config
        $dbHost = config('database.connections.mysql.host');
        $dbPort = config('database.connections.mysql.port', '3306');
        $dbName = config('database.connections.mysql.database');
        $dbUser = config('database.connections.mysql.username');
        $dbPass = config('database.connections.mysql.password');

        // Compile command (dijalankan sekali jika belum ada .jasper)
        // $compileCommand = "\"{$jasperstarterCmd}\" compile \"{$jrxmlPath}\"";

        // Generate command JasperStarter
        $generateCommand = "\"{$jasperstarterCmd}\" process \"{$jrxmlPath}\" -o \"{$outputDir}\" -f pdf -t mysql"
            . " -u \"{$dbUser}\" -p \"{$dbPass}\" -H \"{$dbHost}\" -n \"{$dbName}\" --db-port=\"{$dbPort}\""
            . " -P produkList=\"{$produkListString}\" barcodePath=\"{$barcodePath}\"";

        try {
            // Compile jrxml jadi .jasper
            // Log::info("Compile command: {$compileCommand}");
            // exec($compileCommand, $compileOutput, $compileReturnVar);
            // if ($compileReturnVar !== 0) {
            //     Log::error("Compile error: " . implode("\n", $compileOutput));
            //     return response('Gagal compile JRXML.', 500);
            // }

            // Jalankan proses generate PDF
            Log::info("Generate command: {$generateCommand}");
            exec($generateCommand, $generateOutput, $generateReturnVar);
            if ($generateReturnVar !== 0) {
                Log::error("Generate error: " . implode("\n", $generateOutput));
                return response('Gagal generate laporan.', 500);
            }

            $pdfFilePath = $outputDir . '/' . $outputFileName;

            if (!file_exists($pdfFilePath)) {
                Log::error("File PDF tidak ditemukan: {$pdfFilePath}");
                return response('File PDF tidak ditemukan.', 500);
            }

            // Kirim file ke browser & hapus setelah dikirim
            return response()->file($pdfFilePath)->deleteFileAfterSend(true);
        } catch (\Exception $ex) {
            Log::error("Exception: " . $ex->getMessage());
            return response('Terjadi kesalahan: ' . $ex->getMessage(), 500);
        }
    }

    public function cetakSuratBarang(Request $request)
    {
        $kodetransaksi  = $request->kodetransaksi;
        $kodeproduk     = $request->kodeproduk;
        // // Paths
        $jrxmlPath = storage_path('app/reports/nota/CetakSuratBarang.jasper');
        $outputDir = public_path('nota');
        $outputFileName = 'CetakSuratBarang.pdf';
        $imagePath = public_path('assets/img/LOGOHEADER.jpg');
        $produkPath = public_path('storage/produk/');
        $svgPath = public_path('assets/img/icons/instagram.png');

        // Ensure output directory exists
        if (!file_exists($outputDir)) {
            mkdir($outputDir, 0755, true);
        }

        // JasperStarter executable path - adjust if needed
        $jasperstarterCmd = base_path('vendor/geekcom/phpjasper/bin/jasperstarter/bin/jasperstarter'); // Change to your jasperstarter path

        // DB connection details from config
        $dbHost = config('database.connections.mysql.host');
        $dbPort = config('database.connections.mysql.port', '3306');
        $dbName = config('database.connections.mysql.database');
        $dbUser = config('database.connections.mysql.username');
        $dbPass = config('database.connections.mysql.password');

        // Compile command
        // $compileCommand = escapeshellcmd("{$jasperstarterCmd} compile \"{$jrxmlPath}\"");

        // Generate command with DB params
        $generateCommand = "\"{$jasperstarterCmd}\" process \"{$jrxmlPath}\" -o \"{$outputDir}\" -f pdf -t mysql"
            . " -u \"{$dbUser}\" -p \"{$dbPass}\" -H \"{$dbHost}\" -n \"{$dbName}\" --db-port=\"{$dbPort}\""
            . " -P kodetransaksi=\"{$kodetransaksi}\" kodeproduk=\"{$kodeproduk}\" produkPath=\"{$produkPath}\" imagePath=\"{$imagePath}\" svgPath=\"{$svgPath}\"";

        try {
            // Compile jrxml to jasper
            // Log::info("Running compile command: {$compileCommand}");
            // exec($compileCommand, $compileOutput, $compileReturnVar);
            // if ($compileReturnVar !== 0) {
            //     Log::error('Compile failed: ' . implode("\n", $compileOutput));
            //     return response('Failed to compile report.', 500);
            // }

            // Generate report PDF
            Log::info("Running generate command: {$generateCommand}");
            exec($generateCommand, $generateOutput, $generateReturnVar);
            if ($generateReturnVar !== 0) {
                Log::error('Generate report failed: ' . implode("\n", $generateOutput));
                return response('Failed to generate report.', 500);
            }

            $pdfFilePath = $outputDir . '/' . $outputFileName;
            if (!file_exists($pdfFilePath)) {
                Log::error("Generated PDF file not found at path: {$pdfFilePath}");
                return response('Generated PDF file not found.', 500);
            }

            return response()->file($pdfFilePath)->deleteFileAfterSend(true);
        } catch (\Exception $ex) {
            Log::error('Exception when generating report: ' . $ex->getMessage());
            return response('Exception occurred: ' . $ex->getMessage(), 500);
        }
    }

    public function cetakNotaTransaksi(Request $request)
    {
        $kodetransaksi  = $request->kodetransaksi;

        // Path file JRXML
        $jrxmlPath = storage_path('app/reports/nota/cetakNotaTransaksi.jasper');
        $outputDir = public_path('nota');
        $outputFileName = 'CetakNotaTransaksi.pdf';
        $imagePath = public_path('assets/img/LOGOHEADER.jpg');
        $produkPath = public_path('storage/produk/');
        $svgPath = public_path('assets/img/icons/instagram.png');

        // Buat folder output jika belum ada
        if (!file_exists($outputDir)) {
            mkdir($outputDir, 0755, true);
        }

        // Path jasperstarter (ubah jika beda OS / path)
        $jasperstarterCmd = base_path('vendor/geekcom/phpjasper/bin/jasperstarter/bin/jasperstarter');

        // Ambil koneksi DB dari config
        $dbHost = config('database.connections.mysql.host');
        $dbPort = config('database.connections.mysql.port', '3306');
        $dbName = config('database.connections.mysql.database');
        $dbUser = config('database.connections.mysql.username');
        $dbPass = config('database.connections.mysql.password');

        // Compile command (dijalankan sekali jika belum ada .jasper)
        // $compileCommand = "\"{$jasperstarterCmd}\" compile \"{$jrxmlPath}\"";

        // Generate command JasperStarter
        $generateCommand = "\"{$jasperstarterCmd}\" process \"{$jrxmlPath}\" -o \"{$outputDir}\" -f pdf -t mysql"
            . " -u \"{$dbUser}\" -p \"{$dbPass}\" -H \"{$dbHost}\" -n \"{$dbName}\" --db-port=\"{$dbPort}\""
            . " -P kodetransaksi=\"{$kodetransaksi}\" produkPath=\"{$produkPath}\" imagePath=\"{$imagePath}\" svgPath=\"{$svgPath}\"";

        try {
            // Compile jrxml jadi .jasper
            // Log::info("Compile command: {$compileCommand}");
            // exec($compileCommand, $compileOutput, $compileReturnVar);
            // if ($compileReturnVar !== 0) {
            //     Log::error("Compile error: " . implode("\n", $compileOutput));
            //     return response('Gagal compile JRXML.', 500);
            // }

            // Jalankan proses generate PDF
            Log::info("Generate command: {$generateCommand}");
            exec($generateCommand, $generateOutput, $generateReturnVar);
            if ($generateReturnVar !== 0) {
                Log::error("Generate error: " . implode("\n", $generateOutput));
                return response('Gagal generate laporan.', 500);
            }

            $pdfFilePath = $outputDir . '/' . $outputFileName;

            if (!file_exists($pdfFilePath)) {
                Log::error("File PDF tidak ditemukan: {$pdfFilePath}");
                return response('File PDF tidak ditemukan.', 500);
            }

            // Kirim file ke browser & hapus setelah dikirim
            return response()->file($pdfFilePath)->deleteFileAfterSend(true);
        } catch (\Exception $ex) {
            Log::error("Exception: " . $ex->getMessage());
            return response('Terjadi kesalahan: ' . $ex->getMessage(), 500);
        }
    }
}
