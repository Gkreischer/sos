<?php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

class BrlDecimalCast implements CastsAttributes
{
    public function get($model, string $key, $value, array $attributes)
    {
        return $value === null ? null : (float) $value;
    }

    public function set($model, string $key, $value, array $attributes)
    {
        return $this->brlToDecimal($value);
    }

    private function brlToDecimal(?string $value): ?string
    {
        if ($value === null) return null;

        $value = trim($value);
        if ($value === '') return null;

        $value = preg_replace('/[^\d,.\-]/', '', $value);

        if (str_contains($value, ',')) {
            $value = str_replace('.', '', $value);
            $value = str_replace(',', '.', $value);
        }

        if (!is_numeric($value)) {
            throw new \InvalidArgumentException("Valor inválido: {$value}");
        }

        return number_format((float)$value, 2, '.', '');
    }
}
