import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TasksPage } from './tasks.page';
import { TasksPageRoutingModule } from './tasks-routing.module';
import { ListTasksComponent } from './components/tasks/list-tasks/list-tasks.component';
import { AddTasksComponent } from './components/tasks/add-tasks/add-tasks.component';
import { UpdateTaskComponent } from './components/tasks/update-tasks/update-tasks.component';
import { FilterTasksComponent } from './components/tasks/filter-tasks/filter-tasks.component';
import { SharedModule } from '../components/shared.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, TasksPageRoutingModule, SharedModule],
  declarations: [TasksPage, ListTasksComponent, AddTasksComponent, UpdateTaskComponent, FilterTasksComponent],
})
export class TasksPageModule { }
