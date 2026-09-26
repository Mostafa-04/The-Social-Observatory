<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('people', function (Blueprint $table) {
            $table->id();

            // Informations personnelles
            $table->string('last_name');
            $table->string('first_name');
            $table->string('gender');

            // Informations professionnelles
            $table->string('organisation')->nullable();
            $table->string('role');

            // Contact
            $table->string('email');
            $table->string('phone');

            // Localisation
            $table->string('country');

            // Réseau social
            $table->string('linkedin')->nullable();

            $table->timestamps();

            // Index utiles pour la recherche
            $table->index('email');
            $table->index('phone');
            $table->index('country');
            $table->index(['last_name', 'first_name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('people');
    }
};