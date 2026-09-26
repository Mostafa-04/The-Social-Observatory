<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('people', function (Blueprint $table) {
            // جعل جميع الحقول الاختيارية قابلة للـ null
            $table->string('gender')->nullable()->change();
            $table->string('organisation')->nullable()->change();
            $table->string('role')->nullable()->change();
            $table->string('country')->nullable()->change();
            $table->string('linkedin')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('people', function (Blueprint $table) {
            $table->string('gender')->nullable(false)->change();
            $table->string('organisation')->nullable(false)->change();
            $table->string('role')->nullable(false)->change();
            $table->string('country')->nullable(false)->change();
            $table->string('linkedin')->nullable(false)->change();
        });
    }
};