import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Category } from 'src/app/domain/models/category.model';
import { UPDATE_CATEGORY_CONFIG } from './update-categories.config';
import { CategoriesService } from 'src/app/application/services/category.service';

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
    private alertController: AlertController,
    private modalController: ModalController
  ) { }

  public ngOnInit() {
    this.editableCategory = new Category(
      this.category.id,
      this.category.title,
      this.category.createdAt,
      this.category.date
    );
  }

  public async saveCategory() {
    if (this.allowCategoryUpdate && this.editableCategory.title.trim()) {
      this.updateCategory()
      this.closeModal()
    } else {
      const alert = await this.alertController.create({
        header: this.config.ALERTS.TITLE,
        message: this.config.ALERTS.MESSAGE,
        buttons: [this.config.ALERTS.BUTTON],
      });
      await alert.present();
    }
  }

  public updateCategory() {
    this.categoriesService.updateCategory(this.category.id, {
      title: this.editableCategory.title,
      date: this.editableCategory.date,
    });
  }

  public closeModal() {
    this.modalController.dismiss()
  }
}