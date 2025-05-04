<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, $role)
    {
        // Check if the user is authenticated
        if (!Auth::check()) {
            return redirect('/login');
        }

        // Get the authenticated user
        $user = Auth::user();

        // Check if the user has the required role
        if ($user->role !== $role) {
            abort(403, 'Unauthorized action.');
        }

        // Allow the request to proceed
        return $next($request);
    }
}