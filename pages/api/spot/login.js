import SpotifyWebApi from "spotify-web-api-node";
const scopes = [
  // "user-read-private",
  // "user-read-email",

  // "user-modify-playback-state",
  // "user-read-playback-position",
  // "streaming",
  // "user-read-playback-state",
  // "user-read-recently-played",
  // "playlist-read-private",
  "user-library-read",
  "user-top-read",
  "user-follow-read",
];
const spotifyApi = new SpotifyWebApi({
  redirectUri:
    process.env.NEXT_PUBLIC_SPOTIFY_CALLBACK_URL ||
    "https://discospot-next.vercel.app/api/spot/callback",
  clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET,
});
const generateRandomString = (length) => {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
const state = generateRandomString(16);
const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
export default function handler(req, res) {
  res.redirect(authorizeURL);
}
