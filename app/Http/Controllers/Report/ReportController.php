<?php

namespace App\Http\Controllers\Report;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;

class ReportController extends Controller
{
    public function cetakBarcodeProduk(Request $request)
    {
        // Ambil array kodeproduk dari query string atau body (misal pakai POST JSON)
        $kodeProdukArray = $request->input('kodeproduk', []);  // expect array

        if (empty($kodeProdukArray)) {
            return response('Parameter kodeproduk dibutuhkan.', 400);
        }

        // Jika backend JasperStarter butuh 2 parameter saja,
        // misal ambil dua produk pertama dari array atau gabungkan sesuai kebutuhan
        $id = $kodeProdukArray[0] ?? '';
        $id2 = $kodeProdukArray[1] ?? '';

        // // Paths
        $jrxmlPath = storage_path('app/reports/barcode/CetakBarcodeProduk.jrxml');
        $outputDir = public_path('barcode');
        $outputFileName = 'CetakBarcodeProduk.pdf';
        $barcodePath = public_path('storage/barcode/');

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
        $compileCommand = "\"{$jasperstarterCmd}\" compile \"{$jrxmlPath}\"";

        // Generate command with DB params
        $generateCommand = "\"{$jasperstarterCmd}\" process \"{$jrxmlPath}\" -o \"{$outputDir}\" -f pdf -t mysql"
            . " -u \"{$dbUser}\" -p \"{$dbPass}\" -H \"{$dbHost}\" -n \"{$dbName}\" --db-port=\"{$dbPort}\""
            . " -P kodeproduk=\"{$id}\" kodeproduk2=\"{$id2}\" barcodePath=\"{$barcodePath}\"";

        try {
            // Compile jrxml to jasper
            Log::info("Running compile command: {$compileCommand}");
            exec($compileCommand, $compileOutput, $compileReturnVar);
            if ($compileReturnVar !== 0) {
                Log::error('Compile failed: ' . implode("\n", $compileOutput));
                return response('Failed to compile report.', 500);
            }

            // Generate report PDF
            Log::info("Running generate command: {$generateCommand}");
            exec($generateCommand, $generateOutput, $generateReturnVar);
            if ($generateReturnVar !== 0) {
                Log::error('Generate report failed: ' . implode("\n", $generateOutput));
                return response('Failed to generate report.', 500);
            }

            $fullBarcodeFile = $barcodePath . $id . ".png";

            if (file_exists($fullBarcodeFile)) {
                Log::info("File barcode ditemukan: " . $fullBarcodeFile);
            } else {
                Log::error("File barcode TIDAK ditemukan: " . $fullBarcodeFile);
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
}
