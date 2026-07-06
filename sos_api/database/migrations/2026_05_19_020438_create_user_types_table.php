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
        Schema::create('user_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('role_id')
                ->constrained('roles')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->timestamps();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('type_id')
                ->constrained('user_types')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['type_id']);
            $table->dropColumn('type_id');
        });

        Schema::dropIfExists('user_types');
    }
};
