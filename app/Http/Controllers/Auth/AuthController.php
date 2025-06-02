<?php

namespace App\Http\Controllers\Auth;

use App\Models\Role;
use App\Models\User;
use App\Models\Jabatan;
use App\Models\Pegawai;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $messages = [
            'required' => ':attribute wajib di isi !!!',
        ];

        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ], $messages);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Username atau password salah!',
            ]);
        }

        if ($user->status != 1) {
            return response()->json([
                'success' => false,
                'message' => 'User Account Belum Aktif!',
            ]);
        }

        // Hapus token lama (opsional, untuk mencegah spam token)
        $user->tokens()->delete();

        // Login user untuk sesi (web guard)
        Auth::login($user);

        // Buat token baru untuk API guard
        $token = $user->createToken('authToken')->plainTextToken;

        // Ambil data pegawai
        $pegawai = Pegawai::find($user->pegawai_id);
        $jabatan = $pegawai && $pegawai->jabatan_id ? Jabatan::find($pegawai->jabatan_id)?->jabatan : null;
        $role = Role::find($user->role_id)?->role;

        // Simpan ke session (untuk akses di web)
        Session::put('nama', $pegawai->nama ?? '-');
        Session::put('jabatan', $jabatan ?? '-');
        Session::put('role', $role ?? '-');
        Session::put('image', $pegawai->image_pegawai ?? 'default.png');

        // Redirect berdasarkan role
        if ($role === 'ADMIN') {
            $redirectUrl = url('/admin/dashboard');
        } elseif ($role === 'OWNER') {
            $redirectUrl = url('/owner/dashboard');
        } elseif ($role === 'PEGAWAI') {
            $redirectUrl = url('/pegawai/dashboard');
        } else {
            $redirectUrl = url('/');
        }

        return response()->json([
            'success' => true,
            'message' => 'Login Berhasil',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'redirect' => $redirectUrl,
        ]);
    }

    public function logoutSession(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login')->with('success-message', 'Logout Berhasil');
    }

    public function logoutToken(Request $request)
    {
        $user = $request->user();

        $token = $user->currentAccessToken();

        if ($token && get_class($token) !== \Laravel\Sanctum\TransientToken::class) {
            $token->delete(); // hapus token dari database
        }

        return response()->json(['message' => 'Logout token berhasil']);
    }
}
