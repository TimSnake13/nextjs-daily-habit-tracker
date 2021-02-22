import React, { useEffect, useState } from "react";

const START_MONTH = 0;
const END_MONTH = 11;

const blockCssStyle =
  "flex h-10 w-14 justify-center content-center leading-4 rounded-md hover:bg-purple-400 hover:text-gray-100 ";
const selectedBlockCssStyle = "shadow-md bg-purple-400 font-bold text-gray-100";

const Calender = () => {
  const initialState = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const [week, setWeek] = useState(initialState);
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
      <div>
        <Button
          onClick={() => {
            yearDecrease();
          }}
          // disabled={selectedTime.year === year}
        >
          {"<<"}
        </Button>
        <Button
          onClick={() => {
            monthDecrease();
          }}
          // disabled={selectedTime.year === year && selectedTime.month === 1}
        >
          {"<"}
        </Button>
        <Button
          onClick={() => {
            monthIncrease();
          }}
        >
          {">"}
        </Button>
        <Button
          onClick={() => {
            yearIncrease();
          }}
        >
          {">>"}
        </Button>
      </div>
      <Grid>
        {week && week.map((day) => <div key={day}>{day}</div>)}
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
              className={blockCssStyle}
              onClick={() => monthDecrease(_thisDate)}
            >
              {_thisDate}
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
            {idx + 1}
          </div>
        ))}
        {/* Next month */}
        <NextMonthDays
          year={getNextMonthWithYear().year}
          month={getNextMonthWithYear().monthIndex}
          monthIncrease={monthIncrease}
        />
      </Grid>
    </div>
  );
};

const NextMonthDays = ({ year, month, monthIncrease }) => {
  const array = [];
  const firstDay = new Date(year, month, 1).getDay();
  // console.log(year, month, firstDay);
  for (let i = 0; i < 7 - firstDay; i++) {
    array.push(i);
  }
  return (
    <>
      {[...array].map((item, idx) => {
        return (
          <div
            key={"next-" + idx}
            className={blockCssStyle}
            onClick={() => monthIncrease(idx + 1)}
          >
            <label className="h-1">{idx + 1}</label>
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
    <button
      className="px-5 py-3 rounded-lg bg-indigo-400 hover:bg-indigo-500 text-gray-100"
      onClick={onClick}
      disabled={disabled}
    >
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
