const port = window.location.port
  ? Number(window.location.port)
  : window.location.protocol === 'https:'
    ? 443
    : 9003;

export const environment = {
  production: true,

  baseUrl: '/api/v1',
  storageUrl: '/storage',
  authEndpoint: '/broadcasting/auth',

  reverbKey: 'GENERATEYOUROWNKEY',
  reverbHost: 'localhost',
  reverbPort: 8080,

  cepUrl: 'https://viacep.com.br/ws/',

  wsHost: 'localhost',
  wsPort: port,
  wsScheme: window.location.protocol === 'https:' ? 'wss' : 'ws',
};
