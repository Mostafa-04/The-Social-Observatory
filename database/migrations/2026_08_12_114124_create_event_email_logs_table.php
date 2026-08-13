<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('event_email_logs', function (Blueprint $table) {
            $table->id();

            $table->foreignId('event_email_campaign_id')
                ->constrained('event_email_campaigns')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->foreignId('event_registration_id')
                ->constrained('event_registrations')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->string('email');

            $table->enum('status', [
                'pending',
                'sent',
                'failed',
            ])->default('pending');

            $table->timestamp('sent_at')->nullable();

            $table->text('error')->nullable();

            $table->timestamps();

            $table->index(['event_email_campaign_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_email_logs');
    }
};