<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('registration_answers', function (Blueprint $table) {
            $table->id();

            $table->foreignId('event_registration_id')
                ->constrained('event_registrations')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->foreignId('form_field_id')
                ->constrained('form_fields')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->longText('value')->nullable();

            $table->timestamps();

            $table->unique([
                'event_registration_id',
                'form_field_id',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('registration_answers');
    }
};