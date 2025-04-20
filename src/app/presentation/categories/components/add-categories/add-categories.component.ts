import { Component } from '@angular/core';
import { ADD_CATEGORIES_CONFIG } from './add-categories.config';
import { CategoriesService } from 'src/app/application/services/category.service';
import { AlertService } from 'src/app/infrastructure/services/alert-service/alert.service';
import { ModalsService } from 'src/app/infrastructure/services/modal-service/modals.service';

@Component({
  selector: 'app-add-categories',
  templateUrl: './add-categories.component.html',
  styleUrls: ['./add-categories.component.scss'],
})

export class AddCategoriesComponent {

  public newCategoriesTitle: string = '';
  public newCategoriesCategoryId: string = '';
  public newCategoriesDate: string | null = null;
  public config = ADD_CATEGORIES_CONFIG;

  constructor(private categoryService: CategoriesService, private modalService: ModalsService, private alertService: AlertService) { }

  public async onAddCategories() {
    if (this.newCategoriesTitle.trim()) {
      this.addCategory();
      this.resetForm();
    } else {
      this.alertService.showAlertInfo(this.config)
    }
  }

  public resetForm() {
    this.newCategoriesTitle = '';
    this.newCategoriesCategoryId = '';
    this.newCategoriesDate = null;
  }

  public closeModal() {
    this.modalService.closeModal()
  }

  public addCategory() {
    this.categoryService.addCategory(
      this.newCategoriesTitle,
      this.newCategoriesDate || undefined
    );
    this.closeModal()
  }

}
