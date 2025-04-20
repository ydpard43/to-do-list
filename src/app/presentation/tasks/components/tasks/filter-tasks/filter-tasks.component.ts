import { Component, EventEmitter, Output } from '@angular/core';
import { CATEGORY_FILTER_CONFIG } from './filter-tasks.config';

@Component({
  selector: 'app-filter-tasks',
  templateUrl: './filter-tasks.component.html',
  styleUrls: ['./filter-tasks.component.scss'],
})
export class FilterTasksComponent {
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
