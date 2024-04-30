export class Todo {
  id?: number;
  title?: string;
  description?: string;
  completed?: boolean;
  status?: STATUS
}
export enum STATUS {
  NEW,
  IN_PROGRESS,
  COMPLETED,
  CANCELLED   
}