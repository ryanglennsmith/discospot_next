import useURLParams from "../../../hooks/useURLParams";
import useSpot from "../../../hooks/useSpot";
import RecommendationCard from "../../../components/RecommendationCard";
import getSellersList from "../../../utils/nodescraper";
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
              <RecommendationCard
                disco={{
                  artist: track.album.artists[0].name,
                  title: track.album.name,
                }}
              />
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
export async function getServerSideProps() {
  const data = await getSellersList(11987);
  console.log("get sellers data: ", data);
  return { props: { data: data } };
}
