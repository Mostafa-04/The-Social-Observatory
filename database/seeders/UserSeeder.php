<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::create([
            'name' => 'Mhijir',
            'email' => 'mhijiroum@gmail.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

    }
}