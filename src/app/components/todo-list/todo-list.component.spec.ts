import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoListComponent } from './todo-list.component';
import { FormsModule } from '@angular/forms';
import { TodoDetailsComponent } from '../todo-details/todo-details.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TodoService } from 'src/app/services/todo.service';
import { of, throwError } from 'rxjs';
import { Todo } from 'src/app/models/todo.model';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  let mockTodoService: jasmine.SpyObj<TodoService>;

  beforeEach(() => {
    mockTodoService = jasmine.createSpyObj('TodoService', ['getAll', 'deleteAll', 'delete', 'findByTitle']);

    TestBed.configureTestingModule({
      declarations: [TodoListComponent, TodoDetailsComponent],
      imports: [FormsModule,RouterTestingModule],
      providers: [{ provide: TodoService, useValue: mockTodoService }]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('retrieveTodos', () => {
    it('should retrieve todos from TodoService', () => {
      const mockTodos: Todo[] = [
        { id: 1, title: 'Todo 1', description: 'Description 1', completed: false },
        { id: 2, title: 'Todo 2', description: 'Description 2', completed: true }
      ];
      mockTodoService.getAll.and.returnValue(of(mockTodos));

      component.retrieveTodos();

      expect(component.todos).toEqual(mockTodos);
    });

    it('should log error when TodoService.getAll encounters an error', () => {
      const errorMessage = 'Error fetching todos';
      mockTodoService.getAll.and.returnValue(throwError(errorMessage));
      spyOn(console, 'error');

      component.retrieveTodos();

      expect(console.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('refreshList', () => {
    it('should call retrieveTodos and reset currentTodo and currentIndex', () => {
      spyOn(component, 'retrieveTodos');

      component.currentTodo = { id: 1, title: 'Test', description: 'Test', completed: false };
      component.currentIndex = 1;

      component.refreshList();

      expect(component.retrieveTodos).toHaveBeenCalled();
      expect(component.currentTodo).toEqual({});
      expect(component.currentIndex).toBe(-1);
    });
  });

  describe('setActiveTodo', () => {
    it('should set currentTodo and currentIndex', () => {
      const mockTodo: Todo = { id: 1, title: 'Test', description: 'Test', completed: false };
      const mockIndex = 1;

      component.setActiveTodo(mockTodo, mockIndex);

      expect(component.currentTodo).toEqual(mockTodo);
      expect(component.currentIndex).toEqual(mockIndex);
    });
  });

  describe('removeAllTodo', () => {
    it('should delete all todos and call refreshList', () => {
      spyOn(component, 'refreshList');
      mockTodoService.deleteAll.and.returnValue(of({}));

      component.removeAllTodo();

      expect(mockTodoService.deleteAll).toHaveBeenCalled();
      expect(component.refreshList).toHaveBeenCalled();
    });

    it('should log error when TodoService.deleteAll encounters an error', () => {
      const errorMessage = 'Error deleting all todos';
      mockTodoService.deleteAll.and.returnValue(throwError(errorMessage));
      spyOn(console, 'error');

      component.removeAllTodo();

      expect(console.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('editTodo', () => {
    it('should set currentTodo and currentIndex', () => {
      const mockTodo: Todo = { id: 1, title: 'Test', description: 'Test', completed: false };
      const mockIndex = 1;

      component.editTodo(mockTodo, mockIndex);

      expect(component.currentTodo).toEqual(mockTodo);
      expect(component.currentIndex).toEqual(mockIndex);
    });

    describe('toggleTodoCompletion', () => {
      it('should toggle completion status of currentTodo', () => {
        const mockTodo: Todo = { id: 1, title: 'Test', description: 'Test', completed: false };
        component.currentTodo = mockTodo;
  
        component.toggleTodoCompletion(mockTodo,1);
  
        expect(component.currentTodo.completed).toBeTrue();
      });
    });
  
    describe('removeTodo', () => {
      it('should delete todo and call refreshList', () => {
        const mockTodoId = 1;
        spyOn(component, 'refreshList');
        mockTodoService.delete.and.returnValue(of({}));
  
        component.removeTodo(mockTodoId);
  
        expect(mockTodoService.delete).toHaveBeenCalledWith(mockTodoId);
        expect(component.refreshList).toHaveBeenCalled();
      });
  
      it('should log error when TodoService.delete encounters an error', () => {
        const mockTodoId = 1;
        const errorMessage = 'Error deleting todo';
        mockTodoService.delete.and.returnValue(throwError(errorMessage));
        spyOn(console, 'error');
  
        component.removeTodo(mockTodoId);
  
        expect(console.error).toHaveBeenCalledWith(errorMessage);
      });
    });
  
    describe('searchTitle', () => {
      it('should search todos by title and set currentTodo and currentIndex', () => {
        const mockTitle = 'Test';
        const mockTodos: Todo[] = [
          { id: 1, title: 'Test 1', description: 'Description 1', completed: false },
          { id: 2, title: 'Test 2', description: 'Description 2', completed: true }
        ];
        mockTodoService.findByTitle.and.returnValue(of(mockTodos));
  
        component.title = mockTitle;
        component.searchTitle();
  
        expect(component.todos).toEqual(mockTodos);
        expect(component.currentTodo).toEqual({});
        expect(component.currentIndex).toBe(-1);
      });
  
      it('should log error when TodoService.findByTitle encounters an error', () => {
        const mockTitle = 'Test';
        const errorMessage = 'Error searching todos by title';
        mockTodoService.findByTitle.and.returnValue(throwError(errorMessage));
        spyOn(console, 'error');
  
        component.title = mockTitle;
        component.searchTitle();
  
        expect(console.error).toHaveBeenCalledWith(errorMessage);
      });
    });

  });
  
});
