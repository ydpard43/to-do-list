import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ADD_TASK_CONFIG } from './add-tasks.config';
import { Category } from 'src/app/domain/models/category.model';
import { CategoriesService } from 'src/app/application/services/category.service';
import { TaskService } from 'src/app/application/services/task.service';

@Component({
  selector: 'app-add-tasks',
  templateUrl: './add-tasks.component.html',
  styleUrls: ['./add-tasks.component.scss'],
})
export class AddTasksComponent implements OnInit {

  public newTaskTitle: string = '';
  public newTaskCategoryId: string = '';
  public newTaskDate: string | null = null;
  public config = ADD_TASK_CONFIG;

  page: number = 0;
  categories: Category[] = [];
  totalCategories: number = 0;
  public pageSize: number = 20;

  constructor(private alertController: AlertController, private categoriesService: CategoriesService, private modalController: ModalController, private taskService: TaskService) { }

  ngOnInit(): void {
    this.loadCategories()
  }

  public async onAddTask() {
    if (this.newTaskTitle.trim()) {
      this.addTask();
      this.resetForm();
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

  public addTask() {
    this.taskService.addTask(
      this.newTaskTitle,
      this.newTaskCategoryId || '',
      undefined,
      this.newTaskDate || undefined,
    );
  }

  public resetForm() {
    this.newTaskTitle = '';
    this.newTaskCategoryId = '';
    this.newTaskDate = null;
  }

  public clearCategory(){
    this.newTaskCategoryId = ''
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
