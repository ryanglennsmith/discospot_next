import useURLParams from "../../../hooks/useURLParams";
import RecommendationCard from "../../../components/RecommendationCard";
import { useEffect, useState } from "react";

const Recommend = () => {
  const { seed } = useURLParams();
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const res = await fetch(`/api/spot/recommendations/${seed}`);
      const data = await res.json();

      setRecommendation(data.data);
    };
    fetchRecommendations();
  }, [seed]);

  if (recommendation !== null && !recommendation.error) {
    return (
      <div>
        go listen to:{" "}
        <div className="flex justify-center">
          {recommendation.tracks.map((track, index) => (
            <div
              className="w-44 h-60 border border-red-600 m-2"
              key={track.album.id + index}
            >
              <RecommendationCard
                disco={{
                  artist: track.album.artists[0].name,
                  title: track.album.name,
                  image: track.album.images[0].url,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    return <p>loading</p>;
  }
};
export default Recommend;
