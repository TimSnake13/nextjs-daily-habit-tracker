import Head from "next/head";
import React, { useState } from "react";
import Calender from "../src/component/Calender";
import Habits from "../src/component/Habits";
import { TrackingData } from "../src/component/types";

export default function Home() {
  const [savedTrackingDataArray, setSavedTrackingDataArray] = useState<
    TrackingData[]
  >([]);

  const updateTrackingData = (newData: TrackingData) => {
    setSavedTrackingDataArray(
      savedTrackingDataArray.map((data) =>
        data.id === newData.id ? newData : data
      )
    );
  };

  return (
    <div>
      <Head>
        <title>Daily Habit Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Calender savedTrackingDataArray={savedTrackingDataArray} />
        <div className="mt-10">
          <Habits
            savedTrackingDataArray={savedTrackingDataArray}
            updateTrackingData={updateTrackingData}
          />
        </div>
      </main>

      <footer></footer>
    </div>
  );
}
