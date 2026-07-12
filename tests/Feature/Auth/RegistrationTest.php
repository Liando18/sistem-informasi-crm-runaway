<?php

use App\Mail\OtpMail;
use App\Models\OtpCode;
use Illuminate\Support\Facades\Mail;

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertOk();
});

test('can send otp to email', function () {
    Mail::fake();

    $response = $this->post(route('register.step1'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('otp_code', ['email' => 'test@example.com']);
    Mail::assertSent(OtpMail::class);

    expect(session('otp_register.name'))->toBe('Test User');
    expect(session('otp_register.email'))->toBe('test@example.com');
});

test('can verify otp', function () {
    OtpCode::create([
        'email' => 'test@example.com',
        'otp' => '123456',
        'expires_at' => now()->addMinutes(10),
    ]);

    session(['otp_register' => ['name' => 'Test User', 'email' => 'test@example.com']]);

    $response = $this->post(route('register.step2'), [
        'otp' => '123456',
    ]);

    $response->assertRedirect();
    expect(session('otp_register.verified'))->toBeTrue();
});

test('can complete registration', function () {
    session([
        'otp_register' => [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'verified' => true,
        ],
    ]);

    $response = $this->post(route('register.complete'), [
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
    $this->assertDatabaseHas('akun', ['email' => 'test@example.com']);
});

test('requires valid email for step 1', function () {
    $response = $this->post(route('register.step1'), [
        'name' => 'Test User',
        'email' => 'invalid-email',
    ]);

    $response->assertRedirect();
    $response->assertSessionHasErrors('email');
});

test('requires valid otp for step 2', function () {
    session(['otp_register' => ['name' => 'Test', 'email' => 'test@example.com']]);

    $response = $this->post(route('register.step2'), [
        'otp' => '999999',
    ]);

    $response->assertRedirect();
    $response->assertSessionHasErrors('otp');
});

test('requires valid session for step 3', function () {
    $response = $this->post(route('register.complete'), [
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertRedirect();
    $response->assertSessionHasErrors('password');
});
