import SpotifyWebApi from "spotify-web-api-node";
import RecommendationCard from "../../../components/RecommendationCard";
import Head from "next/head";
import Link from "next/link";
import disconnect from "disconnect";
import getSellersList from "../../../utils/nodescraper";

export async function getServerSideProps(ctx) {
  const urlArray = ctx.query.params.split("=");
  const seed = urlArray[1].match(/^\w.+[^(&tk)]/)[0];
  const accessToken = urlArray[2].match(/^\w.+[^(&rtk)]/)[0];
  const refreshToken = urlArray[3].match(/^\w.+/)[0];
  const spotifyApi = new SpotifyWebApi({
    redirectUri:
      process.env.NEXT_PUBLIC_SPOTIFY_CALLBACK_URL ||
      "https://discospot-next.vercel.app/api/spot/callback",
    clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET,
    accessToken: accessToken,
    refreshToken: refreshToken,
  });

  const sevenTitles = await spotifyApi.getRecommendations({
    seed_artists: [seed],
    limit: 7,
  });
  // console.log("sevenTitles: ", sevenTitles.body.tracks);
  const discogsMasterIds = sevenTitles.body.tracks.map(async (track) => {
    try {
      const Discogs = disconnect.Client;
      const db = new Discogs({
        userToken: process.env.NEXT_PUBLIC_DISCO_ACCESS_TOKEN,
      }).database();
      const masterId = await db.search({
        release_title: track.album.name,
        artist: track.album.artists[0].name,
      });

      if (!masterId.results) {
        return null;
      }
      return {
        masterId: masterId.results[0].master_id || null,
        seed_artist_id: seed,
        id: track.album.id,
        artist: track.album.artists[0].name,
        title: track.album.name,
        image: track.album.images[0].url,
      };
    } catch (e) {
      console.error(e);
      return null;
    }
  });
  const masterIds = await Promise.all(discogsMasterIds);
  // console.log("masterIds: ", masterIds);
  const getSellersMap = masterIds.map(async (id) => {
    try {
      if (id && id.masterId) {
        const list = await getSellersList(id.masterId);
        const getMarket = list.slice(0, 3).map(async (id) => {
          // const url = `https://api.discogs.com/marketplace/listings/${id}`;
          // const headers = {
          //   headers: {
          //     Authorization: `Discogs token=${process.env.NEXT_PUBLIC_DISCO_ACCESS_TOKEN}`,
          //     "User-Agent": `"${process.env.NEXT_PUBLIC_DISCO_USER_AGENT}"`,
          //   },
          // };
          // const res = await fetch(url, headers);
          // const market = await res.json();
          // return market;
          const Discogs = disconnect.Client;
          const mkt = new Discogs({
            userToken: process.env.NEXT_PUBLIC_DISCO_ACCESS_TOKEN,
          }).marketplace();
          const market = await mkt.getListing(id);

          return {
            id: market.id,
            uri: market.uri || null,
            price: market.original_price.formatted || null,
            shipping_price: market.original_shipping_price.formatted || null,
            description: market.release.description || null,
            release_artist: market.release.artist || null,
            release_title: market.release.title || null,
            format: market.release.format || null,
            year: market.release.year || null,
            cat_num: market.release.catalog_number || null,
          };
        });
        const market = await Promise.all(getMarket);
        // console.log("market[0]: ", market[0]);
        return { ...id, sellers: list, market: market };
      } else {
        return null;
      }
    } catch (e) {
      console.error(e);
      return null;
    }
  });
  const sellers = await Promise.all(getSellersMap);
  // console.log("sellers: ", sellers);
  const propsObj = {};

  return { props: { data: sellers } };
}
const Page = ({ data }) => {
  console.log("data prop: ", data);
  return (
    <>
      <Head>
        <title>discospot</title>
        <meta name="description" content="discospot" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ul>
        {data.map((datum) => {
          if (!datum || !datum.sellers) {
            return <></>;
          } else {
            return (
              <li key={datum.masterId}>
                masterId: {datum.masterId} | artist: {datum.artist} | title:{" "}
                {datum.title} | <img src={datum.image} alt="thing" />{" "}
                <ul>
                  {datum.market.map((seller) => {
                    return (
                      <Link href={seller.uri} passHref>
                        <a>
                          <li>
                            seller: {seller.id} + {seller.description} | year:{" "}
                            {seller.year} | price: {seller.price} | shipping:{" "}
                            {seller.shipping_price}
                          </li>
                        </a>
                      </Link>
                    );
                  })}

                  {datum.sellers.length > 3 && (
                    <li>
                      ...and at least {datum.sellers.length - 3} more @
                      discogs...
                    </li>
                  )}
                </ul>{" "}
              </li>
            );
          }
        })}
      </ul>
    </>
  );
};
export default Page;
