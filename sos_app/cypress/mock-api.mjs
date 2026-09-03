// Minimal mock backend for Cypress E2E runs in CI.
//
// The Angular dev server proxies these prefixes to 127.0.0.1:9003:
//   /api, /storage, /broadcasting, /images, /sanctum
//
// The app's auth flow is real (NOT intercepted in Cypress) and needs:
//   GET  /sanctum/csrf-cookie  -> set XSRF-TOKEN cookie + empty 204
//   POST /api/v1/login         -> 200 with { user } after a valid credential pair
//   GET  /api/v1/user/verify   -> 200 with { user } (guarded pages call this on init)
//
// Only the credentials below are ever used by cy.login() in the specs.
// All other endpoints are intercepted in the specs via cy.intercept(), so
// anything else here just returns a sane empty/JSON fallback instead of
// ECONNREFUSED, which is what currently fails CI.

import http from 'node:http';
import { parse as parseCookie } from 'node:querystring';

const PORT = 9003;

const ADMIN_EMAIL = 'admin@localhost';
const ADMIN_PASSWORD = 'teste123';

const USER = {
  id: 1,
  name: 'Admin',
  email: ADMIN_EMAIL,
  type: { id: 1, name: 'Admin' },
};

function json(res, statusCode, body) {
  const data = typeof body === 'string' ? body : JSON.stringify(body);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
  });
  res.end(data);
}

function send(res, statusCode, body, headers = {}) {
  res.writeHead(statusCode, headers);
  res.end(body ?? '');
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  const path = url.pathname;
  const method = req.method.toUpperCase();

  // CSRF cookie endpoint (Laravel Sanctum).
  if (path === '/sanctum/csrf-cookie') {
    send(
      res,
      204,
      '',
      {
        'Set-Cookie': 'XSRF-TOKEN=fake-xsrf-token; Path=/; SameSite=Lax',
      },
    );
    return;
  }

  if (path === '/api/v1/login') {
    if (method !== 'POST') {
      send(res, 405, '');
      return;
    }

    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      let creds = {};
      try {
        creds = JSON.parse(body || '{}');
      } catch {
        send(res, 400, '');
        return;
      }

      if (creds.email === ADMIN_EMAIL && creds.password === ADMIN_PASSWORD) {
        json(res, 200, { user: USER });
      } else {
        json(res, 401, { message: 'Credenciais inválidas' });
      }
    });
    return;
  }

  if (path === '/api/v1/user/verify') {
    if (method !== 'GET') {
      send(res, 405, '');
      return;
    }
    json(res, 200, USER);
    return;
  }

  // Fallback for anything not intercepted (storage images, etc.).
  json(res, 200, {});
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[mock-api] listening on http://127.0.0.1:${PORT}`);
});

server.on('error', (err) => {
  console.error(`[mock-api] ${err.message}`);
  process.exit(1);
});