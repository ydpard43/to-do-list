import { Component, Input, OnInit } from '@angular/core';
import { TaskService } from '../../../../../application/services/task.service';
import { Task } from '../../../../../domain/models/task.model';
import { AlertController, ModalController } from '@ionic/angular';
import { TASK_LIST_CONFIG } from './list-tasks.config';
import { TaskStatus } from 'src/app/domain/models/task.-status.enum';
import { UpdateTaskComponent } from '../update-tasks/update-tasks.component';
import { AlertService } from 'src/app/infrastructure/services/alert-service/alert.service';

@Component({
  selector: 'app-list-tasks',
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.scss'],
})
export class ListTasksComponent implements OnInit {
  public tasks: Task[] = [];
  public filteredTasks: Task[] = [];
  selectedTab: 'all' | 'pending' | 'completed' = 'all';
  public config = TASK_LIST_CONFIG;

  @Input() public filterCategoryId: string = '';
  @Input() public allowTaskDeletion: boolean | null = null;
  @Input() public allowTaskUpdate: boolean | null = null;

  public selectedTask!: Task;
  public page: number = 0;
  public pageSize: number = 20;
  public totalTasks: number = 0;

  constructor(
    private taskService: TaskService,
    private alertService: AlertService,
    private modalController: ModalController
  ) { }

  public ngOnInit() {
    this.loadTasks();
  }

  public ngOnChanges() {
    this.applyFilter();
  }

  public loadTasks() {
    this.page = 0;
    this.tasks = this.taskService.getTasks(0, this.pageSize) || [];
    this.totalTasks = this.tasks.length;
    this.applyFilter();
  }

  public loadMoreTasks(event: any) {
    this.page++;
    const nextTasks = this.taskService.getTasks(this.page, this.pageSize);
    this.tasks = [...this.tasks, ...nextTasks];
    this.applyFilter();
    event.target.complete();

    if (this.filteredTasks.length >= this.totalTasks) {
      event.target.disabled = true;
    }
  }

  public applyFilter(tab: 'all' | 'pending' | 'completed' = 'all') {
    this.selectedTab = tab;
    const query = this.filterCategoryId.trim().toLowerCase();

    if (query === '') {
      this.filteredTasks = this.tasks.slice(0, (this.page + 1) * this.pageSize);
    } else {
      this.filteredTasks = this.tasks
        .filter(task => {
          const categoryMatch = task.categoryId?.toLowerCase().includes(query);
          const titleMatch = task.title?.toLowerCase().includes(query);
          return categoryMatch || titleMatch;
        })
        .slice(0, (this.page + 1) * this.pageSize);
    }
    this.filteredTasks = this.filterTasks()
  }

  public toggleCompletion(task: Task) {
    this.taskService.toggleTaskCompletion(task);
    this.loadTasks();
  }

  public async presentDeleteConfirm(task: Task) {
    const message: string = `${this.config.TEXTS.DELETE_CONFIRM_MESSAGE.replace('{title}', task.title).replace('{category}', task.categoryId || this.config.TEXTS.NO_CATEGORY)}`
    this.alertService.presentDeleteConfirm(this.config, () => {
      this.deleteTask(task.id);
    }, message
    )

  }

  public deleteTask(taskId: string) {
    if (this.allowTaskDeletion) {
      this.taskService.deleteTask(taskId);
      this.loadTasks();
    }
  }

  public openEditTaskModal(task: Task) {
    this.modalController.create({
      component: UpdateTaskComponent,
      cssClass: 'custom-modal',
      componentProps: { task, allowTaskUpdate: this.allowTaskUpdate }
    }).then(async (modal) => {
      await modal.present()
      modal.onDidDismiss().then(() => {
        this.loadTasks()
      })
    })

  }

  filterTasks(): Task[] {
    switch (this.selectedTab) {
      case 'pending':
        return this.filteredTasks.filter(task => task.status === TaskStatus.Pending);
      case 'completed':
        return this.filteredTasks.filter(task => task.status === TaskStatus.Completed);
      default:
        return this.filteredTasks;
    }
  }
}