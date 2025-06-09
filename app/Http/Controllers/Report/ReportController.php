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
}
