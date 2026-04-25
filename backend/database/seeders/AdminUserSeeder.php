<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => env('ADMIN_EMAIL', 'admin@easyacct.us')],
            [
                'name' => env('ADMIN_NAME', 'EasyAcct Admin'),
                'password' => env('ADMIN_PASSWORD', 'ChangeMe123!'),
            ]
        );

        $admin->forceFill([
            'name' => env('ADMIN_NAME', 'EasyAcct Admin'),
            'is_admin' => true,
        ])->save();
    }
}
