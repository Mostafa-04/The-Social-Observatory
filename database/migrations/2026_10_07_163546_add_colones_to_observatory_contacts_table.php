<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('observatory_contacts', function (Blueprint $table) {
            $table->string('linkedin')->nullable()->after('gender');
            $table->string('country')->nullable()->after('linkedin');

        });
    }

    public function down(): void
    {
        Schema::table('observatory_contacts', function (Blueprint $table) {
            $table->dropColumn('linkedin', 'country');
        });
    }
};