<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('publications', function (Blueprint $table) {
            $table->id();

            $table->string('title');

            $table->enum('type', [
                'book',
                'report',
                'policy_brief',
                'white_paper',
                'study'
            ]);

            $table->text('description')->nullable();

            $table->string('cover_image')->nullable();

            $table->string('pdf')->nullable();

            $table->unsignedInteger('pages')->nullable();

            $table->string('language', 10)->default('FR');

            $table->timestamp('published_at')->nullable();

            $table->timestamps();
             $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('publications');
    }
};