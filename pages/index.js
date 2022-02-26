import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>discospot</title>
        <meta name="description" content="discospot" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className="text-3xl font-bold">discospot</h1>
        <p>
          <Link href="/api/spot/login">
            <a>log in here</a>
          </Link>
          .
        </p>
      </main>
    </div>
  );
}
