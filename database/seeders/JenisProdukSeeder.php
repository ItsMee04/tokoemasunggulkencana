<?php

namespace Database\Seeders;

use App\Models\JenisProduk;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class JenisProdukSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = ['ANTING', 'CINCIN', 'GELANG', 'KALUNG'];

        foreach ($data as $value) {
            JenisProduk::create([
                'jenis_produk' => $value,
                'image_jenis_produk' => 'assets/img/icons/' . ($value) . '.png',
                'status' => 1,
            ]);
        }
    }
}
