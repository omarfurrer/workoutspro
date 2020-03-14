<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Exercise;
use App\Services\WorkoutsService;
use App\User;
use Exception;
use Illuminate\Http\Request;

class WorkoutsController extends Controller
{

    protected $workoutsService;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(WorkoutsService $workoutsService)
    {
        $this->workoutsService = $workoutsService;
    }

    /**
     * Get all workouts for user.
     *
     * @param  Request  $request
     * @param  User $user
     * @return Response
     */
    public function getWorkouts(Request $request, User $user)
    {
        try {
            $workouts = $this->workoutsService->getUserWorkouts($user->id);
            return response()->json($workouts);
        } catch (Exception $e) {
            return response()->json(["error" => $e->getMessage()], 500);
        }
    }

    /**
     * Create new workout for user.
     *
     * @param  Request  $request
     * @param  User $user
     * @return Response
     */
    public function createWorkout(Request $request, User $user)
    {
        try {
            // dd($user);
            $workout = $this->workoutsService->createWorkout($request->name, $user->id, $request->exercises);
            return response()->json($workout);
        } catch (Exception $e) {
            return response()->json(["error" => $e->getMessage()], 500);
        }
    }

    /**
     * Get previous set.
     *
     * @param  Request  $request
     * @param  User $user
     * @param  Exercise $exercise
     * @return Response
     */
    public function getPreviousSet(Request $request, User $user, Exercise $exercise)
    {
        try {
            $setIndex = $request->query('setIndex');
            $previousSet = $this->workoutsService->getPreviousSet($user->id, $exercise->id, $setIndex);
            return response()->json($previousSet);
        } catch (Exception $e) {
            return response()->json(["error" => $e->getMessage()], 500);
        }
    }
}
