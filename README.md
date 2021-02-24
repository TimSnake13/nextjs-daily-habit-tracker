## Features

- [ ] Calendar, maybe 5000 years?
  - [ ] Week view
  - [ ] Month view
- [ ] Habit tracking
  - [ ] Options for (Everyday, every X day, X day in a week/month/year)

Habits.tsx

At first I was using a single `data` (React.useState) to store all the habits' data

```
[
  {id, title, isOpen, isFinished, children}
]
```

But turns out, it was really difficult to update the `data` when I want to click to toggle `isFinished` using `setData(...)`. So Instead I split the data into two parts:

- `HabitRelation {id, children?}`: handle the relationship of all the habits
- `Habit {id, title, isOpen, isFinished}`: store all the habit info and can access/update by using id

Then I change the Data Structure it to store

```
class Habit {
  id: string;
  title: string;
  isOpen: boolean;
  isFinished: boolean;
  children?: Habit[];
}
```

And using a **recursion function** to loop through the children data to find the item with ID.
