import useURLParams from "../../../hooks/useURLParams";
import useSpot from "../../../hooks/useSpot";

const Recommend = () => {
  const { accessToken, refreshToken, seed } = useURLParams();
  const [spotData] = useSpot(accessToken, {
    endpoint: "recommend",
    artistId: seed,
    genre: "nu metal",
  });
  if (spotData !== undefined) {
    return (
      <div>
        go listen to:{" "}
        <ul>
          {spotData.tracks.map((track, index) => (
            <li key={track.album.id + index}>
              {track.album.name} | {track.album.artists[0].name}
            </li>
          ))}
        </ul>
      </div>
    );
  } else {
    return <p>loading</p>;
  }
};
export default Recommend;
