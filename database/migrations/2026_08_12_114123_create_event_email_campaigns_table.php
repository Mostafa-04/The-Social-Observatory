<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('event_email_campaigns', function (Blueprint $table) {
            $table->id();

            $table->foreignId('event_id')
                ->constrained('events')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->string('subject');

            $table->longText('content');

            $table->enum('status', [
                'draft',
                'sending',
                'sent',
                'failed',
            ])->default('draft');

            $table->timestamp('sent_at')->nullable();

            $table->unsignedInteger('total_recipients')->default(0);

            $table->unsignedInteger('sent_count')->default(0);

            $table->unsignedInteger('failed_count')->default(0);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_email_campaigns');
    }
};