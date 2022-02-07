import useURLParams from "../../hooks/useURLParams";
import Link from "next/link";

const Spot = () => {
  const { accessToken, refreshToken } = useURLParams();

  return (
    <>
      <h2>
        login successful, go{" "}
        <Link
          href={`/access_token=${accessToken}&refresh_token=${refreshToken}`}
        >
          <a>get my top 50</a>
        </Link>
        .
      </h2>
    </>
  );
};

export default Spot;
