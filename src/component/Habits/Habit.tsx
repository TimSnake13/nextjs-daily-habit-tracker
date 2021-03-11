import { v4 as uuid } from "uuid";

export class Habit {
  id: string;
  title: string;
  isOpen: boolean;
  isFinished: boolean;
  childrenIDs: string[];
  belongToID: string;
  constructor(title: string, belongToID = "") {
    this.id = uuid();
    this.title = title;
    this.isOpen = false;
    this.isFinished = false;
    this.childrenIDs = [];
    this.belongToID = belongToID;
  }
}
export interface ContentToUpdate {
  newTitle?: string;
  toggleIsOpen?: boolean;
  toggleIsFinished?: boolean;
  addChildrenID?: string; // Limited one id per update operation
  removeChildrenID?: string;
}
