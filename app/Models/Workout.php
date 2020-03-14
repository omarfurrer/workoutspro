<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Workout extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'name'
    ];

    /**
     * Get exercises.
     */
    public function exercises()
    {
        return $this->belongsToMany(Exercise::class, 'workout_exercises')->withPivot('id');
    }
}
