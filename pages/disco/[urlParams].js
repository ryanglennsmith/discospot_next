import React from "react";
import getSellersList from "../../utils/nodescraper";
import RecordCard from "../../components/RecordCard";
const DiscoSellers = ({ discoData }) => {
  if (discoData.error !== undefined) {
    return <div>{discoData.error}</div>;
  }
  return (
    <div>
      <p>sellers</p>
      <div className="flex justify-center flex-wrap">
        {discoData.map((album, index) => {
          return (
            <div
              key={index}
              className="w-44 h-80 border border-red-600 m-2 p-2 overflow-auto"
            >
              <RecordCard
                disco={{
                  price: album.price,
                  shippingPrice: album.shipping_price,
                  source: album.ships_from,
                  url: album.url,
                  comments: album.comments,
                  thumb: album.thumb,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DiscoSellers;
export async function getServerSideProps(ctx) {
  const masterId = ctx.query.urlParams.split("=")[1];
  const data = await getSellersList(masterId);
  try {
    const promises = data.map(async (albumId) => {
      const url = `https://api.discogs.com/marketplace/listings/${albumId}`;
      const headers = {
        headers: {
          Authorization: `Discogs token=${process.env.NEXT_PUBLIC_DISCO_ACCESS_TOKEN}`,
          "User-Agent": `"${process.env.NEXT_PUBLIC_DISCO_USER_AGENT}"`,
        },
      };
      const res = await fetch(url, headers);
      const data = await res.json();
      const responseHeaders = await res.headers;
      console.log("response headers:", responseHeaders);
      return data;
    });

    const discoData = await Promise.all(promises);
    const discoPayload = discoData.map((album) => {
      return {
        price: album.original_price.formatted || null,
        ships_from: album.ships_from || null,
        url: album.uri || null,
        shipping_price: album.original_shipping_price.formatted || null,
        comments: album.comments || null,
        thumb: album.release.thumbnail || null,
      };
    });
    return { props: { discoData: discoPayload } };
  } catch (err) {
    console.error(err);
    const discoPayload = { error: "something went wrong" };
    return { props: { discoData: discoPayload } };
  }
}
