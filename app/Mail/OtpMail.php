<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OtpMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $otp,
        public string $nama,
        public string $keperluan = 'Registrasi',
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Kode OTP {$this->keperluan} - Runaway Denim",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.auth.otp',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
