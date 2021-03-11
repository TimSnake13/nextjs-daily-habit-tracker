import React, { useEffect, useRef, useState } from "react";
import { useSpring, animated } from "react-spring";
import { AiOutlineBorder, AiOutlineCheckSquare } from "react-icons/ai";
import { Habit, ContentToUpdate } from "./Habit";
import ProgressBar from "./ProgressBar";
import { CgAddR, CgCheckR } from "react-icons/cg";
import { TrackingData } from "../types";

// Useful for Doc?
// function searchChildAndUpdate(
//   searchHabitData: Habit,
//   id: string,
//   { newTitle, toggleIsOpen, toggleIsFinished, children }: ContentToUpdate
// ): Habit {
//   const newData = { ...searchHabitData };
//   if (searchHabitData.id !== id && searchHabitData.children) {
//     newData.children = searchHabitData.children.map((item) =>
//       item.id === id
//         ? {
//             ...item,
//             newTitle,
//             isOpen: toggleIsOpen ? !item.isOpen : item.isOpen,
//             isFinished: toggleIsFinished ? !item.isFinished : item.isFinished,
//             children,
//           }
//         : searchChildAndUpdate(item, id, {
//             newTitle,
//             toggleIsOpen: toggleIsOpen,
//             toggleIsFinished: toggleIsFinished,
//             children,
//           })
//     );
//   }
//   return newData;
// }

//TODO: Use hash to improve performance?
function findAllData(ids: string[], dataSet: Habit[]) {
  return dataSet.filter((item) => ids.indexOf(item.id) > -1);
}

interface Props {
  savedTrackingDataArray: TrackingData[];
  updateTrackingData: (newData: TrackingData) => void;
}

const Habits = ({ savedTrackingDataArray, updateTrackingData }: Props) => {
  const [data, setData] = useState<Habit[]>([]);

  useEffect(() => {
    console.table(data);
    const newTrackingData = new TrackingData();
    // FIXME: 第一天创建的时候，id = 0 ？
    updateTrackingData();
  }, [data]);

  /** Create new Habit to **data** state, return the new habit id */
  function newHabit(title: string) {
    const habit = new Habit(title);
    setData((s) => [...s, habit]);
    return habit.id;
  }
  // FIXME: using belongToID add to child works fine, but the render of the children is not working properly.
  // Maybe use 'resize-observer-polyfill':  https://codesandbox.io/embed/lp80n9z7v9
  // function newHabit(title: string, belongToID = "") {
  //   const habit = new Habit(title, belongToID);
  //   setData((s) => [...s, habit]);
  //   if (belongToID) {
  //     addChildToNode(habit.id, belongToID);
  //   }
  //   return habit.id;
  // }

  function handleUpdateData(
    id: string,
    {
      newTitle = "",
      toggleIsOpen = false,
      toggleIsFinished = false,
      addChildrenID = "",
      removeChildrenID = "",
    }: ContentToUpdate
  ) {
    setData((s) =>
      s.map((item) =>
        item.id === id
          ? {
              ...item,
              title: newTitle ? newTitle : item.title,
              isOpen: toggleIsOpen ? !item.isOpen : item.isOpen,
              isFinished: toggleIsFinished ? !item.isFinished : item.isFinished,
              childrenIDs: addChildrenID
                ? [...item.childrenIDs, addChildrenID]
                : removeChildrenID
                ? item.childrenIDs.filter((id) => id !== removeChildrenID)
                : item.childrenIDs,
            }
          : item
      )
    );
  }
  function toggleIsFinished(id: string) {
    handleUpdateData(id, { toggleIsFinished: true });
  }
  function toggleIsOpen(id: string) {
    handleUpdateData(id, { toggleIsOpen: true });
  }
  function addChildToNode(childID: string, targetId: string) {
    const [children] = findAllData([targetId], data).map((v) => v.childrenIDs);
    if (children?.indexOf(childID) > -1 === false) {
      // If don't already exist check
      handleUpdateData(targetId, { addChildrenID: childID });
    }
  }
  function updateTitle(id: string, newTitle: string) {
    handleUpdateData(id, { newTitle });
  }

  useEffect(() => {
    newHabit("30 mins guitar practices");
    newHabit("Running🏃 10km per day‍");
    newHabit("Swimming🏊‍♂️  30mins at least");
    // newHabit("400 meters * 5", swimmingID);
  }, []);

  const inputRef = useRef<HTMLInputElement>();

  return (
    <div className={"container px-16"}>
      <div className="flex items-center py-2">
        <CgCheckR />
        <p className="ml-4">我的习惯：</p>
      </div>
      <ProgressBar data={data} />
      {/* <button
        onClick={() => {
          handleUpdateData("5", { newTitle: "I will try" });
        }}
      >
        change state
      </button> */}

      {data.map(
        (item) =>
          !item.belongToID && ( // Skip render children node from root
            <TreeRender
              key={item.id}
              nodeData={item}
              allData={data}
              childrenNodes={
                item.childrenIDs && findAllData(item.childrenIDs, data)
              }
              toggleIsFinished={toggleIsFinished}
              toggleIsOpen={toggleIsOpen}
              updateTitle={updateTitle}
            ></TreeRender>
          )
      )}
      <div className="flex items-center py-2">
        <button
          // className="ml-4 border border-gray-900 px-2 py-1"
          className="cursor-pointer"
          onClick={() => {
            if (inputRef.current.value) newHabit(inputRef.current.value);
          }}
        >
          <CgAddR size={20} />
        </button>
        <input
          ref={inputRef}
          placeholder={"New habit"}
          className="ml-3"
        ></input>
      </div>
    </div>
  );
};

