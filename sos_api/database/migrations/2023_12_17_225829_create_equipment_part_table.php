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
        Schema::create('equipment_part', function (Blueprint $table) {
            $table->id();
            $table->index('equipment_id');
            $table->foreignId('equipment_id')->constrained('equipments');
            $table->index('part_id');
            $table->foreignId('part_id')->constrained('parts');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipment_part');
    }
};
