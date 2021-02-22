import Head from "next/head";
import Calender from "../src/component/Calender";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Daily Habit Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Calender />
      </main>

      <footer></footer>
    </div>
  );
}
