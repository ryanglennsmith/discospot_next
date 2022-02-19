import React from "react";
import Link from "next/link";
import Image from "next/image";

const RecommendationCard = ({ disco }) => {
  const { artist, title, image, masterId } = disco;
  if (masterId === null) {
    return (
      <div>
        <Image src={image} alt={title} width="176px" height="176px" />
        {title} | {artist} <br />
        <br />
        <p className="text-center">sorry no record found</p>
      </div>
    );
  }
  return (
    <>
      <Link href={`/disco/id=${encodeURIComponent(masterId)}`} passHref>
        <a target="_blank">
          <Image src={image} alt={title} width="176px" height="176px" />
          {title} | {artist} <br />
        </a>
      </Link>
    </>
  );
};

export default RecommendationCard;
