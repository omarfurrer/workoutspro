<?php

use App\Services\WorkoutsService;
use Illuminate\Database\Seeder;

class WorkoutsTableSeeder extends Seeder
{
    protected $workoutsService;

    public function __construct(WorkoutsService $workoutsService)
    {
        $this->workoutsService = $workoutsService;
    }

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->workoutsService->createWorkout("Morning Workout", 1, [
            [
                "id" => 1,
                "sets" => [
                    [
                        "weight" => 10,
                        "reps" => 15
                    ],
                    [
                        "weight" => 12,
                        "reps" => 12
                    ],
                    [
                        "weight" => 14,
                        "reps" => 10
                    ],
                ]
            ],
            [
                "id" => 2,
                "sets" => [
                    [
                        "weight" => 10,
                        "reps" => 15
                    ],
                    [
                        "weight" => 12,
                        "reps" => 12
                    ],
                    [
                        "weight" => 14,
                        "reps" => 10
                    ],
                ]
            ],
            [
                "id" => 3,
                "sets" => [
                    [
                        "weight" => 10,
                        "reps" => 15
                    ],
                    [
                        "weight" => 12,
                        "reps" => 12
                    ],
                    [
                        "weight" => 14,
                        "reps" => 10
                    ],
                ]
            ]
        ]);
        $this->workoutsService->createWorkout("Evening Workout", 1, [
            [
                "id" => 2,
                "sets" => [
                    [
                        "weight" => 10,
                        "reps" => 15
                    ],
                    [
                        "weight" => 12,
                        "reps" => 12
                    ]
                ]
            ],
            [
                "id" => 4,
                "sets" => [
                    [
                        "weight" => 10,
                        "reps" => 15
                    ],
                    [
                        "weight" => 12,
                        "reps" => 12
                    ],
                    [
                        "weight" => 14,
                        "reps" => 10
                    ],
                ]
            ],
            [
                "id" => 1,
                "sets" => [
                    [
                        "weight" => 10,
                        "reps" => 15
                    ],
                    [
                        "weight" => 12,
                        "reps" => 12
                    ],
                    [
                        "weight" => 14,
                        "reps" => 10
                    ],
                ]
            ]
        ]);
    }
}
