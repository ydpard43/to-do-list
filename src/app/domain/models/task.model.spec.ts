import { Task } from './task.model';
import { TaskStatus } from './task.-status.enum';

describe('Task Model', () => {
  it(`Given all constructor arguments,
      When a Task is created,
      Then it should set all properties correctly`, () => {
    // Arrange
    const id = '1';
    const title = 'Test Task';
    const status = TaskStatus.Pending;
    const categoryId = 'cat123';
    const createdAt = new Date('2025-01-01');
    const date = '2025-04-20';

    // Act
    const task = new Task(id, title, status, categoryId, createdAt, date);

    // Assert
    expect(task.id).toBe(id);
    expect(task.title).toBe(title);
    expect(task.status).toBe(status);
    expect(task.categoryId).toBe(categoryId);
    expect(task.createdAt).toBe(createdAt);
    expect(task.date).toBe(date);
  });

  it(`Given only id and title,
      When a Task is created without status or createdAt,
      Then it should default status to Pending and createdAt to now`, () => {
    // Arrange
    const id = 'default-check';
    const title = 'Minimal Task';
    const before = new Date();

    // Act
    const task = new Task(id, title);

    const after = new Date();

    // Assert
    expect(task.status).toBe(TaskStatus.Pending);
    expect(task.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(task.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
    expect(task.categoryId).toBeUndefined();
    expect(task.date).toBeUndefined();
  });

  it(`Given a task with status Pending,
      When setStatus is called with Completed,
      Then the status should be updated`, () => {
    // Arrange
    const task = new Task('3', 'Status Test');

    // Act
    task.setStatus(TaskStatus.Completed);

    // Assert
    expect(task.status).toBe(TaskStatus.Completed);
  });

  it(`Given a task with status Completed,
      When setStatus is called with the same status,
      Then the status should remain unchanged`, () => {
    // Arrange
    const task = new Task('4', 'No Change', TaskStatus.Completed);

    // Act
    task.setStatus(TaskStatus.Completed);

    // Assert
    expect(task.status).toBe(TaskStatus.Completed);
  });
});
