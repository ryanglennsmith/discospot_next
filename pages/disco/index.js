import React from "react";

const Disco = () => {
  return <div>hi</div>;
};

export default Disco;
export async function getServerSideProps() {
  const res = await fetch(
    `https://api.discogs.com/users/ryanglennsmith/collection/folders/0/releases`,
    {
      headers: {
        Authorization: `Discogs token=${process.env.DISCO_ACCESS_TOKEN}`,
        "User-Agent": `"${process.env.DISCO_USER_AGENT}"`,
      },
    }
  );
  const data = await res.json();
  console.log(res.headers);
  console.log(data);
  return {
    props: {
      message: `hi`,
    },
  };
}
