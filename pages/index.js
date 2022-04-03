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
        <>
          <Link href="/api/spot/login">
            <a>
              <h1 className="text-3xl font-bold">discospot</h1>
            </a>
          </Link>
          .
        </>
      </main>
    </div>
  );
}
