<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('group_registrations', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('gender');
             $table->string('role')->nullable()->after('phone');
              $table->string('organisation')->nullable()->after('role');
               $table->string('country')->nullable()->after('organisation');
        });
    }

    public function down(): void
    {
        Schema::table('group_registrations', function (Blueprint $table) {
            $table->dropColumn('phone', 'role', 'organisation', 'country');
        });
    }
};