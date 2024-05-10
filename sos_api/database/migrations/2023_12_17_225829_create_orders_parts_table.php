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
        Schema::create('orders_parts', function (Blueprint $table) {
            $table->id();
            $table->index('order_id');
            $table->foreignId('order_id')->constrained('orders');
            $table->index('part_id');
            $table->foreignId('part_id')->constrained('parts');
            $table->decimal('quantity', 8, 2)->default(0);
            $table->decimal('price', 8, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders_parts');
    }
};
