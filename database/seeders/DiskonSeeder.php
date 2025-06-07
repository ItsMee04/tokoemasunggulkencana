<?php

namespace Database\Seeders;

use App\Models\Diskon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DiskonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Diskon::create([
            'diskon'   => "TIDAK ADA DISKON / PROMO",
            'nilai'    => 0,
            'status'   => 1
        ]);
    }
}
