<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('event_registrations', function (Blueprint $table) {
            $table->id();

            $table->foreignId('event_id')
                ->constrained('events')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->foreignId('registration_form_id')
                ->constrained('registration_forms')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            /*
             * These fields are always present
             * in every registration.
             */
            $table->string('first_name');
            $table->string('last_name');
            $table->string('phone');
            $table->string('email');

            $table->enum('status', [
                'registered',
                'confirmed',
                'cancelled',
                'attended',
            ])->default('registered');

            $table->timestamp('registered_at')->nullable();

            $table->timestamps();

            $table->index([
                'event_id',
                'registration_form_id',
            ]);

            $table->index('email');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_registrations');
    }
};