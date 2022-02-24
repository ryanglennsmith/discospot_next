import { generateRandomString } from "../../../utils/functions";
import queryString from "query-string";

const scope = [
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
const state = generateRandomString(16);
export default function handler(req, res) {
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      queryString.stringify({
        response_type: "code",
        client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
        scope: scope.join(" "),
        redirect_uri: 'https://discospot-next.vercel.app/api/spot/callback',
        state: state,
      })
  );
}
