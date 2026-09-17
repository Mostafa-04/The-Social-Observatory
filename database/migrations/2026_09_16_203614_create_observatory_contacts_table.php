<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('observatory_contacts', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->string('organisation')->nullable();
            $table->string('role')->nullable();

            $table->string('email')->nullable()->index();
            $table->string('phone')->nullable();

            $table->string('status')->default('pending');

            $table->timestamp('registered_at')->nullable();

            $table->timestamp('approved_at')->nullable();
            $table->timestamp('rejected_at')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('observatory_contacts');
    }
};