interface TreeProps {
  nodeData: Habit;
  isParentOpen?: boolean;
  childrenNodes?: Habit[];
  allData: Habit[];
  toggleIsFinished: any;
  toggleIsOpen: any;
  updateTitle: (id: string, newTitle: string) => void;
  children?: any;
}

const TreeRender = ({
  nodeData,
  isParentOpen = true,
  childrenNodes,
  allData,
  toggleIsFinished,
  toggleIsOpen,
  updateTitle,
}: TreeProps) => {
  return (
    <>
      <RecursionHabitNode
        key={nodeData.id}
        nodeData={nodeData}
        allData={allData}
        toggleIsFinished={toggleIsFinished}
        toggleIsOpen={toggleIsOpen}
        updateTitle={updateTitle}
        isParentOpen={isParentOpen}
      >
        {childrenNodes?.map((child) => (
          <div key={child.id} className="w-full flex items-center">
            <div className="w-6 h-1"></div>
            <TreeRender
              nodeData={child}
              childrenNodes={
                child.childrenIDs && findAllData(child.childrenIDs, allData)
              }
              allData={allData}
              toggleIsFinished={toggleIsFinished}
              toggleIsOpen={toggleIsOpen}
              updateTitle={updateTitle}
              isParentOpen={nodeData.isOpen}
            ></TreeRender>
          </div>
        ))}
      </RecursionHabitNode>
    </>
  );
};

const RecursionHabitNode = ({
  nodeData,
  isParentOpen = true,
  toggleIsFinished,
  toggleIsOpen,
  updateTitle,
  children,
}: TreeProps) => {
  const { id, title, isOpen, isFinished } = nodeData;
  const props = useSpring({
    from: {
      width: "100%",
      height: "0rem",
      opacity: 0,
      transform: "translateY(-20px)",
    },
    to: {
      width: "100%",
      height: isParentOpen ? "1.5rem" : "0rem",
      opacity: isParentOpen ? 1 : 0,
      transform: `translateY(${isParentOpen ? "0" : "-20"}px)`,
    },
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [titleValue, setTitleValue] = useState(title);
  let timeOutID;
  useEffect(() => {
    timeOutID = setTimeout(() => updateTitle(id, titleValue), 500);
    return () => {
      clearTimeout(timeOutID);
    };
  }, [titleValue]);

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      // If press enter, update title
      updateTitle(id, titleValue);
      setIsEditMode(false);
    }
  };
  return (
    <animated.div style={props}>
      <div
        className={
          "w-full flex items-center cursor-pointer " +
          (isParentOpen === false ? "pointer-events-none" : "")
        }
      >
        <div onClick={() => toggleIsFinished(nodeData.id)}>
          {isFinished ? <AiOutlineCheckSquare /> : <AiOutlineBorder />}{" "}
        </div>
        <div
          className={"ml-4 cursor-default w-full"}
          onClick={() => {
            if (children) toggleIsOpen(nodeData.id);
          }}
        >
          {isEditMode ? (
            <input
              className="w-full focus:outline-none"
              value={titleValue}
              onChange={(e) => {
                setTitleValue(e.target.value);
              }}
              onKeyPress={handleKeyPress}
            />
          ) : (
            <p
              className={
                nodeData.isFinished ? "line-through text-gray-200" : ""
              }
              onClick={() => {
                setIsEditMode(true);
              }}
            >
              {title}
            </p>
          )}
        </div>
      </div>
      {children}
    </animated.div>
  );
};

export default Habits;
