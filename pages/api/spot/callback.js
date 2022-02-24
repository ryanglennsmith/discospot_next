import queryString from "query-string";
import cookie from "cookie";

export default function handler(req, res) {
  const code = req.query.code || null;
  const state = req.query.state || null;
  // form and form body to "application/x-www-form-urlencoded"-ify the request body
  const form = {
    code: code,
    grant_type: "authorization_code",
    redirect_uri: "https://discospot-next.vercel.app/api/spot/callback",
  };
  const formBody = Object.keys(form)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(form[key]))
    .join("&");
  if (state === null) {
    res.redirect("/#" + queryString.stringify({ error: "state_mismatch" }));
  } else {
    const fetchToken = async () => {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID +
                ":" +
                process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET
            ).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody,
      });

      const data = await response.json();
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("access_token", data.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          maxAge: 3600,
          sameSite: "strict",
          path: "/",
        })
      );

      // res.setHeader(
      //   "Set-Cookie",
      //   cookie.serialize("refresh_token", data.refresh_token, {
      //     httpOnly: true,
      //     secure: process.env.NODE_ENV !== "development",
      //     maxAge: 3600,
      //     sameSite: "strict",
      //     path: "/",
      //   })
      // );
      const url =
        "/spot/" +
        queryString.stringify({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        });
      res.redirect("/spot");
    };
    fetchToken();
  }
}

// error.message === "The access token expired"
// error.status === 401
