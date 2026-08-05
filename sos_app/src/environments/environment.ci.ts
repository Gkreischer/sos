const port = window.location.port
  ? Number(window.location.port)
  : window.location.protocol === 'https:'
    ? 443
    : 9003;

export const environment = {
  production: false,
  baseUrl: '/api/v1',
  storageUrl: '/storage',
  cepUrl: 'https://viacep.com.br/ws/',

  authEndpoint: '/broadcasting/auth',

  reverbKey: 'GENERATEYOUROWNKEY',
  reverbHost: window.location.hostname,
  reverbPort: 8080,

  wsHost: window.location.hostname,
  wsPort: port,
  wsScheme: window.location.protocol === 'https:' ? 'wss' : 'ws',
};
