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
        Schema::create('messages', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->foreignId('conversation_id')
                ->constrained('conversations') // Foreign key to conversations table
                ->onDelete('cascade'); // Delete messages if the conversation is deleted
            $table->foreignId('sender_id')
                ->constrained('users') // Foreign key to users table
                ->onDelete('cascade'); // Delete messages if the user is deleted
            $table->boolean('response')->default(0); // Indicates if the message is a bot response
            $table->text('content'); // Message content
            $table->timestamps(); // created_at and updated_at
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
