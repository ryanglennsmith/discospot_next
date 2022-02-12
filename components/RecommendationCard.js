import React from "react";
import useDisco from "../hooks/useDisco";
import getSellersList from "../utils/nodescraper";
import Link from "next/link";

const RecommendationCard = ({ disco, data }) => {
  const { artist, title } = disco;

  //   console.log("sellers: ", sellers);
  //   if (discoData !== undefined && discoData[0] !== undefined) {
  //     console.log("disco data: ", discoData[0].master_id);
  //     console.log("data data", data);
  return (
    <div className="w-44 h-60 border border-red-600">
      <Link
        href={`/spot/recommend/sellers/title=${encodeURIComponent(
          title
        )}&artist=${encodeURIComponent(artist)}`}
      >
        <a>
          {title} | {artist}
        </a>
      </Link>
    </div>
  );
};
//   return <div>loading</div>;

export default RecommendationCard;
// export async function getServerSideProps() {
//   const data = await getSellersList(11987);
//   console.log("get sellers data: ", data);
//   return { props: { data: data } };
// }
