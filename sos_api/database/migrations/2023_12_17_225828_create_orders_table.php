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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('equipment_id')->constrained('equipments');
            $table->foreignId('technician_id')->nullable()->constrained('users');
            $table->foreignId('status_id')->constrained('order_status');
            $table->text('description');
            $table->text('obs')->nullable();
            $table->decimal('parts_price', 10, 2)->default(0.00);
            $table->decimal('service_price', 10, 2)->default(0.00);
            $table->decimal('total_price', 10, 2)->default(0.00);
            $table->decimal('discount', 10, 2)->default(0.00);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
