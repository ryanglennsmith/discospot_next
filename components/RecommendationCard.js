import React from "react";
import Link from "next/link";
import Image from "next/image";

const RecommendationCard = ({ disco }) => {
  const { artist, title, image } = disco;

  return (
    <div className="w-44 h-60 border border-red-600">
      <Link
        href={`/disco/artist=${encodeURIComponent(
          artist
        )}&title=${encodeURIComponent(title)}`}
      >
        <a>
          {title} | {artist} <br />
          <Image src={image} alt={title} width="176px" height="176px" />
        </a>
      </Link>
    </div>
  );
};

export default RecommendationCard;
