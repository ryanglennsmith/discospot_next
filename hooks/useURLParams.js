import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function useURLParams() {
  const [accessToken, setAccessToken] = useState();
  // const [refreshToken, setRefreshToken] = useState();
  const [seed, setSeed] = useState();
  const [title, setTitle] = useState();
  const [artist, setArtist] = useState();
  const [masterId, setMasterId] = useState();
  const router = useRouter();
  const { urlParams } = router.query;
  useEffect(() => {
    if (urlParams.includes("seed")) {
      console.log(urlParams);
      setSeed(urlParams.match(/seed=\w+.+/)[0].split("=")[1]);
    }
    if (urlParams.includes("artist")) {
      console.log(urlParams);
      setArtist(urlParams.match(/artist=\w+.+(?=&)/)[0].split("=")[1]);
      setTitle(urlParams.match(/&title=\w+.+/)[0].split("=")[1]);
    }
  }, [urlParams]);
  return { seed, artist, title };
}
