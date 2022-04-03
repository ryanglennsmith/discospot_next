import SpotifyWebApi from "spotify-web-api-node";
export default async function handler(req, res) {
  const code = req.query.code;
  const spotifyApi = new SpotifyWebApi({
    redirectUri:
      process.env.NEXT_PUBLIC_SPOTIFY_CALLBACK_URL ||
      "https://discospot-next.vercel.app/api/spot/callback",
    clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET,
  });
  try {
    const grantData = await spotifyApi.authorizationCodeGrant(code);
    spotifyApi.setAccessToken(grantData.body["access_token"]);
    spotifyApi.setRefreshToken(grantData.body["refresh_token"]);

    const accessToken = spotifyApi.getAccessToken();
    const refreshToken = spotifyApi.getRefreshToken();
    res.redirect(`/spot/sd=null&tk=${accessToken}&rtk=${refreshToken}`);
  } catch (e) {
    console.error(e);
    res.redirect("/");
  }
}
