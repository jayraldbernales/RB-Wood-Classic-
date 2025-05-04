<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('profile_image')->nullable()->after('email');
            $table->string('phone_number', 20)->nullable()->after('profile_image');
            $table->enum('gender', ['male', 'female', 'other'])->nullable()->after('phone_number');
            $table->text('address')->nullable()->after('gender');
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['profile_image', 'phone_number', 'gender', 'address']);
        });
    }
};