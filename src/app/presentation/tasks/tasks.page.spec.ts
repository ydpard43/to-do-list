import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Task } from 'src/app/domain/models/task.model';
import { TaskStatus } from 'src/app/domain/models/task.-status.enum';
import { TaskService } from 'src/app/application/services/task.service';
import { AlertService } from 'src/app/infrastructure/services/alert-service/alert.service';
import { ModalsService } from 'src/app/infrastructure/services/modal-service/modals.service';
import { CategoriesService } from 'src/app/application/services/category.service';
import { Category } from 'src/app/domain/models/category.model';
import { UpdateTaskComponent } from './components/tasks/update-tasks/update-tasks.component';

describe('UpdateTaskComponent', () => {
  let component: UpdateTaskComponent;
  let fixture: ComponentFixture<UpdateTaskComponent>;

  let mockTaskService: jasmine.SpyObj<TaskService>;
  let mockAlertService: jasmine.SpyObj<AlertService>;
  let mockModalService: jasmine.SpyObj<ModalsService>;
  let mockCategoryService: jasmine.SpyObj<CategoriesService>;

  const mockTask: Task = new Task(
    '1',
    'Original Task',
    TaskStatus.Pending,
    'cat1',
    new Date('2023-01-01'),
    '2024-01-01'
  );

  beforeEach(async () => {
    mockTaskService = jasmine.createSpyObj('TaskService', ['updateTask']);
    mockAlertService = jasmine.createSpyObj('AlertService', ['showAlertInfo']);
    mockModalService = jasmine.createSpyObj('ModalsService', ['closeModal']);
    mockCategoryService = jasmine.createSpyObj('CategoriesService', ['getCategories']);

    await TestBed.configureTestingModule({
      declarations: [UpdateTaskComponent],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        { provide: AlertService, useValue: mockAlertService },
        { provide: ModalsService, useValue: mockModalService },
        { provide: CategoriesService, useValue: mockCategoryService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateTaskComponent);
    component = fixture.componentInstance;
    component.task = mockTask;
  });

  it(`Given component initialization,
      When ngOnInit is called,
      Then it should set editable task and load categories`, () => {
    spyOn(component, 'setEditTask');
    spyOn(component, 'loadCategories');

    component.ngOnInit();

    expect(component.setEditTask).toHaveBeenCalled();
    expect(component.loadCategories).toHaveBeenCalled();
  });

  it(`Given a task,
      When setEditTask is called,
      Then it should create an editable copy`, () => {
    component.setEditTask();

    expect(component.editableTask).toEqual(jasmine.objectContaining({
      id: mockTask.id,
      title: mockTask.title,
      categoryId: mockTask.categoryId,
      status: mockTask.status,
      date: mockTask.date
    }));
  });

  it(`Given an empty title or update disallowed,
      When saveTask is called,
      Then it should show an alert and not update`, async () => {
    component.allowTaskUpdate = true;
    component.setEditTask();
    component.editableTask.title = '   ';

    await component.saveTask();
    expect(mockAlertService.showAlertInfo).toHaveBeenCalled();

    component.allowTaskUpdate = false;
    component.editableTask.title = 'Valid Title';

    await component.saveTask();
    expect(mockAlertService.showAlertInfo).toHaveBeenCalledTimes(2);
  });

  it(`Given a valid title and update permission,
      When saveTask is called,
      Then it should update the task and close the modal`, async () => {
    component.allowTaskUpdate = true;
    component.setEditTask();
    component.editableTask.title = 'Updated Title';

    await component.saveTask();

    expect(mockTaskService.updateTask).toHaveBeenCalledWith(mockTask.id, {
      title: 'Updated Title',
      categoryId: mockTask.categoryId,
      date: mockTask.date
    });
    expect(mockModalService.closeModal).toHaveBeenCalled();
  });

  it(`Given a selected category,
      When clearCategory is called,
      Then it should reset the categoryId`, () => {
    component.setEditTask();
    component.editableTask.categoryId = 'catX';

    component.clearCategory();

    expect(component.editableTask.categoryId).toBe('');
  });

  it(`Given categories are fetched,
      When loadCategories is called,
      Then it should set the list and update total`, () => {
    const mockCategories: Category[] = [
      { id: '1', title: 'Work', createdAt: new Date(), date: '' }
    ];
    mockCategoryService.getCategories.and.returnValue(mockCategories);

    component.loadCategories();

    expect(component.categories).toEqual(mockCategories);
    expect(component.totalCategories).toBe(1);
  });

  it(`Given the service returns undefined,
      When loadCategories is called,
      Then it should fallback to empty array`, () => {
    mockCategoryService.getCategories.and.returnValue(undefined as unknown as Category[]);

    component.loadCategories();

    expect(component.categories).toEqual([]);
    expect(component.totalCategories).toBe(0);
  });

  it(`Given the modal is open,
      When closeModal is called,
      Then it should trigger the modal service`, () => {
    component.closeModal();
    expect(mockModalService.closeModal).toHaveBeenCalled();
  });
});
