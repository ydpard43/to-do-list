import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListTasksComponent } from './list-tasks.component';
import { TaskService } from 'src/app/application/services/task.service';
import { AlertService } from 'src/app/infrastructure/services/alert-service/alert.service';
import { ModalsService } from 'src/app/infrastructure/services/modal-service/modals.service';
import { Task } from 'src/app/domain/models/task.model';
import { TaskStatus } from 'src/app/domain/models/task.-status.enum';

describe('ListTasksComponent', () => {
  let component: ListTasksComponent;
  let fixture: ComponentFixture<ListTasksComponent>;

  let mockTaskService: jasmine.SpyObj<TaskService>;
  let mockAlertService: jasmine.SpyObj<AlertService>;
  let mockModalService: jasmine.SpyObj<ModalsService>;

  const mockTasks: Task[] = [
    new Task('1', 'Buy milk', TaskStatus.Pending, 'Home', new Date(), ''),
    new Task('2', 'Do homework', TaskStatus.Completed, 'School', new Date(), ''),
    new Task('3', 'Call mom', TaskStatus.Pending, 'Family', new Date(), '')
  ];

  beforeEach(async () => {
    mockTaskService = jasmine.createSpyObj('TaskService', ['getTasks', 'toggleTaskCompletion', 'deleteTask']);
    mockAlertService = jasmine.createSpyObj('AlertService', ['presentDeleteConfirm']);
    mockModalService = jasmine.createSpyObj('ModalsService', ['openModal']);

    await TestBed.configureTestingModule({
      declarations: [ListTasksComponent],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        { provide: AlertService, useValue: mockAlertService },
        { provide: ModalsService, useValue: mockModalService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it(`Given component initialization,
      When ngOnInit is called,
      Then it should load tasks`, () => {
    spyOn(component, 'loadTasks');
    component.ngOnInit();
    expect(component.loadTasks).toHaveBeenCalled();
  });

  it(`Given input changes,
      When ngOnChanges is called,
      Then it should re-apply filters`, () => {
    spyOn(component, 'applyFilter');
    component.ngOnChanges();
    expect(component.applyFilter).toHaveBeenCalled();
  });

  it(`Given a successful task fetch,
      When loadTasks is called,
      Then it should populate the task list and apply filters`, () => {
    mockTaskService.getTasks.and.returnValue(mockTasks);
    spyOn(component, 'applyFilter');

    component.loadTasks();

    expect(component.tasks).toEqual(mockTasks);
    expect(component.totalTasks).toBe(mockTasks.length);
    expect(component.applyFilter).toHaveBeenCalled();
  });

  it(`Given a filterCategoryId,
      When applyFilter is called,
      Then it should filter tasks by title or categoryId`, () => {
    component.tasks = mockTasks;
    component.page = 0;
    component.pageSize = 10;
    component.filterCategoryId = 'home';

    component.applyFilter();

    expect(component.filteredTasks.length).toBeGreaterThan(0);
  });

  it(`Given filtered tasks,
      When filterTasks is called with 'pending',
      Then it should return only pending tasks`, () => {
    component.filteredTasks = mockTasks;
    component.applyFilter('pending');

    const result = component.filterTasks();
    expect(result.every(task => task.status === TaskStatus.Pending)).toBeTrue();
  });

  it(`Given filtered tasks,
      When filterTasks is called with 'completed',
      Then it should return only completed tasks`, () => {
    component.filteredTasks = mockTasks;
    component.applyFilter('completed');

    const result = component.filterTasks();
    expect(result.every(task => task.status === TaskStatus.Completed)).toBeTrue();
  });

  it(`Given tab 'all' is selected,
      When filterTasks is called,
      Then it should return all tasks paginated`, () => {
    component.filteredTasks = [...mockTasks];
    component.page = 0;
    component.pageSize = 10;

    const result = component.filterTasks();
    expect(result.length).toBe(3);
  });

  it(`Given selectedTab is 'pending',
      When filterTasks is called,
      Then it should return only pending tasks`, () => {
    component.filteredTasks = [
      new Task('1', 'Task 1', TaskStatus.Pending, '', new Date(), ''),
      new Task('2', 'Task 2', TaskStatus.Completed, '', new Date(), '')
    ];
    component.selectedTab = 'pending';

    const result = component.filterTasks();
    expect(result.length).toBe(1);
    expect(result[0].status).toBe(TaskStatus.Pending);
  });

  it(`Given selectedTab is 'completed',
      When filterTasks is called,
      Then it should return only completed tasks`, () => {
    component.filteredTasks = [
      new Task('1', 'Task 1', TaskStatus.Pending, '', new Date(), ''),
      new Task('2', 'Task 2', TaskStatus.Completed, '', new Date(), '')
    ];
    component.selectedTab = 'completed';

    const result = component.filterTasks();
    expect(result.length).toBe(1);
    expect(result[0].status).toBe(TaskStatus.Completed);
  });

  it(`Given a task is toggled,
      When toggleCompletion is called,
      Then it should toggle status and reload tasks`, () => {
    const task = mockTasks[0];
    spyOn(component, 'loadTasks');

    component.toggleCompletion(task);

    expect(mockTaskService.toggleTaskCompletion).toHaveBeenCalledWith(task);
    expect(component.loadTasks).toHaveBeenCalled();
  });

  it(`Given deletion is allowed,
      When deleteTask is called,
      Then it should remove the task and reload`, () => {
    spyOn(component, 'loadTasks');
    component.allowTaskDeletion = true;
    component.tasks = mockTasks;

    component.deleteTask('1');

    expect(mockTaskService.deleteTask).toHaveBeenCalledWith('1');
    expect(component.loadTasks).toHaveBeenCalled();
  });

  it(`Given deletion is not allowed,
      When deleteTask is called,
      Then it should not call the service`, () => {
    component.allowTaskDeletion = false;
    component.deleteTask('1');
    expect(mockTaskService.deleteTask).not.toHaveBeenCalled();
  });

  it(`Given a task to edit,
      When openEditTaskModal is called,
      Then it should open modal and reload on callback`, () => {
    spyOn(component, 'loadTasks');
    component.allowTaskUpdate = true;

    const task = mockTasks[0];
    component.openEditTaskModal(task);

    const callback = mockModalService.openModal.calls.mostRecent().args[3]!;
    callback();

    expect(component.loadTasks).toHaveBeenCalled();
  });

  it(`Given a task to delete,
      When presentDeleteConfirm is called,
      Then it should format the message and handle confirm`, () => {
    const task = mockTasks[0];
    spyOn(component, 'deleteTask');

    component.presentDeleteConfirm(task);

    const handler = mockAlertService.presentDeleteConfirm.calls.mostRecent().args[1]!;
    handler();

    expect(component.deleteTask).toHaveBeenCalledWith(task.id);
  });

  it(`Given a task with no categoryId,
      When presentDeleteConfirm is called,
      Then it should use NO_CATEGORY text in the message`, () => {
    const taskWithoutCategory = new Task(
      '999', 'Test Task', TaskStatus.Pending, '', new Date(), ''
    );

    component.config.TEXTS.NO_CATEGORY = 'Sin categoría';
    component.config.TEXTS.DELETE_CONFIRM_MESSAGE = '¿Eliminar "{title}" de la categoría "{category}"?';

    spyOn(component, 'deleteTask');

    component.presentDeleteConfirm(taskWithoutCategory);

    const generatedMessage = mockAlertService.presentDeleteConfirm.calls.mostRecent().args[2];
    expect(generatedMessage).toContain('Sin categoría');

    const handler = mockAlertService.presentDeleteConfirm.calls.mostRecent().args[1]!;
    handler();

    expect(component.deleteTask).toHaveBeenCalledWith(taskWithoutCategory.id);
  });

  it(`Given there are more tasks to load,
      When loadMoreTasks is called,
      Then it should append and continue scroll`, () => {
    component.page = 0;
    component.pageSize = 1;
    component.tasks = [mockTasks[0]];
    component.filteredTasks = [mockTasks[0]];
    component.totalTasks = 3;

    mockTaskService.getTasks.and.returnValue([mockTasks[1]]);

    const mockEvent = {
      target: {
        complete: jasmine.createSpy('complete'),
        disabled: false
      }
    };

    component.loadMoreTasks(mockEvent);

    expect(component.tasks.length).toBe(2);
    expect(mockEvent.target.complete).toHaveBeenCalled();
    expect(mockEvent.target.disabled).toBeFalse();
  });

  it(`Given all tasks are loaded,
      When loadMoreTasks is called,
      Then it should disable infinite scroll`, () => {
    component.tasks = [...mockTasks];
    component.page = 0;
    component.pageSize = 3;
    component.totalTasks = 3;
    component.filteredTasks = [...mockTasks];

    mockTaskService.getTasks.and.returnValue([]);

    const mockEvent = {
      target: {
        complete: jasmine.createSpy('complete'),
        disabled: false
      }
    };

    component.loadMoreTasks(mockEvent);

    expect(mockEvent.target.disabled).toBeTrue();
  });
});
