import { Component, Input, OnInit } from '@angular/core';
import { CATEGORY_LIST_CONFIG } from './list-categories.config';
import { Category } from 'src/app/domain/models/category.model';
import { CategoriesService } from 'src/app/application/services/category.service';
import { AlertService } from 'src/app/infrastructure/services/alert-service/alert.service';
import { ModalsService } from 'src/app/infrastructure/services/modal-service/modals.service';

@Component({
  selector: 'app-list-categories',
  templateUrl: './list-categories.component.html',
  styleUrls: ['./list-categories.component.scss'],
})
export class ListCategoriesComponent implements OnInit {
  public categories: Category[] = [];
  public filteredCategories: Category[] = [];
  public config = CATEGORY_LIST_CONFIG;

  @Input() public filterCategoryId: string = '';
  @Input() public allowCategoryDeletion: boolean | null = null;
  @Input() public allowCategoryUpdate: boolean | null = null;

  public selectedCategory!: Category;
  public page: number = 0;
  public pageSize: number = 20;
  public totalCategories: number = 0;

  constructor(
    private categoriesService: CategoriesService,
    private alertService: AlertService,
    private modalService: ModalsService
  ) { }

  public ngOnInit() {
    this.loadCategories();
  }

  public ngOnChanges() {
    this.applyFilter();
  }

  public loadCategories() {
    this.page = 0;
    this.categories = this.categoriesService.getCategories(0, this.pageSize) || [];
    this.totalCategories = this.categories.length;
    this.applyFilter();
  }

  public loadMoreCategories(event: any) {
    this.page++;
    const nextCategories = this.categoriesService.getCategories(this.page, this.pageSize);
    this.categories = [...this.categories, ...nextCategories];
    this.applyFilter();
    event.target.complete();

    if (this.filteredCategories.length >= this.totalCategories) {
      event.target.disabled = true;
    }
  }

  public applyFilter() {
    const query = this.filterCategoryId.trim().toLowerCase();
    if (query === '') {
      this.filteredCategories = this.categories.slice(0, (this.page + 1) * this.pageSize);
    } else {
      this.filteredCategories = this.categories
        .filter(category => {
          const titleMatch = category.title?.toLowerCase().includes(query);
          return titleMatch;
        })
        .slice(0, (this.page + 1) * this.pageSize);
    }
  }

  public async presentDeleteConfirm(category: Category) {
    const message: string = `${this.config.TEXTS.DELETE_CONFIRM_MESSAGE.replace('{title}', category.title)}`
    this.alertService.presentDeleteConfirm(this.config, () => {
      this.deleteCategories(category.id);
    }, message)
  }

  public deleteCategories(categoryId: string) {
    if (this.allowCategoryDeletion) {
      this.categoriesService.deleteCategory(categoryId);
      this.loadCategories();
    }
  }

  public openEditCategoryModal(category: Category) {
    let data = { category, allowCategoryUpdate: this.allowCategoryUpdate }
    this.modalService.openModal('editCategory', 'custom-modal-category', data, () => {
      this.loadCategories()
    })
  }
}