<?php

namespace App\Http\Middleware;

use App\Providers\RouteServiceProvider;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$guards)
    {
        if (Auth::check()) {
            $user = Auth::user();
            $role = $user->role->role ?? ''; // sesuaikan dengan field nama peran kamu

            switch (strtoupper($role)) {
                case 'ADMIN':
                    return redirect()->route('admin.dashboard');
                case 'OWNER':
                    return redirect()->route('owner.dashboard');
                case 'PEGAWAI':
                    return redirect()->route('pegawai.dashboard');
                default:
                    return redirect('/'); // fallback
            }
        }

        return $next($request);
    }
}
