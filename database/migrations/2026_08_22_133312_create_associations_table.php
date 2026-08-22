<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('associations', function (Blueprint $table) {
            $table->id();

            // Infos de base
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('logo')->nullable(); //image

            // Type d'acteur social (scope limité au champ associatif/social)
            $table->enum('type', [
                'association',
                'initiative',
                'cooperative_sociale',
                'fondation',
                'reseau',
                'autre',
            ])->default('association');

            // Contact
            $table->string('website')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->json('social_links')->nullable(); // {facebook, linkedin, instagram, x}

            // Localisation
            $table->foreignId('country_id')->constrained('countries')->cascadeOnDelete();
            $table->string('city')->nullable(); // vient du webservice de villes (pas de FK locale)
            $table->text('address')->nullable();

            // Données métier
            $table->unsignedSmallInteger('founding_year')->nullable();
            $table->unsignedInteger('beneficiaries_count')->nullable();

            // Provenance de la donnée (utile pour les imports en masse)
            $table->enum('data_source', ['manual', 'import_data_gov_ma', 'import_odco', 'autre'])
                  ->default('manual');
            $table->string('source_reference')->nullable(); // code officiel dans le dataset source

            // Gestion admin uniquement : pas de champs submitted_by / claimed_by
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();

            // Stats internes
            $table->unsignedInteger('views_count')->default(0);

            $table->timestamps();

            $table->index(['country_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('associations');
    }
};