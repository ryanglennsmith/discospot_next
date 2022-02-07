import { useEffect, useState } from "react";

// take in query as object

const sampleQuery = {
  me: true,
  seed: "Clutch",
};

export default function useSpot(accessToken, query) {
  const [spotData, setSpotData] = useState();
  useEffect(() => {
    if (accessToken !== undefined) {
      const fetchData = async () => {
        const res = await fetch(
          `https://api.spotify.com/v1/me/top/artists?limit=50`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        const data = await res.json();
        setSpotData(data);
        console.log(data);
      };
      fetchData();
    }
  }, [accessToken]);

  return [spotData];
}
