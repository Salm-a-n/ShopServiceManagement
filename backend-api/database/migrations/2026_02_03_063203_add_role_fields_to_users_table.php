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
    Schema::table('users', function (Blueprint $table) {
        $table->string('username')->nullable()->unique()->after('id');
        $table->string('phone')->nullable()->after('email');

        $table->boolean('is_admin')->default(false);
        $table->boolean('is_worker')->default(false);

        $table->text('description')->nullable();
        $table->string('profile_photo')->nullable();

        $table->boolean('is_active')->default(true);
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn([
            'username',
            'phone',
            'is_admin',
            'is_worker',
            'description',
            'profile_photo',
            'is_active',
        ]);
    });
}

};
