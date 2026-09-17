<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('group_registrations', function (Blueprint $table) {
            $table->text('presentation')->nullable()->change();
            $table->text('motivation')->nullable()->change();
            $table->text('expertise_domain')->nullable()->change();
            $table->string('linkedin_url')->nullable()->change();
            $table->string('cv_path')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('group_registrations', function (Blueprint $table) {
            $table->text('presentation')->nullable(false)->change();
            $table->text('motivation')->nullable(false)->change();
            $table->text('expertise_domain')->nullable(false)->change();
            $table->string('linkedin_url')->nullable(false)->change();
            $table->string('cv_path')->nullable(false)->change();
        });
    }
};