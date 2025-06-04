<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = Auth::user();

        if (!$user) {
            // User not authenticated
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }
            return redirect()->route('login');
        }

        $userRole = optional($user->role)->role;

        Log::debug('RoleMiddleware - User ID: ' . $user->id);
        Log::debug('RoleMiddleware - User Role: ' . $userRole);
        Log::debug('RoleMiddleware - Allowed Roles: ' . implode(', ', $roles));

        if (!$userRole) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'User does not have a role assigned.'], 403);
            }
            abort(403, 'User does not have a role assigned.');
        }

        // Normalize roles to uppercase for case-insensitive comparison
        $allowedRoles = array_map('strtoupper', $roles);
        $userRoleUpper = strtoupper($userRole);

        if (!in_array($userRoleUpper, $allowedRoles)) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthorized access.'], 403);
            }
            abort(403, 'Unauthorized');
        }

        return $next($request);
    }
}
