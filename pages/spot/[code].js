import Head from "next/head";
import SpotifyWebApi from "spotify-web-api-node";
import ArtistCard from "../../components/ArtistCard";

export async function getServerSideProps(ctx) {
  const urlArray = ctx.query.code.split("=");
  const accessToken = urlArray[2].match(/^\w.+[^(&rtk)]/)[0];
  const refreshToken = urlArray[3].match(/^\w.+/)[0];
  const spotifyApi = new SpotifyWebApi({
    redirectUri:
      process.env.NEXT_PUBLIC_SPOTIFY_CALLBACK_URL ||
      "https://discospot-next.vercel.app/api/spot/callback",
    clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET,
    accessToken: accessToken,
    refreshToken: refreshToken,
  });
  try {
    const top25 = await spotifyApi.getMyTopArtists({ limit: 25 });

    return {
      props: {
        top25: top25.body,
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    };
  } catch (e) {
    console.error(e);
    if (e.body.error === "invalid_grant")
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
        props: {},
      };
  }
}

const Page = ({ top25, accessToken, refreshToken }) => {
  return (
    <>
      <Head>
        <title>discospot</title>
        <meta name="description" content="discospot" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="m-auto flex flex-col justify-center align-middle">
        {" "}
        <h1 className="text-center">your top 25</h1>
        <div className="flex flex-wrap m-auto p-1 justify-center w-4/5 ">
          {top25.items.map((artist) => (
            <>
              <ArtistCard
                key={`${artist.id}cardComp`}
                image={artist.images[0].url}
                artist={artist.name}
                artistId={artist.id}
                accessToken={accessToken}
                refreshToken={refreshToken}
              ></ArtistCard>
            </>
          ))}
        </div>
      </div>
    </>
  );
};

export default Page;
