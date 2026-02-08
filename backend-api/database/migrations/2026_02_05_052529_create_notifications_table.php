<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sender_id')->nullable()->constrained('users')->onDelete('set null'); // who sent it
            $table->foreignId('receiver_id')->nullable()->constrained('users')->onDelete('cascade'); // who receives it
            $table->enum('receiver_type', ['admin', 'user', 'worker']); // type of receiver
            $table->string('title');
            $table->text('message');
            $table->boolean('is_read')->default(false);
            $table->foreignId('parent_id')->nullable()->constrained('notifications')->onDelete('cascade'); // for replies
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
