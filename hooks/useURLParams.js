import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function useURLParams() {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [seed, setSeed] = useState();

  const router = useRouter();
  const { urlParams } = router.query;
  useEffect(() => {
    if (urlParams !== undefined) {
      setAccessToken(
        urlParams.match(/access_token=\w+.+(?=&)/)[0].split("=")[1]
      );
      setRefreshToken(urlParams.match(/refresh_token=\w+/)[0].split("=")[1]);
      if (urlParams.includes("seed")) {
        setSeed(urlParams.match(/seed=\w+.+(?=&)/)[0].split("=")[1]);
      }
    }
  }, [urlParams]);
  return { accessToken, refreshToken, seed };
}
