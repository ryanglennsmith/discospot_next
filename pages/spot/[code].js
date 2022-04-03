import React, { useState, useEffect } from "react";
import Head from "next/head";
import SpotifyWebApi from "spotify-web-api-node";
import Link from "next/link";

export async function getServerSideProps(ctx) {
  const urlArray = ctx.query.code.split("=");
  const seed = urlArray[1].match(/^\w.+[^(&tk)]/)[0];
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
        // recommendationData: recommendationData,
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
      <div>
        <h1>your top 25</h1>
        <div className="flex flex-wrap m-auto mx-5 my-10 p-1 justify-center">
          {top25.items.map((artist, index) => (
            <div
              //  scrollbar-none
              className="text-xl w-40 h-40 overflow-hidden m-3 shadow-lg shadow-slate-700 text-center bg-black"
              key={artist.id}
            >
              <Link
                href={`/spot/recommend/sd=${artist.id}&tk=${accessToken}&rtk=${refreshToken}`}
              >
                <a>
                  <div className="bg-black m-auto hover:cursor-pointer">
                    <img
                      className="min-h-full"
                      src={artist.images[0].url}
                      alt={artist.name}
                      value={artist.id}
                    />

                    <br />
                    {/* <span className="p-1">{artist.name}</span> */}
                  </div>
                </a>
              </Link>{" "}
              {/* <ul className="p-1 text-sm">
                {artist.genres.map((genre, index) => (
                  <li key={artist.name + genre + index}>{genre}</li>
                ))}
              </ul> */}
            </div>
          ))}
          {top25.items[0].genres.map((genre, index) => {
            <p key={index}>{genre}</p>;
          })}
        </div>
      </div>
      )
    </>
  );
};

export default Page;
