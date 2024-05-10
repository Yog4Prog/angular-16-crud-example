import { Component, OnInit } from '@angular/core';
import { Todo } from 'src/app/models/todo.model';
import { TodoService } from 'src/app/services/todo.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent {
  todos?: Todo[];
  currentTodo: Todo = {};
  currentIndex = -1;
  title = '';

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.retrieveTodos();
  }

  retrieveTodos(): void {
    this.todoService.getAll().subscribe({
      next: (data) => {
        this.todos = data;
        console.log(data);
      },
      error: (e) => console.error(e)
    });
  }

  refreshList(): void {
    this.retrieveTodos();
    this.currentTodo = {};
    this.currentIndex = -1;
  }

  setActiveTodo(Todo: Todo, index: number): void {
    this.currentTodo = Todo;
    this.currentIndex = index;
  }

  removeAllTodo(): void {
    this.todoService.deleteAll().subscribe({
      next: (res) => {
        console.log(res);
        this.refreshList();
      },
      error: (e) => console.error(e)
    });
  }

  editTodo(Todo: Todo, index: number): void {
    this.currentTodo = Todo;
    this.currentIndex = index;
  }
  toggleTodoCompletion(Todo: Todo, index: number): void {
    this.currentTodo = Todo;
    this.currentIndex = index;
    this.currentTodo.completed = !this.currentTodo.completed;
  }
  removeTodo(id: number|undefined): void {
    this.todoService.delete(id).subscribe({
      next: (res) => {
        console.log(res);
        this.refreshList();
      },
      error: (e) => console.error(e)
    });
  }

  searchTitle(): void {
    this.currentTodo = {};
    this.currentIndex = -1;

    this.todoService.findByTitle(this.title).subscribe({
      next: (data) => {
        this.todos = data;
        console.log(data);
      },
      error: (e) => console.error(e)
    });
  }
}
