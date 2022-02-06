import { generateRandomString } from "../../../utils/functions";
import queryString from "query-string";

const scope = [
  "user-read-private",
  "user-read-email",
  "user-library-read",
  "user-modify-playback-state",
  "user-read-playback-position",
  "user-library-read",
  "streaming",
  "user-read-playback-state",
  "user-read-recently-played",
  "playlist-read-private",
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
        redirect_uri: process.env.NEXT_PUBLIC_SPOTIFY_CALLBACK_URL,
        state: state,
      })
  );
}
