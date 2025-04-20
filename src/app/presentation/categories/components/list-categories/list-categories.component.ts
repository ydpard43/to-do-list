import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { CATEGORY_LIST_CONFIG } from './list-categories.config';
import { Category } from 'src/app/domain/models/category.model';
import { CategoriesService } from 'src/app/application/services/category.service';
import { UpdateCategoriesComponent } from '../update-categories/update-categories.component';

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
    private alertController: AlertController,
    private modalController: ModalController
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
    const alert = await this.alertController.create({
      header: this.config.TEXTS.DELETE_CONFIRM_TITLE,
      message: `${this.config.TEXTS.DELETE_CONFIRM_MESSAGE.replace('{title}', category.title)}`,
      cssClass: 'custom-alert',
      buttons: [
        {
          text: this.config.BUTTONS.CANCEL.LABEL,
          role: 'cancel',
          handler: () => {
            console.log(this.config.TEXTS.DELETE_CANCELLED);
          },
        },
        {
          text: this.config.BUTTONS.DELETE.LABEL,
          role: 'confirm',
          handler: () => {
            this.deleteCategories(category.id);
          },
        },
      ],
    });

    await alert.present();
  }

  public deleteCategories(categoryId: string) {
    if (this.allowCategoryDeletion) {
      this.categoriesService.deleteCategory(categoryId);
      this.loadCategories();
    }
  }

  public openEditCategoryModal(category: Category) {
    this.modalController.create({
      component: UpdateCategoriesComponent,
      cssClass: 'custom-modal-category',
      componentProps: { category, allowCategoryUpdate: this.allowCategoryUpdate }
    }).then(async (modal) => {
      await modal.present()
      modal.onDidDismiss().then(() => {
        this.loadCategories()
      })
    })
  }
}