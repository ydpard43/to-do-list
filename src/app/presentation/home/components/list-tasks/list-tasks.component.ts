import { Component, Input, OnInit } from '@angular/core';
import { TaskService } from '../../../../application/services/task.service';
import { Task } from '../../../../domain/models/task.model';
import { AlertController } from '@ionic/angular';
import { TASK_LIST_CONFIG } from './list-tasks.config';

@Component({
  selector: 'app-list-tasks',
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.scss'],
})
export class ListTasksComponent implements OnInit {
  public tasks: Task[] = [];
  public filteredTasks: Task[] = [];
  public config = TASK_LIST_CONFIG;

  @Input() public filterCategoryId: string = '';
  @Input() public allowTaskDeletion: boolean | null = null;
  @Input() public allowTaskUpdate: boolean | null = null;

  public isEditTaskModalOpen = false;
  public selectedTask!: Task;
  public page: number = 0;
  public pageSize: number = 20;
  public totalTasks: number = 0;

  constructor(
    private taskService: TaskService,
    private alertController: AlertController
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

  public applyFilter() {
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
  }

  public toggleCompletion(task: Task) {
    this.taskService.toggleTaskCompletion(task);
    this.loadTasks();
  }

  public async presentDeleteConfirm(task: Task) {
    const alert = await this.alertController.create({
      header: this.config.TEXTS.DELETE_CONFIRM_MESSAGE,
      message: `${this.config.TEXTS.DELETE_CONFIRM_MESSAGE.replace('{title}', task.title).replace('{category}', task.categoryId || this.config.TEXTS.NO_CATEGORY)}`,
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
            this.deleteTask(task.id);
          },
        },
      ],
    });

    await alert.present();
  }

  public deleteTask(taskId: string) {
    if (this.allowTaskDeletion) {
      this.taskService.deleteTask(taskId);
      this.loadTasks();
    }
  }

  public openEditTaskModal(task: Task) {
    this.selectedTask = new Task(
      task.id,
      task.title,
      task.status,
      task.categoryId,
      task.createdAt,
      task.date
    );
    this.isEditTaskModalOpen = true;
  }

  public closeEditTaskModal() {
    this.isEditTaskModalOpen = false;
  }

  public onTaskUpdated(updatedTask: Task) {
    const index = this.tasks.findIndex(task => task.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
    }
    this.applyFilter();
    this.closeEditTaskModal();
  }
}