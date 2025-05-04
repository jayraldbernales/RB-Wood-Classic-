<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if the admin user already exists
        if (!User::where('email', 'admin@edu.ph')->exists()) {
            User::create([
                'name' => 'Admin',
                'email' => 'admin@edu.ph',
                'password' => Hash::make('123'), // Use a secure password
                'role' => 'admin', // Set the role to 'admin'
            ]);
        }

        // Check if the regular user already exists
        if (!User::where('email', 'user@edu.ph')->exists()) {
            User::create([
                'name' => 'User',
                'email' => 'user@edu.ph',
                'password' => Hash::make('123'), // Use a secure password
                'role' => 'user', // Set the role to 'user'
            ]);
        }
    }
}