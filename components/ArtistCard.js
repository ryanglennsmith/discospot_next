import React from "react";
import Link from "next/link";

const ArtistCard = ({ image, artist, artistId, accessToken, refreshToken }) => {
  return (
    <Link
      key={`${artistId}nextLink`}
      href={`/spot/recommend/sd=${artistId}&tk=${accessToken}&rtk=${refreshToken}`}
      passHref
    >
      <a key={`${artistId}aTag`}>
        <div
          className="border-2 m-3 p-2 shadow-lg shadow-slate-700 rounded-sm flex flex-col flex-wrap justify-evenly"
          key={`${artistId}topDiv`}
        >
          <div className="w-48 h-72" key={`${artistId}innerDiv`}>
            <img src={image} alt={artistId} key={`${artistId}img`} />

            {artist}
          </div>
        </div>
      </a>
    </Link>
  );
};

export default ArtistCard;
