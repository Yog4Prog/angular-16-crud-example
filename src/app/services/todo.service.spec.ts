import { TestBed } from '@angular/core/testing';

import { TodoService } from './todo.service';
import { STATUS, Todo } from '../models/todo.model';

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a specific todo by id', () => {
    const id = 1;
    const expectedTodo: Todo = {
      id: 1,
      title: "Learn Beginners Node.js",
      description: "Level 1 Training ",
      status: STATUS.NEW
    };

    service.get(id).subscribe(todo => {
      expect(todo).toEqual(expectedTodo);
    });
  });

  it('should return all todos', () => {
    service.getAll().subscribe(todos => {
      expect(todos.length).toBeGreaterThan(0);
    });
  });

  it('should create a new todo', () => {
    const newTodoData = {
      title: 'New Todo',
      description: 'New Todo Description',
      status: STATUS.NEW
    };

    service.create(newTodoData).subscribe(newTodo => {
      expect(newTodo.id).toBeDefined();
      expect(newTodo.title).toBe(newTodoData.title);
      expect(newTodo.description).toBe(newTodoData.description);
      expect(newTodo.status).toBe(newTodoData.status);
    });
  });

  it('should update an existing todo', () => {
    const id = 1;
    const updatedData = {
      title: 'Updated Title',
      description: 'Updated Description',
      status: STATUS.IN_PROGRESS
    };

    service.update(id, updatedData).subscribe(updatedTodo => {
      expect(updatedTodo.id).toBe(id);
      expect(updatedTodo.title).toBe(updatedData.title);
      expect(updatedTodo.description).toBe(updatedData.description);
      expect(updatedTodo.status).toBe(updatedData.status);
    });
  });
  
  it('should delete a todo by id', () => {
    const id = 1;

    service.delete(id).subscribe(deletedTodo => {
      expect(deletedTodo.id).toBe(id);
    });
  });

  it('should delete all todos', () => {
    service.deleteAll().subscribe(deletedTodos => {
      expect(deletedTodos.length).toBeGreaterThan(0);
    });
  });

  it('should find todos by title', () => {
    const title = 'Beginners';

    service.findByTitle(title).subscribe(foundTodos => {
      expect(foundTodos.length).toBeGreaterThan(0);
      foundTodos.forEach(todo => {
        expect(todo.title).toContain(title);
      });
    });
  });


});
