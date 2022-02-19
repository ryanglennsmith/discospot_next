import RecommendationCard from "../../../components/RecommendationCard";

const Recommend = ({ spotData, discoData }) => {
  return (
    <div>
      go listen to:{" "}
      <div className="flex justify-center">
        {spotData.map((album, index) => {
          {
            if (album.master_id !== null) {
              return (
                <div
                  className="w-44 h-80 border border-red-600 m-2 p-2"
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
                  className="w-44 h-80 border border-black m-2 opacity-40 hover:opacity-100 p-2"
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
  );
};
export default Recommend;
export async function getServerSideProps(ctx) {
  // get the spotify data
  const seed = ctx.query.urlParams.split("=")[1];
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
  const spotRes = await fetch(
    `https://api.spotify.com/v1/recommendations?seed_artists=${encodeURIComponent(
      seed
    )}&limit=5`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  const spotData = await spotRes.json();
  const spotPayload = spotData.tracks.map((track) => {
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
    // console.log("disco_data: ", data);
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
  return { props: { spotData: spotPayload, discoData: discoPayload } };
}
