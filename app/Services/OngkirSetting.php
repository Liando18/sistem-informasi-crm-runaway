<?php

namespace App\Services;

class OngkirSetting
{
    private static string $path;

    private static function path(): string
    {
        if (! isset(self::$path)) {
            self::$path = storage_path('app/settings/ongkir.json');
        }

        return self::$path;
    }

    public static function get(): array
    {
        $path = self::path();
        if (! file_exists($path)) {
            return self::defaults();
        }

        return array_merge(self::defaults(), json_decode(file_get_contents($path), true) ?? []);
    }

    public static function save(array $data): void
    {
        $path = self::path();
        $dir = dirname($path);
        if (! is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
        file_put_contents($path, json_encode($data, JSON_PRETTY_PRINT));
    }

    public static function defaults(): array
    {
        return [
            'jarak_gratis' => 0,
            'ongkir_per_km' => 2500,
            'jarak_per_kenaikan' => 10,
        ];
    }
}
