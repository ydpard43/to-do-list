import { Injectable, Inject } from '@angular/core';
import { Task } from '../../domain/models/task.model';
import { TaskRepository } from '../ports/task.repository';
import { TASK_REPOSITORY_TOKEN } from '../ports/task-repository.token';
import { TaskStatus } from 'src/app/domain/models/task.-status.enum';


@Injectable({
  providedIn: 'root',
})
export class TaskService {

  constructor(
    @Inject(TASK_REPOSITORY_TOKEN) private taskRepository: TaskRepository
  ) { }


  addTask(
    title: string,
    categoryId?: string,
    status: TaskStatus = TaskStatus.Pending,
    date?: string
  ): Task {
    const newTask = new Task(
      this.generateId(),
      title,
      status,
      categoryId,
      new Date(),
      date
    );
    this.taskRepository.save(newTask);
    return newTask;
  }


  deleteTask(taskId: string): void {
    this.taskRepository.delete(taskId);
  }

 
  toggleTaskCompletion(task: Task): void {
    task.setStatus(task.status === TaskStatus.Completed ? TaskStatus.Pending : TaskStatus.Completed);
    this.taskRepository.save(task);
  }


  updateTask(taskId: string, updatedData: Partial<Task>): Task | undefined {
    const task = this.taskRepository.findById(taskId);
    if (task) {
      Object.assign(task, updatedData);
      this.taskRepository.save(task);
      return task;
    }
    return undefined;
  }

  getTasks(page: number, pageSize: number): Task[] {
    const tasks = this.taskRepository
      .findAll()
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    const start = page * pageSize;
    const end = start + pageSize;
    return tasks.slice(start, end);
  }

  private generateId(): string {
    return crypto.randomUUID();
  }
}