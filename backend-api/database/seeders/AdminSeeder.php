<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'servicestoreadmin@gmail.com'], // ensures no duplicates
            [
                'name' => 'Admin',                 // 👈 ADD THIS
                'username' => 'admin',
                'phone' => '9998979695',
                'password' => Hash::make('adad1234'), // change later
                'is_admin' => true,
                'is_worker' => false,
                'description' => 'admin',
                'is_active' => true,
            ]
        );
    }
}
