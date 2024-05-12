import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoDetailsComponent } from './todo-details.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TodoService } from 'src/app/services/todo.service';
import { ActivatedRoute, Router } from '@angular/router';

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
});
