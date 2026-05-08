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
        Schema::create('business_info', function (Blueprint $table) {
            $table->id();
            $table->text('name');
            $table->string('email');
            $table->string('cnpj')->nullable();
            $table->string('cep');
            $table->string('address');
            $table->integer('address_number');
            $table->text('image');
            $table->string('phone');
            $table->string('city');
            $table->string('state');
            $table->string('country');
            $table->string('website')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('business_infos');
    }
};
