import React from "react";
import Link from "next/link";

const Page = ({ data }) => {
  return (
    <div>
      logged in
      <>
        <h1 className="text-6xl mb-3">top 50 artists</h1>
        {/* make these links and go get recommendations based on that seed */}
        {data.items.map((artist) => (
          <div className="text-xl" key={artist.id}>
            <Link href={`/spot/recommend/seed=${artist.id}`}>
              <a>{artist.name}</a>
            </Link>{" "}
            | {artist.id} |{" "}
            <ul className="text-sm">
              {artist.genres.map((genre, index) => (
                <li key={artist.name + genre + index}>{genre}</li>
              ))}
            </ul>
          </div>
        ))}
        {data.items[0].genres.map((genre, index) => {
          <p key={index}>{genre}</p>;
        })}
      </>
    </div>
  );
};

export default Page;

export async function getServerSideProps(ctx) {
  const cookies = ctx.req.headers.cookie;
  if (cookies === undefined) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
      props: {},
    };
  }
  const accessToken = cookies.match(/access_token=\w+.+/)[0].split("=")[1];
  const res = await fetch(
    `https://api.spotify.com/v1/me/top/artists?limit=50`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const data = await res.json();
  return { props: { data: data, accessToken: accessToken } };
}
