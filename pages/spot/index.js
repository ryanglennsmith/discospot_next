import React from "react";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";

const Page = ({ data }) => {
  return (
    <>
      <Head>
        <title>discospot</title>
        <meta name="description" content="discospot" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <h1>your top 50</h1>
        <div className="flex flex-wrap m-auto mx-5 my-10 p-1 justify-center">
          {data.items.map((artist) => (
            <div
              className="text-xl w-40 h-40 overflow-auto scrollbar-none m-3 shadow-lg shadow-slate-700 text-center bg-white"
              key={artist.id}
            >
              <Link href={`/spot/recommend/seed=${artist.id}`}>
                <a>
                  <Image
                    src={artist.images[2].url}
                    alt={artist.name}
                    width="160px"
                    height="160px"
                  />
                  <br />
                  <span className="p-1">{artist.name}</span>
                </a>
              </Link>{" "}
              <ul className="p-1 text-sm">
                {artist.genres.map((genre, index) => (
                  <li key={artist.name + genre + index}>{genre}</li>
                ))}
              </ul>
            </div>
          ))}
          {data.items[0].genres.map((genre, index) => {
            <p key={index}>{genre}</p>;
          })}
        </div>
      </div>
    </>
  );
};

export default Page;

export async function getServerSideProps(ctx) {
  const cookie = await ctx.req.headers.cookie;
  if (cookie === undefined) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
      props: {},
    };
  }
  const accessToken = cookie.match(/access_token=\w+.+/)[0].split("=")[1];
  const res = await fetch(
    `https://api.spotify.com/v1/me/top/artists?limit=50`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const data = await res.json();
  return { props: { data: data, accessToken: accessToken } };
}
