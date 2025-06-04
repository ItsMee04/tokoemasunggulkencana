<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  mixed  ...$roles  (daftar role yang diizinkan, contoh: 'admin', 'owner')
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = Auth::user();

        if (!$user) {
            return $this->unauthenticatedResponse($request);
        }

        // Ambil role dari relasi ke tabel `role`
        $userRole = optional($user->role)->role;

        if (!$userRole) {
            return $this->forbiddenResponse($request, 'User does not have a role assigned.');
        }

        $allowedRoles = array_map('strtoupper', $roles);
        $userRoleUpper = strtoupper($userRole);

        if (!in_array($userRoleUpper, $allowedRoles)) {
            return $this->forbiddenResponse($request, 'Unauthorized access.');
        }

        return $next($request);
    }

    protected function unauthenticatedResponse($request)
    {
        if ($request->expectsJson()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }
        return redirect()->route('login');
    }

    protected function forbiddenResponse($request, $message)
    {
        if ($request->expectsJson()) {
            return response()->json(['message' => $message], 403);
        }
        abort(403, $message);
    }
}
