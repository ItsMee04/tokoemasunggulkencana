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
                'message' => 'Username atau password salah!'
            ]);
        }

        if ($user->status != 1) {
            return response()->json([
                'success' => false,
                'message' => 'User Account Belum Aktif!'
            ]);
        }

        // Login user (untuk session)
        Auth::login($user);

        // Buat token baru
        $token = $user->createToken('authToken')->plainTextToken;

        // // Ambil data pegawai
        $pegawai = Pegawai::where('id', $user->pegawai_id)->first();
        $jabatan = Jabatan::where('id', $pegawai->jabatan_id)->first()->jabatan;
        $role = Role::where('id', $user->role_id)->first()->role;

        Session::put('nama', $pegawai->nama);
        Session::put('jabatan', $jabatan);
        Session::put('role', $role);
        Session::put('image', $pegawai->image_pegawai);

        // Tentukan redirect berdasarkan role
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
            'redirect' => $redirectUrl
        ]);
    }
}
