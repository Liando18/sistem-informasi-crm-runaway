<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Contracts\Hashing\Hasher;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Midtrans\Config;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = config('midtrans.is_sanitized');
        Config::$is3ds = config('midtrans.is_3ds');
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Hash::extend('plaintext', function () {
            return new class implements Hasher
            {
                public function make($value, array $options = []): string
                {
                    return $value;
                }

                public function check($value, $hashedValue, array $options = []): bool
                {
                    return $value === $hashedValue;
                }

                public function needsRehash($hashedValue, array $options = []): bool
                {
                    return false;
                }

                public function info($hashedValue): array
                {
                    return ['algo' => 'plaintext'];
                }
            };
        });

        $this->configureDefaults();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
