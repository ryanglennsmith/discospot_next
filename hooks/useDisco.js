import { useState, useEffect } from "react";

export default function useDisco(query) {
  const [discoData, setDiscoData] = useState();
  const [url, setUrl] = useState();

  useEffect(() => {
    const discoFetch = async () => {
      const url = `https://api.discogs.com/database/search?release_title=${encodeURIComponent(
        "Enemy of the sun"
      )}&artist=${encodeURIComponent("neurosis")}&type=master`;
      const headers = {
        headers: {
          Authorization: `Discogs token=${process.env.NEXT_PUBLIC_DISCO_ACCESS_TOKEN}`,
          "User-Agent": `"${process.env.NEXT_PUBLIC_DISCO_USER_AGENT}"`,
        },
      };
      const res = await fetch(url, headers);
      const data = await res.json();
      console.log(data);
      setDiscoData(data);
    };
    discoFetch();
  }, []);
  return [discoData];
}

/* url for a master id : 
`https://api.discogs.com/database/search?release_title=${encodeURIComponent(
        "Enemy of the sun"
      )}&artist=${encodeURIComponent("neurosis")}&type=master`;
*/
