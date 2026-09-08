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
        Schema::create('iaps_submissions', function (Blueprint $table) {
            $table->id();

            // Publication liée au formulaire IAPS
            $table->foreignId('publication_id')
                ->constrained('publications')
                ->cascadeOnDelete();

            // SECTION 1 — Coordonnées
            $table->string('full_name');
            $table->string('email');
            $table->string('phone');
            $table->json('languages');

            // Aiguillage
            $table->string('participant_type');

            // SECTION 2 — Personne physique
            $table->string('individual_profile')->nullable();
            $table->text('organization_affiliation')->nullable();
            $table->json('disciplines')->nullable();
            $table->string('other_discipline')->nullable();
            $table->json('observation_regions')->nullable();
            $table->string('observation_country')->nullable();
            $table->string('diaspora_country')->nullable();
            $table->string('observation_location')->nullable();
            $table->json('contribution_methods')->nullable();
            $table->text('other_contribution_method')->nullable();

            // SECTION 3 — Personne morale
            $table->string('entity_name')->nullable();
            $table->string('representative_role')->nullable();
            $table->string('entity_type')->nullable();
            $table->string('intervention_scale')->nullable();
            $table->string('headquarters_country')->nullable();
            $table->string('international_country')->nullable();
            $table->string('headquarters_city')->nullable();
            $table->json('motivations')->nullable();
            $table->text('other_motivation')->nullable();
            $table->json('partnership_opportunities')->nullable();
            $table->text('other_partnership')->nullable();

            // SECTION 4 — Cœur thématique
            $table->json('blind_spots')->nullable();
            $table->text('other_blind_spot')->nullable();
            $table->longText('field_testimony')->nullable();

            // SECTION 5 — Engagement éthique
            $table->boolean('ethical_consent')->default(false);

            $table->timestamps();

            // Index
            $table->index('participant_type');
            $table->index('email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('iaps_submissions');
    }
};