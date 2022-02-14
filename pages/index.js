import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Link from "next/link";
// import useDisco from "../hooks/useDisco";
import getSellersList from "../utils/nodescraper";

export default function Home(data) {
  // const [discoData] = useDisco();
  return (
    <div className={styles.container}>
      <Head>
        <title>discospot_next</title>
        <meta name="description" content="discospot" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className="text-3xl font-bold underline">discospot</h1>
        <p>
          <Link href="/api/spot/login">
            <a>here</a>
          </Link>
          .
        </p>
      </main>
    </div>
  );
}
// find top 50 artitsts in collection
// export async function getServerSideProps() {
//   const data = await getSellersList(11987);
//   console.log(data);
//   return { props: { data: data } };
// }
