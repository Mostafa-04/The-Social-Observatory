<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('form_fields', function (Blueprint $table) {
            $table->id();

            $table->foreignId('registration_form_id')
                ->constrained('registration_forms')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->string('label');

            $table->string('name');

            $table->enum('type', [
                'text',
                'email',
                'phone',
                'number',
                'date',
                'textarea',
                'select',
                'radio',
                'checkbox',
                'country',
                'file',
            ]);

            $table->json('options')->nullable();

            $table->boolean('is_required')->default(false);

            $table->boolean('is_system')->default(false);

            $table->unsignedInteger('sort_order')->default(0);

            $table->timestamps();

            $table->index(['registration_form_id', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('form_fields');
    }
};