// database/migrations/xxxx_xx_xx_create_group_registrations_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('group_registrations', function (Blueprint $table) {
            $table->id();
            $table->enum('group_type', ['jeunesse', 'femmes', 'vieillissement', 'pacte']);
            $table->string('full_name');
            $table->string('email');
            $table->string('linkedin_url')->nullable();
            $table->string('cv_path')->nullable();
            $table->string('presentation', 250);
            $table->string('expertise_domain')->nullable();
            $table->text('motivation')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('group_registrations');
    }
};