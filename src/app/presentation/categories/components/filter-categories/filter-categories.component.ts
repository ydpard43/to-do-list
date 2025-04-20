import { Component, EventEmitter, Output } from '@angular/core';
import { CATEGORY_FILTER_CONFIG } from './filter-categories.config';

@Component({
  selector: 'app-filter-categories',
  templateUrl: './filter-categories.component.html',
  styleUrls: ['./filter-categories.component.scss'],
})
export class FilterCategoriesComponent {
  public filterQuery: string = '';
  public config = CATEGORY_FILTER_CONFIG;

  @Output() public filterCategory = new EventEmitter<string>();

  public onFilterChange() {
    this.filterCategory.emit(this.filterQuery.trim().toLowerCase());
  }

  public clearFilter() {
    this.filterQuery = '';
    this.onFilterChange();
  }

}
