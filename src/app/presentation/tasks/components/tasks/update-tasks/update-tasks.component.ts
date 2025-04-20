import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Task } from '../../../../../domain/models/task.model';
import { TaskService } from '../../../../../application/services/task.service';
import { UPDATE_TASK_CONFIG } from './update-tasks.config';
import { AlertController, ModalController } from '@ionic/angular';
import { Category } from 'src/app/domain/models/category.model';
import { CategoriesService } from 'src/app/application/services/category.service';
import { AlertService } from 'src/app/infrastructure/services/alert-service/alert.service';

@Component({
  selector: 'app-update-tasks',
  templateUrl: './update-tasks.component.html',
  styleUrls: ['./update-tasks.component.scss'],
})
export class UpdateTaskComponent implements OnInit {
  @Input() public task!: Task;
  @Input() public allowTaskUpdate: boolean | null = null;
  public editableTask!: Task;
  public config = UPDATE_TASK_CONFIG;

  page: number = 0;
  categories: Category[] = [];
  totalCategories: number = 0;
  public pageSize: number = 20;

  constructor(
    private taskService: TaskService,
    private alertService: AlertService,
    private modalController: ModalController,
    private categoriesService: CategoriesService
  ) { }

  public ngOnInit(): void {
    this.setEditTask()
    this.loadCategories()
  }

  public async saveTask() {
    if (this.allowTaskUpdate && this.editableTask.title.trim()) {
      this.taskService.updateTask(this.task.id, {
        title: this.editableTask.title,
        categoryId: this.editableTask.categoryId,
        date: this.editableTask.date,
      });
      this.closeModal()
    } else {
      this.alertService.showAlertInfo(this.config)
    }
  }

  public clearDate() {
    if (this.allowTaskUpdate) {
      this.editableTask.date = undefined;
    }
  }

  public setEditTask() {
    this.editableTask = new Task(
      this.task.id,
      this.task.title,
      this.task.status,
      this.task.categoryId,
      this.task.createdAt,
      this.task.date
    );
  }

  public clearCategory() {
    this.editableTask.date = ''
  }

  public loadCategories() {
    this.page = 0;
    this.categories = this.categoriesService.getCategories(0, this.pageSize) || [];
    this.totalCategories = this.categories.length;
  }

  public closeModal() {
    this.modalController.dismiss()
  }
}