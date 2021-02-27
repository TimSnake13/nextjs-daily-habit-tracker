import React from "react";
import { Interface } from "readline";
import { Habit } from "./Habit";

interface Props {
  data: Habit[];
}

const ProgressBar = ({ data }: Props) => {
  let finishedTasks = 0;
  let unFinishedTasks = 0;
  data.map((item) => (item.isFinished ? finishedTasks++ : unFinishedTasks++));
  const percentage = (finishedTasks / data.length) * 100;
  const progressBarStyle = {
    height: 0.25 + "rem",
    width: percentage + "%",
  };
  return (
    <div className="bg-indigo-100 mb-2">
      <div className="bg-indigo-300" style={progressBarStyle}></div>
    </div>
  );
};

export default ProgressBar;
