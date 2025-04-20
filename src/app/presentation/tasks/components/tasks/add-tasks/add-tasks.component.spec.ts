import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddTasksComponent } from './add-tasks.component';
import { CategoriesService } from 'src/app/application/services/category.service';
import { TaskService } from 'src/app/application/services/task.service';
import { AlertService } from 'src/app/infrastructure/services/alert-service/alert.service';
import { ModalsService } from 'src/app/infrastructure/services/modal-service/modals.service';
import { Category } from 'src/app/domain/models/category.model';
import { IonicModule } from '@ionic/angular';

describe('AddTasksComponent', () => {
  let component: AddTasksComponent;
  let fixture: ComponentFixture<AddTasksComponent>;

  let mockCategoryService: jasmine.SpyObj<CategoriesService>;
  let mockTaskService: jasmine.SpyObj<TaskService>;
  let mockAlertService: jasmine.SpyObj<AlertService>;
  let mockModalService: jasmine.SpyObj<ModalsService>;

  beforeEach(async () => {
    mockCategoryService = jasmine.createSpyObj('CategoriesService', ['getCategories']);
    mockTaskService = jasmine.createSpyObj('TaskService', ['addTask']);
    mockAlertService = jasmine.createSpyObj('AlertService', ['showAlertInfo']);
    mockModalService = jasmine.createSpyObj('ModalsService', ['closeModal']);

    await TestBed.configureTestingModule({
      declarations: [AddTasksComponent],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: CategoriesService, useValue: mockCategoryService },
        { provide: TaskService, useValue: mockTaskService },
        { provide: AlertService, useValue: mockAlertService },
        { provide: ModalsService, useValue: mockModalService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddTasksComponent);
    component = fixture.componentInstance;
  });

  it(`Given component initialization,
      When ngOnInit is called,
      Then it should load the categories`, () => {
    spyOn(component, 'loadCategories');
    component.ngOnInit();
    expect(component.loadCategories).toHaveBeenCalled();
  });

  it(`Given a service response with categories,
      When loadCategories is called,
      Then it should populate the categories and update the count`, () => {
    const mockCategories: Category[] = [
      { id: '1', title: 'Work', createdAt: new Date(), date: '' }
    ];
    mockCategoryService.getCategories.and.returnValue(mockCategories);

    component.loadCategories();

    expect(component.categories).toEqual(mockCategories);
    expect(component.totalCategories).toBe(1);
  });

  it(`Given no categories returned by the service,
      When loadCategories is called,
      Then it should default to an empty array`, () => {
    mockCategoryService.getCategories.and.returnValue(undefined as unknown as Category[]);

    component.loadCategories();

    expect(component.categories).toEqual([]);
    expect(component.totalCategories).toBe(0);
  });

  it(`Given an empty task title,
      When onAddTask is called,
      Then it should show an alert and not proceed`, async () => {
    component.newTaskTitle = '  ';
    await component.onAddTask();
    expect(mockAlertService.showAlertInfo).toHaveBeenCalled();
    expect(mockTaskService.addTask).not.toHaveBeenCalled();
  });

  it(`Given a valid title and data,
      When onAddTask is called,
      Then it should add the task, reset the form, and close the modal`, async () => {
    component.newTaskTitle = 'New Task';
    component.newTaskCategoryId = 'cat1';
    component.newTaskDate = '2025-04-20';

    spyOn(component, 'addTask');
    spyOn(component, 'resetForm');
    spyOn(component, 'closeModal');

    await component.onAddTask();

    expect(component.addTask).toHaveBeenCalled();
    expect(component.resetForm).toHaveBeenCalled();
    expect(component.closeModal).toHaveBeenCalled();
  });

  it(`Given a filled task form,
      When addTask is called,
      Then it should call the service with correct values`, () => {
    component.newTaskTitle = 'Test Task';
    component.newTaskCategoryId = 'cat42';
    component.newTaskDate = '2025-01-01';

    component.addTask();

    expect(mockTaskService.addTask).toHaveBeenCalledWith(
      'Test Task',
      'cat42',
      undefined,
      '2025-01-01'
    );
  });

  it(`Given optional values are missing,
      When addTask is called,
      Then it should call the service using undefined defaults`, () => {
    component.newTaskTitle = 'Task Without Extras';
    component.newTaskCategoryId = '';
    component.newTaskDate = null;

    component.addTask();

    expect(mockTaskService.addTask).toHaveBeenCalledWith(
      'Task Without Extras',
      '',
      undefined,
      undefined
    );
  });

  it(`Given an existing task form,
      When resetForm is called,
      Then it should clear all fields`, () => {
    component.newTaskTitle = 'x';
    component.newTaskCategoryId = 'y';
    component.newTaskDate = 'z';

    component.resetForm();

    expect(component.newTaskTitle).toBe('');
    expect(component.newTaskCategoryId).toBe('');
    expect(component.newTaskDate).toBeNull();
  });

  it(`Given a selected category,
      When clearCategory is called,
      Then it should clear the selected categoryId`, () => {
    component.newTaskCategoryId = 'some-category';
    component.clearCategory();
    expect(component.newTaskCategoryId).toBe('');
  });

  it(`Given a modal is open,
      When closeModal is called,
      Then it should trigger the modalService to close it`, () => {
    component.closeModal();
    expect(mockModalService.closeModal).toHaveBeenCalled();
  });
});
