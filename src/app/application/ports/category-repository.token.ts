import { InjectionToken } from '@angular/core';
import { CategoryRepository } from './category.repository';

export const CATEGORY_REPOSITORY_TOKEN = new InjectionToken<CategoryRepository>(
  'CATEGORY_REPOSITORY_TOKEN'
);
