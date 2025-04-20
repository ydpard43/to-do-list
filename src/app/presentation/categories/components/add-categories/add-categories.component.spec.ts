import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddCategoriesComponent } from './add-categories.component';
import { CategoriesService } from 'src/app/application/services/category.service';
import { ModalsService } from 'src/app/infrastructure/services/modal-service/modals.service';
import { AlertService } from 'src/app/infrastructure/services/alert-service/alert.service';
import { IonicModule } from '@ionic/angular';

describe('AddCategoriesComponent', () => {
  let component: AddCategoriesComponent;
  let fixture: ComponentFixture<AddCategoriesComponent>;
  let mockCategoryService: jasmine.SpyObj<CategoriesService>;
  let mockModalService: jasmine.SpyObj<ModalsService>;
  let mockAlertService: jasmine.SpyObj<AlertService>;

  beforeEach(async () => {
    mockCategoryService = jasmine.createSpyObj('CategoriesService', ['addCategory']);
    mockModalService = jasmine.createSpyObj('ModalsService', ['closeModal']);
    mockAlertService = jasmine.createSpyObj('AlertService', ['showAlertInfo']);

    await TestBed.configureTestingModule({
      declarations: [AddCategoriesComponent],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: CategoriesService, useValue: mockCategoryService },
        { provide: ModalsService, useValue: mockModalService },
        { provide: AlertService, useValue: mockAlertService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddCategoriesComponent);
    component = fixture.componentInstance;
  });

  it(`Given an empty category title,
      When onAddCategories is called,
      Then it should show an alert and not add the category`, async () => {
    // Arrange
    component.newCategoriesTitle = '   ';

    // Act
    await component.onAddCategories();

    // Assert
    expect(mockAlertService.showAlertInfo).toHaveBeenCalled();
    expect(mockCategoryService.addCategory).not.toHaveBeenCalled();
  });

  it(`Given a valid title and optional date,
      When onAddCategories is called,
      Then it should call addCategory and resetForm`, async () => {
    // Arrange
    component.newCategoriesTitle = 'New Category';
    component.newCategoriesDate = '2025-04-20';
    spyOn(component, 'addCategory');
    spyOn(component, 'resetForm');

    // Act
    await component.onAddCategories();

    // Assert
    expect(component.addCategory).toHaveBeenCalled();
    expect(component.resetForm).toHaveBeenCalled();
  });

  it(`Given a title and date,
      When addCategory is called,
      Then it should call the service and close the modal`, () => {
    // Arrange
    component.newCategoriesTitle = 'Category A';
    component.newCategoriesDate = '2025-01-01';

    // Act
    component.addCategory();

    // Assert
    expect(mockCategoryService.addCategory).toHaveBeenCalledWith('Category A', '2025-01-01');
    expect(mockModalService.closeModal).toHaveBeenCalled();
  });

  it(`Given a title and no date,
      When addCategory is called,
      Then it should pass undefined as the date`, () => {
    // Arrange
    component.newCategoriesTitle = 'Category B';
    component.newCategoriesDate = null;

    // Act
    component.addCategory();

    // Assert
    expect(mockCategoryService.addCategory).toHaveBeenCalledWith('Category B', undefined);
  });

  it(`Given an existing form with values,
      When resetForm is called,
      Then it should clear all fields`, () => {
    // Arrange
    component.newCategoriesTitle = 'Work';
    component.newCategoriesCategoryId = 'cat1';
    component.newCategoriesDate = '2024-12-31';

    // Act
    component.resetForm();

    // Assert
    expect(component.newCategoriesTitle).toBe('');
    expect(component.newCategoriesCategoryId).toBe('');
    expect(component.newCategoriesDate).toBeNull();
  });

  it(`Given an open modal,
      When closeModal is called,
      Then it should close the modal using the service`, () => {
    // Act
    component.closeModal();

    // Assert
    expect(mockModalService.closeModal).toHaveBeenCalled();
  });
});
