// One-time helper: gets a Spotify refresh token for the site's "now playing" function.
//
// Run it in your own terminal (not through an AI chat, so the token isn't logged):
//
//   read "SPOTIFY_CLIENT_ID?Client ID: "; read -s "SPOTIFY_CLIENT_SECRET?Client secret: "; echo
//   export SPOTIFY_CLIENT_ID SPOTIFY_CLIENT_SECRET
//   node scripts/spotify-auth.mjs
//
// It opens Spotify's consent page, catches the redirect on http://127.0.0.1:8888/callback,
// swaps the code for tokens and prints the refresh token. Nothing is written to disk.

import http from 'node:http';
import crypto from 'node:crypto';
import { execFile } from 'node:child_process';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const PORT = 8888;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;
const SCOPES = ['user-read-currently-playing', 'user-read-recently-played', 'user-top-read'];

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET first (see the top of this file).');
  process.exit(1);
}

const state = crypto.randomBytes(16).toString('hex');
const authUrl = 'https://accounts.spotify.com/authorize?' + new URLSearchParams({
  response_type: 'code',
  client_id: CLIENT_ID,
  scope: SCOPES.join(' '),
  redirect_uri: REDIRECT_URI,
  state,
});

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI);
  if (url.pathname !== '/callback') { res.writeHead(404).end(); return; }

  const finish = (status, msg) => {
    res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' }).end(msg);
    server.close();
  };

  if (url.searchParams.get('error')) return finish(400, 'Spotify returned: ' + url.searchParams.get('error'));
  if (url.searchParams.get('state') !== state) return finish(400, 'State mismatch, run the script again.');

  try {
    const r = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: url.searchParams.get('code'),
        redirect_uri: REDIRECT_URI,
      }),
    });
    const data = await r.json();
    if (!r.ok || !data.refresh_token) {
      finish(500, 'Token exchange failed. Check the terminal.');
      console.error('Token exchange failed:', data);
      process.exitCode = 1;
      return;
    }
    finish(200, 'Done. You can close this tab and go back to the terminal.');
    console.log('\nGranted scopes:', data.scope);
    console.log('\nSPOTIFY_REFRESH_TOKEN=' + data.refresh_token);
    console.log('\nAdd SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET and SPOTIFY_REFRESH_TOKEN in Netlify:');
    console.log('Site configuration > Environment variables. Then clear this terminal.');
  } catch (e) {
    finish(500, 'Request failed. Check the terminal.');
    console.error(e);
    process.exitCode = 1;
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('Opening Spotify in your browser. If it does not open, visit:\n\n' + authUrl + '\n');
  execFile('open', [authUrl], () => {});
});
