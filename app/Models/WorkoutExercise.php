<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkoutExercise extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'workout_id',
        'exercise_id'
    ];

    /**
     * Get the sets.
     */
    public function sets()
    {
        return $this->hasMany(WorkoutSet::class);
    }
}
