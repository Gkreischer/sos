<?php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;

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
        if ($value === null) {
            return null;
        }

        $value = trim($value);
        if ($value === '') {
            return null;
        }

        // 1. Remove qualquer caractere que não seja número, ponto, vírgula ou sinal de menos
        $value = preg_replace('/[^\d,.\-]/', '', $value);

        // 2. Se tiver vírgula E ponto, assume que é padrão BR (ex: 1.234.567,89)
        // Remove os pontos de milhar e troca a vírgula decimal por ponto
        if (str_contains($value, ',') && str_contains($value, '.')) {
            $value = str_replace('.', '', $value);
            $value = str_replace(',', '.', $value);
        }
        // 3. Se tiver APENAS vírgula, é o padrão BR simples (ex: 1234,56)
        elseif (str_contains($value, ',')) {
            $value = str_replace(',', '.', $value);
        }
        // 4. SEU CASO: Se tiver múltiplos pontos e NENHUMA vírgula (ex: 4.555.555)
        // Significa que são pontos de milhar do padrão BR, sem os centavos digitados.
        elseif (substr_count($value, '.') > 1) {
            $value = str_replace('.', '', $value); // Remove todos os pontos
        }

        // 5. Valida se o PHP agora entende como um número limpo
        if (! is_numeric($value)) {
            throw new \InvalidArgumentException("Valor inválido: {$value}");
        }

        // Retorna formatado estritamente como decimal para o banco de dados (ex: 4555555.00)
        return number_format((float) $value, 2, '.', '');
    }
}
