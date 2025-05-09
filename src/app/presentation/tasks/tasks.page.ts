import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { RemoteConfigService } from '../../infrastructure/services/remote-config/remote-config.service';
import { HOME_CONFIG } from './tasks.config';
import { ListTasksComponent } from './components/tasks/list-tasks/list-tasks.component';
import { CategoriesService } from 'src/app/application/services/category.service';
import { ListCategoriesComponent } from '../categories/components/list-categories/list-categories.component';
import { ModalsService } from 'src/app/infrastructure/services/modal-service/modals.service';

@Component({
  selector: 'app-tasks',
  templateUrl: 'tasks.page.html',
  styleUrls: ['tasks.page.scss'],
})
export class TasksPage implements OnInit {
  @ViewChild(ListTasksComponent) public listTasksComponent!: ListTasksComponent;
  @ViewChild(ListCategoriesComponent) public ListCategories!: ListCategoriesComponent;
  public allowTaskCompletion$: Observable<boolean> | undefined;
  public allowTaskDeletion$: Observable<boolean> | undefined;
  public allowTaskUpdate$: Observable<boolean> | undefined;
  public showAddTaskButton$: Observable<boolean> | undefined;
  public enableCategoryFilter$: Observable<boolean> | undefined;
  public filterCategoryId: string = '';
  public isModalOpen = false;
  public currentDate: Date = new Date();
  public config = HOME_CONFIG;

  constructor(private categoryService: CategoriesService, private remoteConfigService: RemoteConfigService, private modalService: ModalsService) { }

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
    this.loadTasks();
  }

  public addCategory(taskData: {
    title: string;
  }) {
    this.categoryService.addCategory(
      taskData.title
    );
    this.loadTasks();
  }

  public loadTasks() {
    this.listTasksComponent.loadTasks();
  }

  public loadCategories() {
    this.ListCategories.loadCategories()
  }

  public openAddModal() {
    this.modalService.openModal('addTask', 'custom-modal', {}, () => {
      this.loadTasks()
    })
  }
}
