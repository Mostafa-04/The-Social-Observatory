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
        Schema::create('events', function (Blueprint $table) {
            $table->id();

            $table->string('title');
            $table->text('description');
             $table->string('slug')->unique();

            $table->enum('event_type', [
                'conference',
                'workshop',
                'seminar',
                'webinar',
                'forum',
                'roundtable',
                'training',
                'meeting'
            ]);

            $table->foreignId('country_id')
                ->constrained('countries')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->string('city');
            $table->string('location');

            $table->date('date');

            $table->time('start_time');

            $table->time('end_time');
            

            $table->string('registration_link')->nullable();

            $table->string('image')->nullable();
            $table->enum('status', [
                'upcoming',
                'ongoing',
                'completed',
                'cancelled'
            ])->default('upcoming');

            $table->timestamps();
             $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};