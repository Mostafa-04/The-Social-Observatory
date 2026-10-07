<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('event_registrations', function (Blueprint $table) {
            $table->string('organisation')->nullable()->after('gender');
            $table->string('country')->nullable()->after('organisation');
            $table->string('role')->nullable()->after('country');
            $table->string('linkedin')->nullable()->after('role');
        });
    }

    public function down(): void
    {
        Schema::table('event_registrations', function (Blueprint $table) {
            $table->dropColumn('gender');
        });
    }
};