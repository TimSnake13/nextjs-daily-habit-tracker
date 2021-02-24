import React, { useEffect, useReducer, useState } from "react";
import { useSpring, animated } from "react-spring";
import { AiOutlineBorder, AiOutlineCheckSquare } from "react-icons/ai";
import { v4 as uuid } from "uuid";

class Habit {
  id: string;
  title: string;
  isOpen: boolean;
  isFinished: boolean;
  children?: Habit[];
  constructor(title: string) {
    this.id = uuid();
    this.title = title;
    this.isOpen = true;
    this.isFinished = false;
  }
}

enum ActionType {
  ChangeTitle,
  ToggleOpen,
  ToggleIsFinished,
  ChangeChildren,
}

interface Payload {
  id: string;
}

interface Action {
  type: ActionType;
  payload: Payload;
}

const reducer = (state, action: Action) => {
  switch (action.type) {
    case ActionType.ToggleOpen:
      return {};
  }
};

const initialState = [] as Habit[];

function searchChildAndUpdate(
  searchHabitData: Habit,
  id: string,
  title?: string,
  isOpen?: boolean,
  isFinished?: boolean,
  children?: Habit[]
): Habit {
  const newData = { ...searchHabitData };
  if (searchHabitData.id !== id && searchHabitData.children) {
    newData.children = searchHabitData.children.map((item) =>
      item.id === id
        ? { ...item, title, isOpen, isFinished, children }
        : searchChildAndUpdate(item, id, title, isOpen, isFinished, children)
    );
  }
  return newData;
}

const Habits = () => {
  const [data, setData] = useState<Habit[]>([]);
  // const [data, dispatch] = useReducer(reducer, initialState)

  function handleUpdateData(
    id: string,
    title?: string,
    isOpen?: boolean,
    isFinished?: boolean,
    children?: Habit[]
  ) {
    setData((s) =>
      s.map((item) =>
        searchChildAndUpdate(item, id, title, isOpen, isFinished, children)
      )
    );
  }

  function newHabit(title: string, belongToID?: string) {
    const habit = new Habit(title);
    if (belongToID) {
      handleUpdateData(belongToID);
    } else {
      setData((s) => [...s, habit]);
    }
    return habit.id;
  }

  useEffect(() => {
    newHabit("30 mins guitar practices");
    const exerciseID = newHabit("Exercise");
    newHabit("Running🏃 10km per day‍", exerciseID);
    newHabit("Swimming🏊‍♂️ 400m at least", exerciseID);
  }, []);

  return (
    <>
      <button
        onClick={() => {
          handleUpdateData("5", "I will try");
        }}
      >
        change state
      </button>
      {data.map((_, idx) => (
        <RecursionHabitNode
          key={data[idx].id}
          data={data[idx]}
        ></RecursionHabitNode>
      ))}
    </>
  );
};

interface Props {
  data: Habit;
}

const RecursionHabitNode = ({ data }: Props) => {
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

      {/* {isOpen &&
        data.children?.map((child) => (
          <div className="flex items-center">
            <div className="w-6"></div>
            <RecursionHabitNode data={child} setData={setData} />
          </div>
        ))} */}
    </animated.div>
  );
};

export default Habits;
