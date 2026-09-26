<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();

            // Informations sur l'organisation
            $table->string('name');
            $table->string('sector');
            $table->string('country');

            // Personne de contact
            $table->string('contact_gender');
            $table->string('contact_last_name');
            $table->string('contact_first_name');
            $table->string('contact_position');
            $table->string('contact_email');
            $table->string('contact_phone');

            // Adresse de l'organisation
            $table->string('address');
            $table->string('city');

            // Réseaux et site web
            $table->string('linkedin')->nullable();
            $table->string('website')->nullable();

            $table->timestamps();

            // Index utiles
            $table->index('name');
            $table->index('sector');
            $table->index('country');
            $table->index('contact_email');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};