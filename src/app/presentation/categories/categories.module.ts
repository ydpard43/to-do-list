import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CategoriesPage } from './categories.page';
import { AddCategoriesComponent } from './components/add-categories/add-categories.component';
import { ListCategoriesComponent } from './components/list-categories/list-categories.component';
import { UpdateCategoriesComponent } from './components/update-categories/update-categories.component';
import { CategoriesPageRoutingModule } from './categories-routing.module';
import { SharedModule } from '../components/shared.module';
import { FilterCategoriesComponent } from './components/filter-categories/filter-categories.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, CategoriesPageRoutingModule, SharedModule],
  declarations: [CategoriesPage, AddCategoriesComponent, ListCategoriesComponent, UpdateCategoriesComponent, FilterCategoriesComponent],
})
export class HomePageModule { }
