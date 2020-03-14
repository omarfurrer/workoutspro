<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Exercise;
use App\Services\WorkoutsService;
use App\User;
use Exception;
use Illuminate\Http\Request;

class ExercisesController extends Controller
{


    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(WorkoutsService $workoutsService)
    {
    }

    /**
     * Get all workouts for user.
     *
     * @param  Request  $request
     * @param  User $user
     * @return Response
     */
    public function getAll(Request $request)
    {
        try {
            $exercises = Exercise::all();
            return response()->json($exercises);
        } catch (Exception $e) {
            return response()->json(["error" => $e->getMessage()], 500);
        }
    }
}
