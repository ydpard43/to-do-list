import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateCategoriesComponent } from './update-categories.component';
import { CategoriesService } from 'src/app/application/services/category.service';
import { AlertService } from 'src/app/infrastructure/services/alert-service/alert.service';
import { ModalsService } from 'src/app/infrastructure/services/modal-service/modals.service';
import { Category } from 'src/app/domain/models/category.model';

describe('UpdateCategoriesComponent', () => {
  let component: UpdateCategoriesComponent;
  let fixture: ComponentFixture<UpdateCategoriesComponent>;

  let mockCategoryService: jasmine.SpyObj<CategoriesService>;
  let mockAlertService: jasmine.SpyObj<AlertService>;
  let mockModalService: jasmine.SpyObj<ModalsService>;

  const mockCategory: Category = new Category(
    '1',
    'Personal',
    new Date('2023-01-01'),
    '2024-01-01'
  );

  beforeEach(async () => {
    mockCategoryService = jasmine.createSpyObj('CategoriesService', ['updateCategory']);
    mockAlertService = jasmine.createSpyObj('AlertService', ['showAlertInfo']);
    mockModalService = jasmine.createSpyObj('ModalsService', ['closeModal']);

    await TestBed.configureTestingModule({
      declarations: [UpdateCategoriesComponent],
      providers: [
        { provide: CategoriesService, useValue: mockCategoryService },
        { provide: AlertService, useValue: mockAlertService },
        { provide: ModalsService, useValue: mockModalService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateCategoriesComponent);
    component = fixture.componentInstance;
    component.category = mockCategory;
  });

  it(`Given component initialization,
      When ngOnInit is called,
      Then it should call setEditCategory`, () => {
    spyOn<any>(component, 'setEditCategory');
    component.ngOnInit();
    expect((component as any).setEditCategory).toHaveBeenCalled();
  });

  it(`Given an input category,
      When ngOnInit is called,
      Then it should copy the category into editableCategory`, () => {
    component.ngOnInit();
    expect(component.editableCategory).toEqual(jasmine.objectContaining({
      id: mockCategory.id,
      title: mockCategory.title,
      date: mockCategory.date
    }));
  });

  it(`Given an empty title,
      When saveCategory is called,
      Then it should show an alert and not update`, async () => {
    component.ngOnInit();
    component.allowCategoryUpdate = true;
    component.editableCategory.title = '   ';

    await component.saveCategory();

    expect(mockAlertService.showAlertInfo).toHaveBeenCalled();
    expect(mockCategoryService.updateCategory).not.toHaveBeenCalled();
  });

  it(`Given update permission is false,
      When saveCategory is called,
      Then it should show an alert and not update`, async () => {
    component.ngOnInit();
    component.allowCategoryUpdate = false;
    component.editableCategory.title = 'Valid Title';

    await component.saveCategory();

    expect(mockAlertService.showAlertInfo).toHaveBeenCalled();
    expect(mockCategoryService.updateCategory).not.toHaveBeenCalled();
  });

  it(`Given a valid title and permission to update,
      When saveCategory is called,
      Then it should update and close modal`, async () => {
    component.ngOnInit();
    component.allowCategoryUpdate = true;
    component.editableCategory.title = 'Updated Title';

    spyOn(component, 'updateCategory');
    spyOn(component, 'closeModal');

    await component.saveCategory();

    expect(component.updateCategory).toHaveBeenCalled();
    expect(component.closeModal).toHaveBeenCalled();
  });

  it(`Given an editable category,
      When updateCategory is called,
      Then it should call the service with correct data`, () => {
    component.editableCategory = new Category('1', 'New Title', new Date(), '2025-01-01');
    component.category = mockCategory;

    component.updateCategory();

    expect(mockCategoryService.updateCategory).toHaveBeenCalledWith('1', {
      title: 'New Title',
      date: '2025-01-01'
    });
  });

  it(`Given the modal is open,
      When closeModal is called,
      Then it should close the modal`, () => {
    component.closeModal();
    expect(mockModalService.closeModal).toHaveBeenCalled();
  });
});
