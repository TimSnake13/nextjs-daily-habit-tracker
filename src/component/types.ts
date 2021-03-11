interface HabitData {
  id: string;
  isFinished: boolean;
}
export class TrackingData {
  id: number;
  year: number;
  monthIndex: number;
  date: number;
  habitsData: HabitData[];
  percentage: number;
  constructor(
    id: number,
    year: number,
    monthIndex: number,
    date: number,
    habitsData: HabitData[],
    percentage = 0
  ) {
    this.id = id;
    this.year = year;
    this.monthIndex = monthIndex;
    this.date = date;
    this.habitsData = habitsData;
    this.percentage = percentage;
  }
}
