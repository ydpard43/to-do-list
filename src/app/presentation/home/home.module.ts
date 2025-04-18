import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { ListTasksComponent } from './components/list-tasks/list-tasks.component';
import { AddTasksComponent } from './components/add-tasks/add-tasks.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, HomePageRoutingModule],
  declarations: [HomePage, ListTasksComponent, AddTasksComponent],
})
export class HomePageModule {}
