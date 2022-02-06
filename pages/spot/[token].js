import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const Spot = () => {
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const router = useRouter();
  const { token } = router.query;
  useEffect(() => {
    if (token !== undefined) {
      const accessTokenMatch = token
        .match(/access_token=\w+.+(?=&)/)[0]
        .split("=")[1];
      setAccessToken(accessTokenMatch);
      setRefreshToken(token.match(/refresh_token=\w+/)[0].split("=")[1]);
    }
    setLoading(false);
  }, [token]);
  if (loading) {
    return <p>loading</p>;
  }
  return (
    <>
      {/* <p>tokens: {token}</p> */}

      <p>access token: {accessToken}</p>
      <p>refresh token: {refreshToken}</p>
    </>
  );
};

export default Spot;
