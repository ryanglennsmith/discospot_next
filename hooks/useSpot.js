import { useEffect, useState } from "react";

const sampleQuery = {
  endpoint: "top50",
  artistId: "161AC1AVRkIGIMxyj5djFQ",
  genre: "stoner metal",
};

export default function useSpot(query) {
  const [spotData, setSpotData] = useState();
  const [url, setUrl] = useState();

  useEffect(() => {
    const spotifyFetch = async () => {
      if (query.endpoint === "top50") {
        setUrl(`https://api.spotify.com/v1/me/top/artists?limit=50`);
      } else if (query.artistId !== null) {
        setUrl(
          `https://api.spotify.com/v1/recommendations?seed_artists=${query.artistId}&limit=5`
        );
      }
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      console.log(data);
      setSpotData(data);
    };

    // if (accessToken !== undefined) {
    //   spotifyFetch();
    // }
  }, [url, query.artistId, query.endpoint]);

  return [spotData];
}
