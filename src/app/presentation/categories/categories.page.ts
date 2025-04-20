import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { RemoteConfigService } from '../../infrastructure/services/remote-config/remote-config.service';
import { ListCategoriesComponent } from './components/list-categories/list-categories.component';
import { CATEGORIES_CONFIG } from './categories.config';
import { AddCategoriesComponent } from './components/add-categories/add-categories.component';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-categories',
  templateUrl: 'categories.page.html',
  styleUrls: ['categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  @ViewChild(ListCategoriesComponent) public ListCategories!: ListCategoriesComponent;
  public allowTaskCompletion$: Observable<boolean> | undefined;
  public allowTaskDeletion$: Observable<boolean> | undefined;
  public allowTaskUpdate$: Observable<boolean> | undefined;
  public showAddTaskButton$: Observable<boolean> | undefined;
  public enableCategoryFilter$: Observable<boolean> | undefined;
  public filterCategoryId: string = '';
  public currentDate: Date = new Date();
  public config = CATEGORIES_CONFIG;

  constructor(private remoteConfigService: RemoteConfigService, private modalController: ModalController) { }

  ngOnInit(): void {
    this.initRemoteConfig()
  }

  private initRemoteConfig() {
    this.remoteConfigService.activateRemoteConfig().subscribe(() => {
      this.allowTaskCompletion$ = this.remoteConfigService.getBooleanValue$('allowTaskComplete');
      this.allowTaskDeletion$ = this.remoteConfigService.getBooleanValue$('allowTaskDeletion');
      this.allowTaskUpdate$ = this.remoteConfigService.getBooleanValue$('allowTaskUpdate');
      this.showAddTaskButton$ = this.remoteConfigService.getBooleanValue$('allowTaskAdd');
      this.enableCategoryFilter$ = this.remoteConfigService.getBooleanValue$('enableCategoryFilter');
    });
  }

  ngAfterViewInit() {
    this.loadCategories();
  }

  public openAddModal() {
    this.modalController.create({
      component: AddCategoriesComponent,
      cssClass: 'custom-modal-category'
    }).then(async (modal) => {
      await modal.present()
      modal.onDidDismiss().then(() => {
        this.loadCategories()
      })
    })
  }

  public loadCategories() {
    this.ListCategories.loadCategories()
  }

}
