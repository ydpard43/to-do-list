import { Task } from '../../domain/models/task.model';

export interface TaskRepository {
  save(task: Task): void;
  delete(taskId: string): void;
  findAll(): Task[];
  findById(taskId: string): Task | undefined;
}
