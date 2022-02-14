import useURLParams from "../../../hooks/useURLParams";
import RecommendationCard from "../../../components/RecommendationCard";
import { useEffect, useState } from "react";

const Recommend = () => {
  const { seed } = useURLParams();
  const [recommendation, setRecommendation] = useState(null);
  console.log(recommendation);
  useEffect(() => {
    const fetchRecommendations = async () => {
      const res = await fetch(`/api/spot/recommendations/${seed}`);
      const data = await res.json();
      setRecommendation(data.data);
      console.log(data.data);
    };
    fetchRecommendations();
  }, [seed]);

  if (recommendation !== null && !recommendation.error) {
    return (
      <div>
        go listen to:{" "}
        <ul>
          {recommendation.tracks.map((track, index) => (
            <li key={track.album.id + index}>
              <RecommendationCard
                disco={{
                  artist: track.album.artists[0].name,
                  title: track.album.name,
                  image: track.album.images[0].url,
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
