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

interface ContentToUpdate {
  newTitle?: string;
  toggleIsOpen?: boolean;
  toggleIsFinished?: boolean;
  children?: Habit[];
}

function searchChildAndUpdate(
  searchHabitData: Habit,
  id: string,
  { newTitle, toggleIsOpen, toggleIsFinished, children }: ContentToUpdate
): Habit {
  const newData = { ...searchHabitData };
  if (searchHabitData.id !== id && searchHabitData.children) {
    newData.children = searchHabitData.children.map((item) =>
      item.id === id
        ? {
            ...item,
            newTitle,
            isOpen: toggleIsOpen ? !item.isOpen : item.isOpen,
            isFinished: toggleIsFinished ? !item.isFinished : item.isFinished,
            children,
          }
        : searchChildAndUpdate(item, id, {
            newTitle,
            toggleIsOpen: toggleIsOpen,
            toggleIsFinished: toggleIsFinished,
            children,
          })
    );
  }
  return newData;
}

const Habits = () => {
  const [data, setData] = useState<Habit[]>([]);
  // const [data, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    console.table(data);
  }, [data]);

  function handleUpdateData(
    id: string,
    { newTitle, toggleIsOpen, toggleIsFinished, children }: ContentToUpdate
  ) {
    // TODO: improve performance
    setData((s) =>
      s.map((item) =>
        searchChildAndUpdate(item, id, {
          newTitle,
          toggleIsOpen,
          toggleIsFinished,
          children,
        })
      )
    );
  }

  function newHabit(title: string, belongToID?: string) {
    const habit = new Habit(title);
    if (belongToID) {
      // TODO: how to insert habit into children
      // handleUpdateData(belongToID);
    } else {
      setData((s) => [...s, habit]);
    }
    return habit.id;
  }

  function toggleIsFinished(id: string) {
    handleUpdateData(id, { toggleIsFinished: true });
  }

  useEffect(() => {
    newHabit("30 mins guitar practices");
    const exerciseID = newHabit("Exercise");
    // newHabit("Running🏃 10km per day‍", exerciseID);
    // newHabit("Swimming🏊‍♂️ 400m at least", exerciseID);
    newHabit("Running🏃 10km per day‍");
    newHabit("Swimming🏊‍♂️ 400m at least");
  }, []);

  return (
    <>
      <button
        onClick={() => {
          handleUpdateData("5", { newTitle: "I will try" });
        }}
      >
        change state
      </button>
      {data.map((item) => (
        <RecursionHabitNode
          key={item.id}
          data={item}
          toggleIsFinished={toggleIsFinished}
        ></RecursionHabitNode>
      ))}
    </>
  );
};

interface Props {
  data: Habit;
  toggleIsFinished: any;
}

const RecursionHabitNode = ({ data, toggleIsFinished }: Props) => {
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
      <div
        className="flex items-center cursor-pointer"
        onClick={() => toggleIsFinished(data.id)}
      >
        {isFinished ? <AiOutlineCheckSquare /> : <AiOutlineBorder />}{" "}
        <p className="ml-2">{title}</p>
      </div>

      {isOpen &&
        data.children?.map((child) => (
          <div className="flex items-center">
            <div className="w-6"></div>
            <RecursionHabitNode
              data={child}
              toggleIsFinished={toggleIsFinished}
            />
          </div>
        ))}
    </animated.div>
  );
};

export default Habits;
