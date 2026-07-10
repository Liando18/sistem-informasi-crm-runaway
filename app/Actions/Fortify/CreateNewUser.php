<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\Akun;
use App\Services\VoucherService;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    public function create(array $input): Akun
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
        ])->validate();

        $akun = Akun::create([
            'nama' => $input['name'],
            'email' => $input['email'],
            'password' => $input['password'],
        ]);

        VoucherService::buatVoucherNewUser($akun);

        return $akun;
    }
}
