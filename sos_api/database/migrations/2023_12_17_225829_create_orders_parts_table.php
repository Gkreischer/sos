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
            $table->text('name');
            $table->decimal('quantity', 15, 2)->default(0);
            $table->decimal('price', 15, 2)->default(0);
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
