import { Injectable } from '@angular/core';
import { Category } from '../../domain/models/category.model';
import { EncryptedStorageService } from '../services/encrypt-storage/encrypted-storage.service';
import { environment } from 'src/environments/environment.prod';
import { CategoryRepository } from 'src/app/application/ports/category.repository';

@Injectable({
  providedIn: 'root',
})

export class LocalStorageCategoryRepository implements CategoryRepository {
  private readonly STORAGE_KEY = environment.CATEGORIES_KEY;

  constructor(private storageService: EncryptedStorageService) { }

  save(category: Category): void {
    const categorys = this.findAll();
    const index = categorys.findIndex(t => t.id === category.id);
    if (index === -1) {
      categorys.push(category);
    } else {
      categorys[index] = category;
    }
    this.storageService.save(this.STORAGE_KEY, categorys);
  }

  delete(categoryId: string): void {
    const categorys = this.findAll().filter(t => t.id !== categoryId);
    this.storageService.save(this.STORAGE_KEY, categorys);
  }

  findAll(): Category[] {
    const categorys = this.storageService.get<Category[]>(this.STORAGE_KEY);
    return categorys
      ? categorys.map(
        (categoryData: any) =>
          new Category(
            categoryData.id,
            categoryData.title,
            new Date(categoryData.createdAt),
            categoryData.date
          )
      )
      : [];
  }

  findById(categoryId: string): Category | undefined {
    return this.findAll().find(category => category.id === categoryId);
  }
}
