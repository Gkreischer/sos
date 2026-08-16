#!/usr/bin/env sh

set -e

echo "========================================="
echo "Inicializando aplicação Laravel..."
echo "========================================="

cd /var/www/html

echo "Limpando cache..."
php artisan optimize:clear

echo "Executando migrations..."
php artisan migrate --force

echo "Verificando seed inicial..."

ROLE_COUNT=$(php -r "
require 'vendor/autoload.php';
\$app = require 'bootstrap/app.php';
\$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
echo \Spatie\Permission\Models\Role::count();
")

if [ "$ROLE_COUNT" -eq 0 ]; then
    echo "Primeira instalação detectada."

    php artisan db:seed --class=RolesAndPermissionsSeeder --force
    php artisan db:seed --class=UserTypeSeeder --force
    php artisan db:seed --class=UserSeeder --force
    php artisan db:seed --class=BusinessInfoSeeder --force
    php artisan db:seed --class=OrderStatusSeeder --force
else
    echo "Seed inicial já executado."
fi

echo "Criando link do storage..."
php artisan storage:link || true

echo "Otimizando aplicação..."
php artisan optimize

echo "Inicialização concluída."