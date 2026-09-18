<?php
namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class RoleBasedLoginResponse implements LoginResponseContract
{
    public function toResponse($request): RedirectResponse
    {
        $role = Auth::user()->role;

        return match ($role) {
            'admin_master' => redirect()->route('admin.dashboard'),
            'guru' => redirect()->route('guru.dashboard'),
            'siswa' => redirect()->route('siswa.dashboard'),
            default => redirect('/'),
        };
    }
}