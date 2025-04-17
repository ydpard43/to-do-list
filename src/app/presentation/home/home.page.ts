import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../application/services/task.service';
import { Observable } from 'rxjs';
import { RemoteConfigService } from '../../infrastructure/services/remote-config/remote-config.service';
import { Config } from '@ionic/angular';
import { HOME_CONFIG } from './home.config';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
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
}
