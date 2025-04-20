import { TaskService } from './task.service';
import { TaskRepository } from '../ports/task.repository';
import { Task } from '../../domain/models/task.model';
import { TaskStatus } from 'src/app/domain/models/task.-status.enum';

describe('TaskService', () => {
  let service: TaskService;
  let mockRepository: jasmine.SpyObj<TaskRepository>;

  beforeEach(() => {
    mockRepository = jasmine.createSpyObj<TaskRepository>('TaskRepository', [
      'save',
      'delete',
      'findById',
      'findAll',
    ]);
    service = new TaskService(mockRepository);
  });

  it(`Given a new task with a specific date,
      When addTask is called,
      Then it should save the task with the specified date to the repository`, () => {
    // Arrange
    const title = 'New Task';
    const categoryId = '123';
    const specificDate = '2024-09-30T00:00:00Z';

    // Act
    const newTask = service.addTask(title, categoryId, TaskStatus.Pending, specificDate);

    // Assert
    expect(newTask.title).toBe(title);
    expect(newTask.categoryId).toBe(categoryId);
    expect(newTask.status).toBe(TaskStatus.Pending);
    expect(newTask.date).toBe(specificDate);
    expect(newTask.createdAt instanceof Date).toBeTrue();
    expect(mockRepository.save).toHaveBeenCalledWith(newTask);
  });

  it(`Given a new task without a status argument,
      When addTask is called,
      Then it should default to TaskStatus.Pending and save the task`, () => {
    // Arrange
    const title = 'Task Without Status';
    const categoryId = 'cat123';
    const date = '2024-10-01';

    // Act
    const task = service.addTask(title, categoryId, undefined as any, date);

    // Assert
    expect(task.status).toBe(TaskStatus.Pending);
    expect(mockRepository.save).toHaveBeenCalledWith(task);
  });

  it(`Given a task ID,
      When deleteTask is called,
      Then it should call the repository to delete the task`, () => {
    // Arrange
    const taskId = '456';

    // Act
    service.deleteTask(taskId);

    // Assert
    expect(mockRepository.delete).toHaveBeenCalledWith(taskId);
  });

  it(`Given a task marked as completed,
      When toggleTaskCompletion is called,
      Then it should change its status to pending and save it`, () => {
    // Arrange
    const task = new Task('1', 'Task A', TaskStatus.Completed, 'cat', new Date(), '');

    spyOn(task, 'setStatus').and.callThrough();

    // Act
    service.toggleTaskCompletion(task);

    // Assert
    expect(task.setStatus).toHaveBeenCalledWith(TaskStatus.Pending);
    expect(mockRepository.save).toHaveBeenCalledWith(task);
  });

  it(`Given a task marked as pending,
      When toggleTaskCompletion is called,
      Then it should change its status to completed and save it`, () => {
    // Arrange
    const task = new Task('2', 'Task B', TaskStatus.Pending, 'cat', new Date(), '');

    spyOn(task, 'setStatus').and.callThrough();

    // Act
    service.toggleTaskCompletion(task);

    // Assert
    expect(task.setStatus).toHaveBeenCalledWith(TaskStatus.Completed);
    expect(mockRepository.save).toHaveBeenCalledWith(task);
  });

  it(`Given a task already marked as completed,
      When toggleTaskCompletion is called twice,
      Then it should toggle status to pending and back to completed`, () => {
    // Arrange
    const task = new Task('4', 'Task D', TaskStatus.Completed, 'cat', new Date(), '');

    // Act
    service.toggleTaskCompletion(task); 
    service.toggleTaskCompletion(task); 

    // Assert
    expect(task.status).toBe(TaskStatus.Completed);
  });

  it(`Given an existing task ID and updated data,
      When updateTask is called,
      Then it should update the task and save it`, () => {
    // Arrange
    const task = new Task('3', 'Task C', TaskStatus.Pending, 'cat', new Date(), '');
    mockRepository.findById.and.returnValue(task);
    const updates = { title: 'Updated Task C' };

    // Act
    const result = service.updateTask('3', updates);

    // Assert
    expect(result?.title).toBe('Updated Task C');
    expect(mockRepository.save).toHaveBeenCalledWith(task);
  });

  it(`Given a non-existent task ID,
      When updateTask is called,
      Then it should return undefined and not save anything`, () => {
    // Arrange
    mockRepository.findById.and.returnValue(undefined);

    // Act
    const result = service.updateTask('non-existent-id', { title: 'Nothing' });

    // Assert
    expect(result).toBeUndefined();
    expect(mockRepository.save).not.toHaveBeenCalled();
  });

  it(`Given multiple tasks with different createdAt dates,
      When getTasks is called with a page and size,
      Then it should return sorted and paginated tasks`, () => {
    // Arrange
    const task1 = new Task('1', 'Task 1', TaskStatus.Pending, '', new Date('2023-01-01'), '');
    const task2 = new Task('2', 'Task 2', TaskStatus.Pending, '', new Date('2024-01-01'), '');
    const task3 = new Task('3', 'Task 3', TaskStatus.Pending, '', new Date('2022-01-01'), '');
    mockRepository.findAll.and.returnValue([task1, task2, task3]);

    // Act
    const result = service.getTasks(0, 2);

    // Assert
    expect(result.length).toBe(2);
    expect(result[0].id).toBe('2');
    expect(result[1].id).toBe('1');
  });

  it(`Given the generateId method,
      When it is called,
      Then it should return a valid UUID string`, () => {
    // Act
    const uuid = (service as any).generateId();

    // Assert
    expect(typeof uuid).toBe('string');
    expect(uuid.length).toBeGreaterThan(0);
  });
});
