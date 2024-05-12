import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoDetailsComponent } from './todo-details.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TodoService } from 'src/app/services/todo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Todo } from 'src/app/models/todo.model';
import { of, throwError } from 'rxjs';

describe('TodoDetailsComponent', () => {
  let component: TodoDetailsComponent;
  let fixture: ComponentFixture<TodoDetailsComponent>;
  let mockTodoService: jasmine.SpyObj<TodoService>;
  let mockActivatedRoute: any;
  let mockRouter: any;

  
  beforeEach(() => {
    mockTodoService = jasmine.createSpyObj('TodoService', ['get', 'update', 'delete']);
    mockActivatedRoute = { snapshot: { params: { id: 1 } } };
    mockRouter = { navigate: jasmine.createSpy('navigate') };

    TestBed.configureTestingModule({
      declarations: [TodoDetailsComponent],
      providers: [
        { provide: TodoService, useValue: mockTodoService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter }
      ],
      imports: [FormsModule,RouterTestingModule]
    }).compileComponents();
    
    fixture = TestBed.createComponent(TodoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getTodo if viewMode is false', () => {
      component.viewMode = false;
      spyOn(component, 'getTodo');
      component.ngOnInit();
      expect(component.getTodo).toHaveBeenCalled();
    });

    it('should not call getTodo if viewMode is true', () => {
      component.viewMode = true;
      spyOn(component, 'getTodo');
      component.ngOnInit();
      expect(component.getTodo).not.toHaveBeenCalled();
    });
  });

  describe('getTodo', () => {
    it('should set currentTodo when TodoService.get returns data', () => {
      const mockTodo: Todo = { id: 1, title: 'Test', description: 'Test', completed: false };
      mockTodoService.get.and.returnValue(of(mockTodo));
      component.getTodo(1);
      expect(component.currentTodo).toEqual(mockTodo);
    });

    it('should log error when TodoService.get encounters an error', () => {
      const errorMessage = 'Error fetching todo';
      mockTodoService.get.and.returnValue(throwError(errorMessage));
      spyOn(console, 'error');
      component.getTodo(1);
      expect(console.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('updatePublished', () => {
    it('should update published status and display message on success', () => {
      const status = true;
      const successMessage = 'The status was updated successfully!';
      mockTodoService.update.and.returnValue(of({ message: successMessage }));
      component.currentTodo = { id: 1, title: 'Test', description: 'Test', completed: false };
      component.updatePublished(status);
      expect(component.currentTodo.completed).toBe(status);
      expect(component.message).toBe(successMessage);
    });

  });

  describe('updateTodo', () => {
    it('should update todo and display message on success', () => {
      const successMessage = 'Todo updated successfully!';
      mockTodoService.update.and.returnValue(of({ message: successMessage }));
      component.currentTodo = { id: 1, title: 'Test', description: 'Test', completed: false };
      component.updateTodo();
      expect(component.message).toBe(successMessage);
    });

    it('should log error when updateTodo encounters an error', () => {
      const errorMessage = 'Error updating todo';
      mockTodoService.update.and.returnValue(throwError(errorMessage));
      spyOn(console, 'error');
      component.currentTodo = { id: 1, title: 'Test', description: 'Test', completed: false };
      component.updateTodo();
      expect(console.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('deleteTodo', () => {
    it('should delete todo and navigate to todo list on success', () => {
      mockTodoService.delete.and.returnValue(of({}));
      component.currentTodo = { id: 1, title: 'Test', description: 'Test', completed: false };
      component.deleteTodo();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/todo']);
    });

    it('should log error when deleteTodo encounters an error', () => {
      const errorMessage = 'Error deleting todo';
      mockTodoService.delete.and.returnValue(throwError(errorMessage));
      spyOn(console, 'error');
      component.currentTodo = { id: 1, title: 'Test', description: 'Test', completed: false };
      component.deleteTodo();
      expect(console.error).toHaveBeenCalledWith(errorMessage);
    });
  });
  
});
