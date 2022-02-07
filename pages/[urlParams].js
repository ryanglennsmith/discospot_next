import useURLParams from "../hooks/useURLParams";
import useSpot from "../hooks/useSpot";
import Link from "next/link";

const Query = () => {
  const { accessToken, refreshToken } = useURLParams();
  const [spotData] = useSpot(accessToken);

  if (spotData !== undefined) {
    return (
      <div>
        <h1>data:</h1>
        {/* make these links and go get recommendations based on that seed */}
        {spotData.items.map((artist) => (
          <div className="text-xl" key={artist.id}>
            <Link
              href={`/spot/recommend/access_token=${accessToken}&refresh_token=${refreshToken}&seed=${artist.name}&`}
            >
              <a>{artist.name}</a>
            </Link>{" "}
            |{" "}
            <ul className="text-sm">
              {artist.genres.map((genre, index) => (
                <li key={artist.name + genre + index}>{genre}</li>
              ))}
            </ul>
          </div>
        ))}
        {spotData.items[0].genres.map((genre, index) => {
          <p key={index}>{genre}</p>;
        })}
      </div>
    );
  } else {
    return <p>loading</p>;
  }
};

export default Query;
