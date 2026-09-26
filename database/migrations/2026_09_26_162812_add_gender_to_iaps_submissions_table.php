<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('iaps_submissions', function (Blueprint $table) {
            $table->enum('gender', ['H', 'F'])
                ->nullable()
                ->after('full_name');
        });
    }

    public function down(): void
    {
        Schema::table('iaps_submissions', function (Blueprint $table) {
            $table->dropColumn('gender');
        });
    }
};