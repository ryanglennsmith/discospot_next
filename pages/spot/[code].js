import React, { useState, useEffect } from "react";
import Head from "next/head";
import SpotifyWebApi from "spotify-web-api-node";
import RecommendationCard from "../../components/RecommendationCard";
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
    const top50 = await spotifyApi.getMyTopArtists({ limit: 50 });
    const accessToken = spotifyApi.getAccessToken();
    return { props: { top50: top50.body, accessToken: accessToken } };
  } catch (e) {
    console.error(e);
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
      props: {},
    };
  }
}

const Page = ({ top50, accessToken }) => {
  const [openRecommendations, setOpenRecommendations] = useState(false);
  const [seed, setSeed] = useState();
  const [spotData, setSpotData] = useState();
  useEffect(() => {
    if (seed) {
      const getSomeRecommendations = async () => {
        const data = await fetch(
          `https://api.spotify.com/v1/recommendations?seed_artists=${encodeURIComponent(
            seed
          )}&limit=5`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        const recommendations = await data.json();
        const spotPayload = recommendations.tracks.map((track) => {
          return {
            id: track.album.id,
            artist: track.album.artists[0].name,
            title: track.album.name,
            image: track.album.images[0].url,
          };
        });
        const promises = spotPayload.map(async (item) => {
          const url = `https://api.discogs.com/database/search?release_title=${encodeURIComponent(
            item.title
          )}&artist=${encodeURIComponent(item.artist)}&type=master`;
          const headers = {
            headers: {
              Authorization: `Discogs token=${process.env.NEXT_PUBLIC_DISCO_ACCESS_TOKEN}`,
              "User-Agent": `"${process.env.NEXT_PUBLIC_DISCO_USER_AGENT}"`,
            },
          };
          const res = await fetch(url, headers);
          const data = await res.json();
          return data;
        });
        const discoData = await Promise.all(promises);
        const discoPayload = discoData.map((artist) => {
          if (artist.results[0] === undefined) {
            return {
              master_id: null,
            };
          }
          return {
            master_id: artist.results[0].master_id,
            artist_title: artist.results[0].title,
          };
        });
        spotPayload.forEach((spot, index) => {
          spot.master_id = discoPayload[index].master_id;
        });
        setSpotData(spotPayload);
      };
      getSomeRecommendations();
    }
  }, [seed]);
  return (
    <>
      <Head>
        <title>discospot</title>
        <meta name="description" content="discospot" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {openRecommendations && spotData && (
        <div className="flex flex-column justify-center text-center flex-wrap">
          <div>go buy something like: </div>
          <div className="flex flex-row">
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
                    <></>
                    // <div
                    //   className="text-xl w-40 h-40 overflow-auto scrollbar-none m-3 shadow-lg opacity-40 hover:opacity-100 p-2"
                    //   key={album.id + index}
                    // >
                    //   <RecommendationCard
                    //     disco={{
                    //       artist: album.artist,
                    //       title: album.title,
                    //       image: album.image,
                    //       masterId: album.master_id,
                    //     }}
                    //   />
                    // </div>
                  );
                }
              }
            })}
          </div>
          <div>
            <button onClick={() => setOpenRecommendations(false)}>
              try again
            </button>
          </div>
        </div>
      )}
      {!openRecommendations && (
        <div>
          <h1>your top 50</h1>
          <div className="flex flex-wrap m-auto mx-5 my-10 p-1 justify-center">
            {top50.items.map((artist) => (
              <div
                //  scrollbar-none
                className="text-xl w-40 h-40 overflow-hidden m-3 shadow-lg shadow-slate-700 text-center bg-black"
                key={artist.id}
              >
                {/* <Link href={`/spot/recommend/seed=${artist.id}`}>
                <a> */}
                <div className="bg-black m-auto hover:cursor-pointer">
                  <img
                    onClick={(e) => {
                      {
                        setSeed(artist.id);
                        setOpenRecommendations(true);
                      }
                    }}
                    className="min-h-full"
                    src={artist.images[0].url}
                    alt={artist.name}
                    value={artist.id}
                    // width="160"
                    // height="160"
                  />
                  {/* <Image
                    src={artist.images[2].url}
                    alt={artist.name}
                    width="160px"
                    height="160px"
                  /> */}
                  <br />
                  {/* <span className="p-1">{artist.name}</span> */}
                </div>
                {/* </a>
              </Link>{" "} */}
                {/* <ul className="p-1 text-sm">
                {artist.genres.map((genre, index) => (
                  <li key={artist.name + genre + index}>{genre}</li>
                ))}
              </ul> */}
              </div>
            ))}
            {top50.items[0].genres.map((genre, index) => {
              <p key={index}>{genre}</p>;
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
