import { Injectable, Inject } from '@angular/core';
import { Task } from '../../domain/models/task.model';
import { TaskRepository } from '../ports/task.repository';
import { TASK_REPOSITORY_TOKEN } from '../ports/task-repository.token';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(
    @Inject(TASK_REPOSITORY_TOKEN) private taskRepository: TaskRepository
  ) {}

 public addTask(title: string, categoryId?: string): Task {
    const newTask = new Task(this.generateId(), title, false, categoryId);
    this.taskRepository.save(newTask);
    return newTask;
  }

 public deleteTask(taskId: string): void {
    this.taskRepository.delete(taskId);
  }

 public toggleTaskCompletion(task: Task): void {
    task.toggleCompletion();
    this.taskRepository.save(task);
  }

 public getTasks(): Task[] {
    return this.taskRepository.findAll();
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
