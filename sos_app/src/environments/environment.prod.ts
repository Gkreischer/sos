export const environment = {
  production: true,

  baseUrl: '/api/v1',
  storageUrl: '/storage',
  authEndpoint: '/broadcasting/auth',

  reverbKey: 'GENERATEYOUROWNKEY',
  reverbHost: 'localhost',
  reverbPort: 8080,

  cepUrl: 'https://viacep.com.br/ws/',

  wsHost: window.location.hostname,
  wsPort: 9003,
  wsScheme: window.location.protocol === 'https:' ? 'wss' : 'ws',
};
