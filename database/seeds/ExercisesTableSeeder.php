<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ExercisesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('exercises')->insert([
            ['name' => 'Incline Bench Press', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['name' => 'Chest Fly', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['name' => 'Incline Bench Press', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['name' => 'Bench Press (Barbell)', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['name' => 'Push Up', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
        ]);
    }
}
