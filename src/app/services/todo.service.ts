import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { STATUS, Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  todos: Todo[]

  constructor(private http: HttpClient) {
    this.todos = [
      {
        id: 1,
        title: "Learn Beginners Node.js",
        description: "Level 1 Training ",
        status: STATUS.NEW
      },
      {
        id: 2,
        title: "Learn C#",
        description: "Level 1 Training ",
        status: STATUS.NEW
      },
      {
        id: 3,
        title: "Basic Java",
        description: "Level 1 Training ",
        status: STATUS.NEW
      },
      {
        id: 4,
        title: "Beginners Python",
        description: "Level 1 Training ",
        status: STATUS.NEW
      },

    ];
  }

  get(id: number): Observable<any> {
    return of(this.todos).pipe(
      // Use the map operator to transform the array into a single Todo object
      map(todos => todos.find(todo => todo.id == id))
    );
  }
  getAll(): Observable<Todo[]> {
    return of(this.todos);
  }
  create(data: any): Observable<any> {
    const newTodo: Todo = { ...data, id: this.todos.length + 1 };
    this.todos.push(newTodo);
    return of(newTodo);
  }
  update(id: any, data: any): Observable<any> {
    const index = this.todos.findIndex(todo => todo.id === id);
    if (index !== -1) {
      const updatedTodo: Todo = { ...this.todos[index], ...data };
      this.todos[index] = updatedTodo;
      return of(updatedTodo);
    } else {
      return of(null); // Return null if Todo with given id is not found
    }
  }

  delete(id: any): Observable<any> {
    console.log("deleting todo with id "+id);
    const index = this.todos.findIndex(todo => todo.id == id);
    if (index !== -1) {
      const deletedTodo = this.todos.splice(index, 1)[0];
      return of(deletedTodo); // Return the deleted Todo as an observable
    } else {
      return of(null); // Return null if Todo with given id is not found
    }
  }

  deleteAll(): Observable<any> {
    const deletedTodos = this.todos.slice(); // Make a copy of the array
    this.todos = []; // Clear the Todos array
    return of(deletedTodos);
  }

  findByTitle(title: any): Observable<Todo[]> {
    return of(this.todos).pipe(
      map((todoArray: Todo[]) => todoArray.filter(todo => todo.title?.includes(title))));
  }
}
