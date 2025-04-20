import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterTasksComponent } from './filter-tasks.component';

describe('FilterTasksComponent', () => {
  let component: FilterTasksComponent;
  let fixture: ComponentFixture<FilterTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterTasksComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it(`Given a filterQuery with spaces and uppercase letters,
      When onFilterChange is called,
      Then it should emit the trimmed and lowercased query`, () => {
    // Arrange
    const emitSpy = spyOn(component.filterCategory, 'emit');
    component.filterQuery = '  HelloWorld ';

    // Act
    component.onFilterChange();

    // Assert
    expect(emitSpy).toHaveBeenCalledWith('helloworld');
  });

  it(`Given a filterQuery with a value,
      When clearFilter is called,
      Then it should reset the query and emit an empty string`, () => {
    // Arrange
    const emitSpy = spyOn(component.filterCategory, 'emit');
    component.filterQuery = 'SomeValue';

    // Act
    component.clearFilter();

    // Assert
    expect(component.filterQuery).toBe('');
    expect(emitSpy).toHaveBeenCalledWith('');
  });
});
