import { Injectable, Inject } from '@angular/core';
import { Category } from 'src/app/domain/models/category.model';
import { CategoryRepository } from '../ports/category.repository';
import { CATEGORY_REPOSITORY_TOKEN } from '../ports/category-repository.token';


@Injectable({
  providedIn: 'root',
})
export class CategoriesService {

  constructor(
    @Inject(CATEGORY_REPOSITORY_TOKEN) private categoryRepository: CategoryRepository
  ) { }


  public addCategory(title: string, date?: string): Category {
    const newCategory = new Category(
      this.generateId(),
      title,
      new Date(),
      date
    );
    this.categoryRepository.save(newCategory);
    return newCategory;
  }


  public deleteCategory(categoryId: string): void {
    this.categoryRepository.delete(categoryId);
  }


  public updateCategory(categoryId: string, updatedData: Partial<Category>): Category | undefined {
    const category = this.categoryRepository.findById(categoryId);
    if (category) {
      Object.assign(category, updatedData);
      this.categoryRepository.save(category);
      return category;
    }
    return undefined;
  }

  getCategories(page: number, pageSize: number): Category[] {
    const categories = this.categoryRepository
      .findAll()
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    const start = page * pageSize;
    const end = start + pageSize;
    return categories.slice(start, end);
  }

  private generateId(): string {
    return crypto.randomUUID();
  }
}