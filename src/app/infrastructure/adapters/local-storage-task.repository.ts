import { Injectable } from '@angular/core';
import { Task } from '../../domain/models/task.model';
import { TaskRepository } from '../../application/ports/task.repository';
import { EncryptedStorageService } from '../services/encrypt-storage/encrypted-storage.service';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageTaskRepository implements TaskRepository {
  private readonly STORAGE_KEY = environment.STORAGE_KEY;

  constructor(private storageService: EncryptedStorageService) {}

  save(task: Task): void {
    const tasks = this.findAll();
    const index = tasks.findIndex(t => t.id === task.id);
    if (index === -1) {
      tasks.push(task);
    } else {
      tasks[index] = task;
    }
    this.storageService.save(this.STORAGE_KEY, tasks);
  }

  delete(taskId: string): void {
    const tasks = this.findAll().filter(t => t.id !== taskId);
    this.storageService.save(this.STORAGE_KEY, tasks);
  }

  findAll(): Task[] {
    const tasks = this.storageService.get<Task[]>(this.STORAGE_KEY);
    return tasks
      ? tasks.map(
          (taskData: any) =>
            new Task(
              taskData.id,
              taskData.title,
              taskData.status,
              taskData.categoryId
            )
        )
      : [];
  }
  
  findById(taskId: string): Task | undefined {
    return this.findAll().find(task => task.id === taskId);
  }
}
