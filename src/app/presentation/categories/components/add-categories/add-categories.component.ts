import { Component } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ADD_CATEGORIES_CONFIG } from './add-categories.config';
import { CategoriesService } from 'src/app/application/services/category.service';

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

  constructor(private alertController: AlertController, private categoryService: CategoriesService, private modalController: ModalController) { }

  public async onAddCategories() {
    if (this.newCategoriesTitle.trim()) {
      this.addCategory();
      this.resetForm();
    } else {
      const alert = await this.alertController.create({
        header: this.config.ALERTS.TITLE,
        message: this.config.ALERTS.MESSAGE,
        buttons: [this.config.ALERTS.BUTTON],
      });
      await alert.present();
    }
  }

  public resetForm() {
    this.newCategoriesTitle = '';
    this.newCategoriesCategoryId = '';
    this.newCategoriesDate = null;
  }

  public closeModal() {
    this.modalController.dismiss()
  }

  public addCategory() {
    this.categoryService.addCategory(
      this.newCategoriesTitle,
      this.newCategoriesDate || undefined
    );
    this.closeModal()
  }

}
