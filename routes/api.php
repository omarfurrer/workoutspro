<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/airlock/csrf-cookie', '\Laravel\Airlock\Http\Controllers\CsrfCookieController@show');

Route::namespace('Api\v1')->group(function () {
    Route::post('/register', 'Auth\RegisterController@register');
    Route::post('/login', 'Auth\LoginController@login');

    Route::middleware('auth:airlock')->group(function () {
        Route::get('/user', function (Request $request) {
            return $request->user();
        });
        Route::get('/users/{user}/workouts', 'WorkoutsController@getWorkouts');
        Route::post('/users/{user}/workouts', 'WorkoutsController@createWorkout');
    });
});
