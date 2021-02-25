import React, {
  HTMLAttributes,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { useSpring, animated } from "react-spring";
import { AiOutlineBorder, AiOutlineCheckSquare } from "react-icons/ai";
import { v4 as uuid } from "uuid";

class Habit {
  id: string;
  title: string;
  isOpen: boolean;
  isFinished: boolean;
  childrenIDs: string[];
  belongToID: string;
  constructor(title: string, belongToID = "") {
    this.id = uuid();
    this.title = title;
    this.isOpen = true;
    this.isFinished = false;
    this.childrenIDs = [];
    this.belongToID = belongToID;
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

const initialState = [] as Habit[];

interface ContentToUpdate {
  newTitle?: string;
  toggleIsOpen?: boolean;
  toggleIsFinished?: boolean;
  addChildrenID?: string; // Limited one id per update operation
  removeChildrenID?: string;
}

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

const Habits = () => {
  const [data, setData] = useState<Habit[]>([]);

  useEffect(() => {
    console.table(data);
  }, [data]);

  /** Create new Habit to data state, return the new habit id */
  function newHabit(title: string, belongToID = "") {
    const habit = new Habit(title, belongToID);
    setData((s) => [...s, habit]);
    if (belongToID) {
      addChildToNode(habit.id, belongToID);
    }
    return habit.id;
  }

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

  useEffect(() => {
    newHabit("30 mins guitar practices");
    const exerciseID = newHabit("Exercise");
    newHabit("Running🏃 10km per day‍", exerciseID);
    const swimmingID = newHabit("Swimming🏊‍♂️  30mins at least", exerciseID);
    newHabit("400 meters * 5", swimmingID);
  }, []);

  const inputRef = useRef<HTMLInputElement>();

  return (
    <>
      {/* <button
        onClick={() => {
          handleUpdateData("5", { newTitle: "I will try" });
        }}
      >
        change state
      </button> */}
      <input ref={inputRef} placeholder={"New habit"}></input>
      <button
        onClick={() => {
          newHabit(inputRef.current.value);
        }}
      >
        New Habit
      </button>
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
              // Do a search and send all the children down to this component?
            ></TreeRender>
          )
      )}
    </>
  );
};

interface Props {
  nodeData: Habit;
  isParentOpen?: boolean;
  childrenNodes?: Habit[];
  allData: Habit[];
  toggleIsFinished: any;
  toggleIsOpen: any;
  children?: any;
}

const TreeRender = ({
  nodeData,
  isParentOpen = true,
  childrenNodes,
  allData,
  toggleIsFinished,
  toggleIsOpen,
}: Props) => {
  return (
    <>
      <RecursionHabitNode
        key={nodeData.id}
        nodeData={nodeData}
        allData={allData}
        toggleIsFinished={toggleIsFinished}
        toggleIsOpen={toggleIsOpen}
        isParentOpen={isParentOpen}
      >
        {childrenNodes?.map((child) => (
          <div key={child.id} className="flex items-center">
            <div className="w-6 h-1"></div>
            <TreeRender
              nodeData={child}
              childrenNodes={
                child.childrenIDs && findAllData(child.childrenIDs, allData)
              }
              allData={allData}
              toggleIsFinished={toggleIsFinished}
              toggleIsOpen={toggleIsOpen}
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
  children,
}: Props) => {
  const { title, isOpen, isFinished } = nodeData;
  const props = useSpring({
    from: { height: "0rem", opacity: 0, transform: "translateY(-20px)" },
    to: {
      height: isParentOpen ? "1.25rem" : "0rem",
      opacity: isParentOpen ? 1 : 0,
      transform: `translateY(${isParentOpen ? "0" : "-20"}px)`,
    },
  });

  return (
    <animated.div style={props}>
      <div
        className={
          "flex items-center cursor-pointer " +
          (isParentOpen === false ? "pointer-events-none" : "")
        }
      >
        <div onClick={() => toggleIsFinished(nodeData.id)}>
          {isFinished ? <AiOutlineCheckSquare /> : <AiOutlineBorder />}{" "}
        </div>
        <p
          className={"ml-2 cursor-default"}
          onClick={() => {
            if (children) toggleIsOpen(nodeData.id);
          }}
        >
          {title}
        </p>
      </div>
      {children}
    </animated.div>
  );
};

export default Habits;
