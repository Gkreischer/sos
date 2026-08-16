FROM docker.io/shinsenter/laravel:php8.5-alpine

ENV LARAVEL_ENABLE_REVERB=1
ENV LARAVEL_ENABLE_QUEUE_WORKER=1

WORKDIR /var/www/html

COPY ./sos_api/composer.json ./sos_api/composer.lock ./

RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-interaction

COPY ./sos_api .

# Remova os caches DEPOIS do COPY
RUN rm -f bootstrap/cache/*.php

RUN cp .env.example .env

RUN php artisan key:generate --force

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

COPY ./cont-init.d /etc/cont-init.d

RUN chmod +x /etc/cont-init.d/*.sh
