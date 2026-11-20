// GET /api/spotify: what Anuj is listening to.
// Returns { status: 'playing' | 'recent' | 'none', track, playedAt, onRepeat }.
// Needs SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET and SPOTIFY_REFRESH_TOKEN
// (set in Netlify; see scripts/spotify-auth.mjs for getting the token).

const API = 'https://api.spotify.com/v1';
let cached = { token: null, expires: 0 };

async function accessToken() {
  if (cached.token && Date.now() < cached.expires) return cached.token;
  const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret, SPOTIFY_REFRESH_TOKEN: refresh } = process.env;
  if (!id || !secret || !refresh) throw new Error('Spotify env vars missing');

  const r = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(`${id}:${secret}`).toString('base64'),
    },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refresh }),
  });
  if (!r.ok) throw new Error(`token refresh failed: ${r.status}`);
  const data = await r.json();
  cached = { token: data.access_token, expires: Date.now() + (data.expires_in - 60) * 1000 };
  return cached.token;
}

async function get(path, token) {
  const r = await fetch(API + path, { headers: { Authorization: `Bearer ${token}` } });
  if (r.status === 204) return null;
  if (!r.ok) throw new Error(`${path}: ${r.status}`);
  return r.json();
}

// Keep only what the page shows; never pass Spotify's raw payload through.
function track(t) {
  if (!t || t.type !== 'track') return null;
  const images = t.album?.images || [];
  return {
    name: t.name,
    artists: (t.artists || []).map((a) => a.name),
    url: t.external_urls?.spotify || null,
    image: (images[images.length - 1] || images[0] || {}).url || null,
  };
}

export default async () => {
  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=0, must-revalidate',
    // Cache at Netlify's edge briefly so visits don't each hit Spotify.
    'Netlify-CDN-Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
  };

  try {
    const token = await accessToken();
    const [now, top] = await Promise.all([
      get('/me/player/currently-playing', token),
      get('/me/top/tracks?time_range=short_term&limit=5', token).catch(() => null),
    ]);
    const onRepeat = (top?.items || []).map(track).filter(Boolean);

    if (now?.is_playing && track(now.item)) {
      return Response.json({ status: 'playing', track: track(now.item), onRepeat }, { headers });
    }

    const recent = await get('/me/player/recently-played?limit=1', token);
    const last = recent?.items?.[0];
    if (last && track(last.track)) {
      return Response.json({ status: 'recent', track: track(last.track), playedAt: last.played_at, onRepeat }, { headers });
    }
    return Response.json({ status: 'none', onRepeat }, { headers });
  } catch (err) {
    console.error('spotify function:', err.message);
    return Response.json({ status: 'error' }, { status: 502, headers: { ...headers, 'Netlify-CDN-Cache-Control': 'no-store' } });
  }
};

export const config = { path: '/api/spotify' };
