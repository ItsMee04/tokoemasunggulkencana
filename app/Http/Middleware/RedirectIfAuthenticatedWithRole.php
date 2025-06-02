<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticatedWithRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle($request, Closure $next, ...$guards)
    {
        $guards = empty($guards) ? [null] : $guards;

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                $user = Auth::guard($guard)->user();

                if ($user->role == 'ADMIN') {
                    return redirect('/admin/dashboard');
                } elseif ($user->role == 'OWNER') {
                    return redirect('/owner/dashboard');
                } elseif ($user->role == 'PEGAWAI') {
                    return redirect('/pegawai/dashboard');
                }
            }
        }

        return $next($request);
    }
}
