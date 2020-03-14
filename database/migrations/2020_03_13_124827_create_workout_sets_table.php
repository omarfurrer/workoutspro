<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWorkoutSetsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('workout_sets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->constrained()
                ->onDelete('cascade');
            $table->foreignId('workout_id')
                ->constrained()
                ->onDelete('cascade');
            $table->foreignId('exercise_id')
                ->constrained()
                ->onDelete('cascade');
            $table->foreignId('workout_exercise_id')
                ->constrained()
                ->onDelete('cascade');
            $table->float('weight', 8, 2);
            $table->integer('reps');
            $table->timestamp('completed_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('workout_sets');
    }
}
