import React from "react";
import Link from "next/link";

const RecordCard = ({ masterId, artist, title, image, market, sellers }) => {
  return (
    <>
      <div
        className="border-2 m-3 p-2 shadow-lg shadow-slate-700 rounded-sm flex flex-wrap"
        key={`${masterId}topDiv`}
      >
        <div className="w-48 h-100" key={`${masterId}innerDiv`}>
          <img src={image} alt={masterId} key={`${masterId}img`} />
          <ul>
            {market.map((seller) => {
              return (
                <>
                  <a href={seller.uri} target="_blank">
                    <li>{seller.description}</li>
                    <li>year: {seller.year}</li>
                    <li>
                      price: {seller.price} | shipping: {seller.shipping_price}
                    </li>
                  </a>
                  <hr />
                </>
              );
            })}

            {sellers.length > 3 && (
              <li>
                ...and at least {sellers.length - 3}{" "}
                <a
                  href={`https://www.discogs.com/sell/list?master_id=${masterId}&format=Vinyl`}
                  target="_blank"
                >
                  more @ discogs
                </a>
                ...
              </li>
            )}
          </ul>{" "}
        </div>
      </div>
    </>
  );
};

export default RecordCard;
