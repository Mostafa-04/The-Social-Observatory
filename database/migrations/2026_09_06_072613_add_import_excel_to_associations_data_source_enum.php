<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE associations MODIFY COLUMN data_source ENUM('manual', 'import_data_gov_ma', 'import_odco', 'import_excel', 'autre') NOT NULL DEFAULT 'manual'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE associations MODIFY COLUMN data_source ENUM('manual', 'import_data_gov_ma', 'import_odco', 'autre') NOT NULL DEFAULT 'manual'");
    }
};