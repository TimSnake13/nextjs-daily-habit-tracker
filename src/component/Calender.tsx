import React, { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/Io";
import Habits from "./Habits";

const START_MONTH = 0;
const END_MONTH = 11;

const blockCssStyle =
  "flex h-10 w-14 font-bold justify-center content-center leading-4 rounded-full transition-background-color duration-200 ease-in-out text-grey-600 relative hover:bg-purple-400 hover:text-gray-100 ";
const selectedBlockCssStyle = "shadow-md bg-purple-400 text-gray-100 ";
const secondaryBlockCssStyle = "text-gray-400 ";
const centerCssStyle = "absolute top-1/2 transform -translate-y-1/2 ";
const btnCssStyle =
  "px-5 py-3 rounded-lg bg-indigo-400 hover:bg-indigo-500 text-gray-100";

const Calender = () => {
  const week = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const year = new Date().getFullYear();
  const monthIndex = new Date().getMonth(); // 0 base
  const date = new Date().getDate();
  const currentTime = {
    year,
    monthIndex,
    date,
  };
  const [selectedTime, setSelectedTime] = useState(currentTime);

  function getLastDateInMonth(year: number, monthIndex: number) {
    return new Date(year, monthIndex, 0).getDate();
  }

  function getPreviousMonthWithYear() {
    let previousM = selectedTime.monthIndex;
    let previousY = selectedTime.year;
    if (selectedTime.monthIndex === START_MONTH) {
      previousM = END_MONTH;
      previousY -= 1;
    } else previousM -= 1;
    return { year: previousY, monthIndex: previousM };
  }
  function getNextMonthWithYear() {
    let nextM = selectedTime.monthIndex;
    let nextY = selectedTime.year;
    if (selectedTime.monthIndex === END_MONTH) {
      nextM = START_MONTH;
      nextY += 1;
    } else nextM += 1;
    return { year: nextY, monthIndex: nextM };
  }

  // Example: new Date(2020, 0, 0) => Dec 31 2019
  function getPreviousMonthLastDay() {
    return getLastDateInMonth(selectedTime.year, selectedTime.monthIndex);
  }

  function monthDecrease(newDate?: number) {
    let date = selectedTime.date;
    if (newDate >= 0 && newDate <= 31) date = newDate;
    setSelectedTime((state) =>
      selectedTime.monthIndex === START_MONTH
        ? { ...state, year: state.year - 1, monthIndex: END_MONTH, date }
        : { ...state, monthIndex: state.monthIndex - 1, date }
    );
  }
  function monthIncrease(newDate?: number) {
    let date = selectedTime.date;
    if (newDate >= 0 && newDate <= 31) date = newDate;
    setSelectedTime((state) =>
      selectedTime.monthIndex === END_MONTH
        ? { ...state, year: state.year + 1, monthIndex: START_MONTH, date }
        : { ...state, monthIndex: state.monthIndex + 1, date }
    );
  }
  function yearDecrease() {
    // if (selectedTime.year === year) return; // if is current year, skip decrease
    setSelectedTime((state) => ({ ...state, year: state.year - 1 }));
  }
  function yearIncrease() {
    setSelectedTime((state) => ({ ...state, year: state.year + 1 }));
  }

  return (
    <div className="container mx-auto">
      <h1 className="font-black text-5xl font-mono">
        {`${selectedTime.year}/${selectedTime.monthIndex + 1}/${
          selectedTime.date
        }`}
      </h1>
      <div className="flex justify-items-center content-center">
        <Button
          onClick={() => {
            yearDecrease();
          }}
          // disabled={selectedTime.year === year}
        >
          <div className="flex">
            <IoIosArrowBack />
            <IoIosArrowBack />
          </div>
        </Button>
        <Button
          onClick={() => {
            monthDecrease();
          }}
          // disabled={selectedTime.year === year && selectedTime.month === 1}
        >
          <IoIosArrowBack />
        </Button>
        <Button
          onClick={() => {
            monthIncrease();
          }}
        >
          <IoIosArrowForward />
        </Button>
        <Button
          onClick={() => {
            yearIncrease();
          }}
        >
          <div className="flex">
            <IoIosArrowForward />
            <IoIosArrowForward />
          </div>
        </Button>
      </div>
      <Grid>
        {week &&
          week.map((day) => (
            <div
              key={day}
              // className={(day === "SUN" || day === "SAT") && "text-red-500"}
            >
              {day}
            </div>
          ))}
        {/* Previous month */}
        {[
          ...Array(
            new Date(selectedTime.year, selectedTime.monthIndex).getDay()
          ),
        ].map((_, idx) => {
          const currentMonthFirstDay = new Date(
            selectedTime.year,
            selectedTime.monthIndex
          ).getDay();
          const _thisDate =
            getPreviousMonthLastDay() - (currentMonthFirstDay - idx) + 1;
          return (
            <div
              key={"prev-" + idx}
              className={blockCssStyle + secondaryBlockCssStyle}
              onClick={() => monthDecrease(_thisDate)}
            >
              <p className={centerCssStyle}>{_thisDate}</p>
            </div>
          );
        })}
        {/* This month */}
        {[
          ...Array(
            getLastDateInMonth(
              getNextMonthWithYear().year,
              getNextMonthWithYear().monthIndex
            )
          ),
        ].map((_, idx) => (
          <div
            key={"num-" + idx}
            className={
              blockCssStyle +
              (selectedTime.date === idx + 1 && selectedBlockCssStyle)
            }
            onClick={() => setSelectedTime((s) => ({ ...s, date: idx + 1 }))}
          >
            <p className={centerCssStyle}>{idx + 1}</p>
          </div>
        ))}
        {/* Next month */}
        <NextMonthDays
          year={getNextMonthWithYear().year}
          month={getNextMonthWithYear().monthIndex}
          monthIncrease={monthIncrease}
        />
      </Grid>
      <div className="mt-10">
        <Habits />
      </div>
    </div>
  );
};

const NextMonthDays = ({ year, month, monthIncrease }) => {
  const array = [];
  const firstDay = new Date(year, month, 1).getDay();
  for (let i = 0; i < 7 - firstDay; i++) {
    array.push(i);
  }
  return (
    <>
      {array.map((_, idx) => {
        return (
          <div
            key={"next-" + idx}
            className={blockCssStyle + secondaryBlockCssStyle}
            onClick={() => monthIncrease(idx + 1)}
          >
            <p className={centerCssStyle}>{idx + 1}</p>
          </div>
        );
      })}
    </>
  );
};

const Button = ({
  children,
  onClick,
  disabled,
}: {
  children: any;
  onClick: any;
  disabled?: boolean;
}) => {
  return (
    <button className={btnCssStyle} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

const Grid = ({ children }) => {
  return (
    <button className="grid grid-cols-7 auto-rows-max gap-4 content-center max-w-2xl mx-auto px-5 cursor-default focus:outline-none mt-4">
      {children}
    </button>
  );
};

export default Calender;
