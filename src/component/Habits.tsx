import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import { AiOutlineBorder, AiOutlineCheckSquare } from "react-icons/ai";

class HabitData {
  title: string;
  isOpen: boolean;
  isFinished: boolean;
  children?: HabitData[];
  constructor(title: string) {
    this.title = title;
    this.isOpen = true;
    this.isFinished = false;
  }
}

const Habits = () => {
  const d1 = new HabitData("Running🏃‍ once per day");
  return (
    <>
      <HabitNode data={d1}></HabitNode>
    </>
  );
};

interface Props {
  data: HabitData;
}

const HabitNode = ({ data }: Props) => {
  const { title, isOpen, isFinished } = data;

  const viewHeight = 500;
  const props = useSpring({
    from: { height: "0%", opacity: 0, transform: "translate3d(20px,0,0)" },
    to: {
      height: isOpen ? "100%" : 0,
      opacity: isOpen ? 1 : 0,
      transform: `translate3d(${isOpen ? 0 : 20}px,0,0)`,
    },
  });
  return (
    <animated.div style={props}>
      <div className="flex items-center">
        {isFinished ? <AiOutlineCheckSquare /> : <AiOutlineBorder />}{" "}
        <p className="ml-2">{title}</p>
      </div>

      {isOpen && data.children?.map((child) => <HabitNode data={child} />)}
    </animated.div>
  );
};

export default Habits;
