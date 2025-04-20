import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterCategoriesComponent } from './filter-categories.component';
import { IonicModule } from '@ionic/angular';

describe('FilterCategoriesComponent', () => {
  let component: FilterCategoriesComponent;
  let fixture: ComponentFixture<FilterCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterCategoriesComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it(`Given a filter query with extra spaces and uppercase,
      When onFilterChange is called,
      Then it should emit the trimmed and lowercase string`, () => {
    // Arrange
    spyOn(component.filterCategory, 'emit');
    component.filterQuery = '  Hello World ';

    // Act
    component.onFilterChange();

    // Assert
    expect(component.filterCategory.emit).toHaveBeenCalledWith('hello world');
  });

  it(`Given a non-empty filter query,
      When clearFilter is called,
      Then it should clear the input and trigger a new filter`, () => {
    // Arrange
    spyOn(component, 'onFilterChange');
    component.filterQuery = 'Something';

    // Act
    component.clearFilter();

    // Assert
    expect(component.filterQuery).toBe('');
    expect(component.onFilterChange).toHaveBeenCalled();
  });
});
