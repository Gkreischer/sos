<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    */

    // 1. ADICIONADO: 'broadcasting/auth' para que o Laravel aplique o CORS nessa rota também
    // Se o seu endpoint for 'api/broadcasting/auth', o 'api/*' já cobriria, mas deixar explícito garante o funcionamento.
    'paths' => ['api/*', 'broadcasting/auth', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // 2. RECOMENDAÇÃO: Quando 'supports_credentials' é true, usar '*' no allowed_origins pode falhar em alguns navegadores.
    // É mais seguro colocar a URL exata do seu Angular.
    'allowed_origins' => ['http://localhost:8100', 'http://localhost:4200', 'http://localhost', 'http://localhost:9003', 'https://localhost',],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
