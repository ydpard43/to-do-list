import { Category } from "src/app/domain/models/category.model";


export interface CategoryRepository {
  save(task: Category): void;
  delete(taskId: string): void;
  findAll(): Category[];
  findById(taskId: string): Category | undefined;
}
