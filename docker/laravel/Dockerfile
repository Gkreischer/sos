FROM docker.io/shinsenter/laravel:php8.5-alpine

WORKDIR /var/www/html

# Copia apenas os arquivos do Composer
COPY ./sos_api/composer.json ./sos_api/composer.lock ./

RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-interaction

# Agora copia o restante da aplicação
COPY ./sos_api .

RUN rm -f bootstrap/cache/config.php \
    bootstrap/cache/routes-v7.php \
    bootstrap/cache/services.php \
    bootstrap/cache/packages.php

RUN mkdir -p \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs

RUN chown -R www-data:www-data /var/www/html

COPY ./docker/cont-init.d /etc/cont-init.d

RUN chmod +x /etc/cont-init.d/*.sh