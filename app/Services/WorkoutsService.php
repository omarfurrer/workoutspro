<?php

namespace App\Services;

use App\Models\Workout;
use App\Models\WorkoutExercise;
use App\Models\WorkoutSet;
use App\User;
use Carbon\Carbon;

class WorkoutsService
{

    /**
     * Constructor.
     *
     * @return void
     */
    public function __construct()
    {
    }

    public function createWorkout($name, $userId, $exercises)
    {
        $workout = Workout::create(['name' => $name, 'user_id' => $userId]);

        foreach ($exercises as  $exercise) {
            $exercise = (object) $exercise;
            $workoutExercise = WorkoutExercise::create([
                'user_id' => $userId,
                'workout_id' => $workout->id,
                'exercise_id' => $exercise->id,
            ]);
            foreach ($exercise->sets as $set) {
                $set = (object) $set;
                $workoutSet = $workoutExercise->sets()->create([
                    'user_id' => $userId,
                    'workout_id' => $workout->id,
                    'exercise_id' => $exercise->id,
                    'weight' => $set->weight,
                    'reps' => $set->reps,
                    'completed_at' => !empty($set->is_completed) ? Carbon::now() : null,
                ]);
            }
        }

        return $workout;
    }

    public function getUserWorkouts($userId)
    {
        $workouts = User::find($userId)->workouts()->orderBy('id', 'desc')->get();

        $workouts->transform(function ($workout) {

            // get exercises
            $exercises = $workout->exercises;

            $exercises->transform(function ($exercise) {
                // get sets
                $sets = WorkoutSet::where('workout_exercise_id', $exercise->pivot->id)->get();
                $sets->transform(function ($set) {
                    return [
                        'id' => $set->id,
                        'weight' => $set->weight,
                        'reps' => $set->reps,
                        'completed_at' => $set->completed_at,
                    ];
                });

                return [
                    'name' => $exercise->name,
                    'sets' => $sets
                ];
            });

            return [
                'id' => $workout->id,
                'name' => $workout->name,
                'created_at' => $workout->created_at,
                'created_at_friendly' => $workout->created_at->format('D d/m'),
                'exercises' => $exercises
            ];
        });

        return $workouts;
    }
}
