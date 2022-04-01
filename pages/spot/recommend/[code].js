import SpotifyWebApi from "spotify-web-api-node";
import RecommendationCard from "../../../components/RecommendationCard";
import Head from "next/head";
export async function getServerSideProps(ctx) {
  const code = ctx.req.url.split("/")[2];
  let spotifyApi = new SpotifyWebApi({
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
    const spotData = spotifyApi.getRecommendations({
      seed_artists: [encodeURIComponent(seed)],
      limit: 5,
    });
    const accessToken = spotifyApi.getAccessToken();
    console.log(spotData.body);
    return { props: { data: "top50.body", accessToken: accessToken } };
  } catch (e) {
    // return {
    //   redirect: {
    //     destination: "/",
    //     permanent: false,
    //   },
    //   props: {},
    // };
    console.error(e);
  }
}
const Recommend = ({ spotData }) => {
  return (
    <>
      {" "}
      <Head>
        <title>discospot</title>
        <meta name="description" content="discospot" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        go buy something like:{" "}
        <div className="flex justify-center flex-wrap">
          {spotData.map((album, index) => {
            {
              if (album.master_id !== null) {
                return (
                  <div
                    className="text-xl w-40 h-40 overflow-auto scrollbar-none m-3 shadow-lg shadow-slate-700 text-center text-ellipsis"
                    key={album.id + index}
                  >
                    <RecommendationCard
                      disco={{
                        artist: album.artist,
                        title: album.title,
                        image: album.image,
                        masterId: album.master_id,
                      }}
                    />
                  </div>
                );
              } else {
                return (
                  <div
                    className="text-xl w-40 h-40 overflow-auto scrollbar-none m-3 shadow-lg opacity-40 hover:opacity-100 p-2"
                    key={album.id + index}
                  >
                    <RecommendationCard
                      disco={{
                        artist: album.artist,
                        title: album.title,
                        image: album.image,
                        masterId: album.master_id,
                      }}
                    />
                  </div>
                );
              }
            }
          })}
        </div>
      </div>
    </>
  );
};
export default Recommend;
