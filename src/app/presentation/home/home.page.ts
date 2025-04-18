import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskService } from '../../application/services/task.service';
import { Observable } from 'rxjs';
import { RemoteConfigService } from '../../infrastructure/services/remote-config/remote-config.service';
import { HOME_CONFIG } from './home.config';
import { ListTasksComponent } from './components/list-tasks/list-tasks.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild(ListTasksComponent) public listTasksComponent!: ListTasksComponent;
  public allowTaskCompletion$: Observable<boolean> | undefined;
  public allowTaskDeletion$: Observable<boolean> | undefined;
  public allowTaskUpdate$: Observable<boolean> | undefined;
  public showAddTaskButton$: Observable<boolean> | undefined;
  public enableCategoryFilter$: Observable<boolean> | undefined;
  public filterCategoryId: string = '';
  public isModalOpen = false;
  public currentDate: Date = new Date();
  public config = HOME_CONFIG;

  constructor(private taskService: TaskService, private remoteConfigService: RemoteConfigService) { }

  ngOnInit(): void {
    this.initRemoteConfig()
  }

  private initRemoteConfig() {
    this.remoteConfigService.activateRemoteConfig().subscribe(() => {
      this.allowTaskCompletion$ = this.remoteConfigService.getBooleanValue$(
        'allowTaskCompletion'
      );
      this.allowTaskDeletion$ =
        this.remoteConfigService.getBooleanValue$('allowTaskDeletion');
      this.allowTaskUpdate$ =
        this.remoteConfigService.getBooleanValue$('allowTaskUpdate');
      this.showAddTaskButton$ =
        this.remoteConfigService.getBooleanValue$('showAddTaskButton');
      this.enableCategoryFilter$ = this.remoteConfigService.getBooleanValue$(
        'enableCategoryFilter'
      );
    });
  }

  ngAfterViewInit() {
    this.loadTasks();
  }

  public addTask(taskData: {
    title: string;
    categoryId?: string;
    date?: string;
  }) {
    this.taskService.addTask(
      taskData.title,
      taskData.categoryId,
      undefined,
      taskData.date
    );
    this.loadTasks();
    this.setOpen(false);
  }

  public loadTasks() {
    try{
   this.listTasksComponent.loadTasks();}
   catch(err){
    console.log(err)
   }
  }

  public setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
}
