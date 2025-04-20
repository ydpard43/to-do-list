import { Component, Input, OnInit } from '@angular/core';
import { Category } from 'src/app/domain/models/category.model';
import { UPDATE_CATEGORY_CONFIG } from './update-categories.config';
import { CategoriesService } from 'src/app/application/services/category.service';
import { AlertService } from 'src/app/infrastructure/services/alert-service/alert.service';
import { ModalsService } from 'src/app/infrastructure/services/modal-service/modals.service';

@Component({
  selector: 'app-update-categories',
  templateUrl: './update-categories.component.html',
  styleUrls: ['./update-categories.component.scss'],
})
export class UpdateCategoriesComponent implements OnInit {
  @Input() public category!: Category;
  @Input() public allowCategoryUpdate: boolean | null = null;
  public editableCategory!: Category;
  public config = UPDATE_CATEGORY_CONFIG;

  constructor(
    private categoriesService: CategoriesService,
    private alertService: AlertService,
    private modalService: ModalsService
  ) { }

  public ngOnInit() {
    this.setEditCategory()
  }

  public async saveCategory() {
    if (this.allowCategoryUpdate && this.editableCategory.title.trim()) {
      this.updateCategory()
      this.closeModal()
    } else {
      this.alertService.showAlertInfo(this.config)
    }
  }

  public updateCategory() {
    this.categoriesService.updateCategory(this.category.id, {
      title: this.editableCategory.title,
      date: this.editableCategory.date,
    });
  }

  public closeModal() {
    this.modalService.closeModal()
  }

  private setEditCategory() {
    this.editableCategory = new Category(
      this.category.id,
      this.category.title,
      this.category.createdAt,
      this.category.date
    );
  }
}