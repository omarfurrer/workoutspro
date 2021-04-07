<?php

namespace App\Services;

use App\Models\Workout;
use App\Models\WorkoutExercise;
use App\Models\WorkoutSet;
use App\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;

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
        // return (object) $exercises;
        foreach ($exercises as  $exercise) {
            $exercise = (object) $exercise;
            $workoutExercise = WorkoutExercise::create([
                'user_id' => $userId,
                'workout_id' => $workout->id,
                'exercise_id' => $exercise->id,
            ]);
            foreach ($exercise->sets as $set) {
                $set = (object) $set;
                // dd(Carbon::parse($set->completed_at));
                $workoutSet = $workoutExercise->sets()->create([
                    'user_id' => $userId,
                    'workout_id' => $workout->id,
                    'exercise_id' => $exercise->id,
                    'weight' => $set->weight,
                    'reps' => $set->reps,
                    'completed_at' => isset($set->completed_at) ? Carbon::parse($set->completed_at) : null,
                ]);
            }
        }

        return $workout;
    }

    public function getUserWorkouts($userId)
    {
        $workouts = User::find($userId)->workouts()->limit(20)->orderBy('id', 'desc')->get();

        $workouts->transform(function ($workout) {

            // get exercises
            $exercises = $workout->exercises;

            $exercises->transform(function ($exercise) {
                // get sets
                $sets = WorkoutSet::where('workout_exercise_id', $exercise->pivot->id)->get();
                $sets->transform(function ($set, $key) {

                    $previousSet = $this->getPreviousSet($set->user_id, $set->exercise_id, $key + 1, $set->workout_id);
                    // dd($previousSet);
                    return [
                        'id' => $set->id,
                        'weight' => $set->weight,
                        'reps' => $set->reps,
                        'completed_at' => $set->completed_at,
                        'previous' => $previousSet ? [
                            'id' => $previousSet->id,
                            'weight' => $previousSet->weight,
                            'reps' => $previousSet->reps,
                            'completed_at' => $previousSet->completed_at,
                        ] : null
                    ];
                });

                return [
                    'id' => $exercise->id,
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

    public function getPreviousSet($userId, $exerciseId, $setIndex, $workoutId = null)
    {

        // get last workout exercise
        $workoutExercise = WorkoutExercise::where('user_id', $userId)->where('exercise_id', $exerciseId);

        if ($workoutId) {
            $workoutExercise = $workoutExercise->where('workout_id', '<', $workoutId);
        }

        $workoutExercise = $workoutExercise->orderBy('id', 'desc')->first();

        if ($workoutExercise) {
            // get workout exercise set
            $sets = WorkoutSet::where('workout_exercise_id', $workoutExercise->id)->get();

            if (key_exists($setIndex - 1, $sets->toArray())) {
                return $sets[$setIndex - 1];
            }
        }

        return null;
    }
}
