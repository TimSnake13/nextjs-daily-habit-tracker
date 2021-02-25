import Head from "next/head";
import React from "react";
import Calender from "../src/component/Calender";
import Habits from "../src/component/Habits";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Daily Habit Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Calender />
        <div className="mt-10">
          <Habits />
        </div>
      </main>

      <footer></footer>
    </div>
  );
}
