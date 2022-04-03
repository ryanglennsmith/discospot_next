import SpotifyWebApi from "spotify-web-api-node";
import Head from "next/head";
import disconnect from "disconnect";
import getSellersList from "../../../utils/nodescraper";
import RecordCard from "../../../components/RecordCard";

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
  const getSellersMap = masterIds.map(async (id) => {
    try {
      if (id && id.masterId) {
        const list = await getSellersList(id.masterId);
        const getMarket = list.slice(0, 3).map(async (id) => {
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
  return { props: { data: sellers } };
}
const Page = ({ data }) => {
  return (
    <>
      <Head>
        <title>discospot</title>
        <meta name="description" content="discospot" />
        <link rel="icon" href="/favicon.ico" />
      </Head>{" "}
      <div className="m-auto flex flex-col justify-center align-middle ">
        <div className="flex m-auto p-1 justify-center w-4/5 flex-wrap ">
          {data.map((album) => {
            if (!album || !album.sellers) {
              return <></>;
            } else {
              return (
                <>
                  <RecordCard
                    key={`${album.masterId}cardComp`}
                    masterId={album.masterId}
                    artist={album.artist}
                    title={album.title}
                    image={album.image}
                    market={album.market}
                    sellers={album.sellers}
                  ></RecordCard>
                </>
              );
            }
          })}
        </div>
      </div>
    </>
  );
};
export default Page;
