import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTodoComponent } from './add-todo.component';
import { FormsModule } from '@angular/forms';
import { TodoService } from 'src/app/services/todo.service';
import { of, throwError } from 'rxjs';

describe('AddTodoComponent', () => {
  let component: AddTodoComponent;
  let fixture: ComponentFixture<AddTodoComponent>;
  let mockTodoService: jasmine.SpyObj<TodoService>;

  beforeEach(() => {
    mockTodoService = jasmine.createSpyObj('TodoService', ['create']);
    
    TestBed.configureTestingModule({
      declarations: [AddTodoComponent],
      imports: [FormsModule],
      providers: [{ provide: TodoService, useValue: mockTodoService }]
    }).compileComponents();

    fixture = TestBed.createComponent(AddTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call TodoService.create when saveTodo is called', () => {
    const todoData = {
      title: 'Test Todo',
      description: 'Test Description'
    };
    mockTodoService.create.and.returnValue(of(todoData));

    component.todo.title = todoData.title;
    component.todo.description = todoData.description;

    component.saveTodo();

    expect(mockTodoService.create).toHaveBeenCalledWith(todoData);
    expect(component.submitted).toBeTrue();
  });

  it('should log error when saveTodo encounters an error', () => {
    const errorMessage = 'Error creating todo';
    mockTodoService.create.and.returnValue(throwError(errorMessage));
    spyOn(console, 'error');

    component.saveTodo();

    expect(console.error).toHaveBeenCalledWith(errorMessage);
  });

  it('should reset todo and submitted status when newTodo is called', () => {
    component.submitted = true;
    component.todo = {
      title: 'Test Todo',
      description: 'Test Description',
      completed: false
    };

    component.newTodo();

    expect(component.submitted).toBeFalse();
    expect(component.todo.title).toBe('');
    expect(component.todo.description).toBe('');
  });

});
