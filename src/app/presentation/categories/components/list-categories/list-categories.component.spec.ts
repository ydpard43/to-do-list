import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListCategoriesComponent } from './list-categories.component';
import { CategoriesService } from 'src/app/application/services/category.service';
import { AlertService } from 'src/app/infrastructure/services/alert-service/alert.service';
import { ModalsService } from 'src/app/infrastructure/services/modal-service/modals.service';
import { Category } from 'src/app/domain/models/category.model';
import { Component } from '@angular/core';

@Component({ selector: 'app-update-categories', template: '' })
class MockUpdateCategoriesComponent {}
describe('ListCategoriesComponent', () => {
  let component: ListCategoriesComponent;
  let fixture: ComponentFixture<ListCategoriesComponent>;

  let mockCategoryService: jasmine.SpyObj<CategoriesService>;
  let mockAlertService: jasmine.SpyObj<AlertService>;
  let mockModalService: jasmine.SpyObj<ModalsService>;

  const mockCategories: Category[] = [
    { id: '1', title: 'Work', createdAt: new Date(), date: '2024-01-01' },
    { id: '2', title: 'Personal', createdAt: new Date(), date: '2024-01-02' },
    { id: '3', title: 'Home', createdAt: new Date(), date: '2024-01-03' },
  ];

  beforeEach(async () => {
    mockCategoryService = jasmine.createSpyObj('CategoriesService', ['getCategories', 'deleteCategory']);
    mockAlertService = jasmine.createSpyObj('AlertService', ['presentDeleteConfirm']);
    mockModalService = jasmine.createSpyObj('ModalsService', ['openModal']);

    await TestBed.configureTestingModule({
      declarations: [ListCategoriesComponent, MockUpdateCategoriesComponent],
      providers: [
        { provide: CategoriesService, useValue: mockCategoryService },
        { provide: AlertService, useValue: mockAlertService },
        { provide: ModalsService, useValue: mockModalService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListCategoriesComponent);
    component = fixture.componentInstance;
  });

  it(`Given component initialization,
      When ngOnInit is called,
      Then it should load the categories`, () => {
    spyOn(component, 'loadCategories');
    component.ngOnInit();
    expect(component.loadCategories).toHaveBeenCalled();
  });

  it(`Given input changes,
      When ngOnChanges is triggered,
      Then it should apply the category filter`, () => {
    spyOn(component, 'applyFilter');
    component.ngOnChanges();
    expect(component.applyFilter).toHaveBeenCalled();
  });

  it(`Given a response from the service,
      When loadCategories is called,
      Then it should set the categories and apply the filter`, () => {
    mockCategoryService.getCategories.and.returnValue(mockCategories);
    spyOn(component, 'applyFilter');

    component.loadCategories();

    expect(component.categories).toEqual(mockCategories);
    expect(component.page).toBe(0);
    expect(component.totalCategories).toBe(3);
    expect(component.applyFilter).toHaveBeenCalled();
  });

  it(`Given an undefined response,
      When loadCategories is called,
      Then it should set categories to an empty array`, () => {
    mockCategoryService.getCategories.and.returnValue(undefined as unknown as Category[]);
    component.loadCategories();
    expect(component.categories).toEqual([]);
  });

  it(`Given a filter query and pagination setup,
      When applyFilter is called,
      Then it should filter and slice the category list`, () => {
    component.categories = mockCategories;
    component.page = 0;
    component.pageSize = 2;
    component.filterCategoryId = 'work';

    component.applyFilter();

    expect(component.filteredCategories.length).toBe(1);
    expect(component.filteredCategories[0].title.toLowerCase()).toContain('work');
  });

  it(`Given no filter query,
      When applyFilter is called,
      Then it should return the first page of categories`, () => {
    component.categories = mockCategories;
    component.page = 0;
    component.pageSize = 2;
    component.filterCategoryId = '';

    component.applyFilter();

    expect(component.filteredCategories.length).toBe(2);
  });

  it(`Given more categories available,
      When loadMoreCategories is called,
      Then it should append more and complete the event`, () => {
    component.categories = mockCategories.slice(0, 1);
    component.filteredCategories = mockCategories.slice(0, 1);
    component.page = 0;
    component.pageSize = 1;
    component.totalCategories = 3;

    mockCategoryService.getCategories.and.returnValue(mockCategories.slice(1, 2));

    const mockEvent = {
      target: {
        complete: jasmine.createSpy('complete'),
        disabled: false
      }
    };

    component.loadMoreCategories(mockEvent);

    expect(component.categories.length).toBe(2);
    expect(mockEvent.target.complete).toHaveBeenCalled();
    expect(mockEvent.target.disabled).toBeFalse();
  });

  it(`Given all categories are loaded,
      When loadMoreCategories is called,
      Then it should disable infinite scroll`, () => {
    component.categories = mockCategories;
    component.page = 0;
    component.pageSize = 3;
    component.totalCategories = 3;
    component.filterCategoryId = '';
    component.filteredCategories = [...mockCategories];

    mockCategoryService.getCategories.and.returnValue([]);

    const mockEvent = {
      target: {
        complete: jasmine.createSpy('complete'),
        disabled: false
      }
    };

    component.loadMoreCategories(mockEvent);

    expect(mockEvent.target.disabled).toBeTrue();
  });

  it(`Given a category,
      When presentDeleteConfirm is called,
      Then it should show the confirm alert with correct message`, () => {
    const category = mockCategories[0];
    const expectedMessage = component.config.TEXTS.DELETE_CONFIRM_MESSAGE.replace('{title}', category.title);

    component.presentDeleteConfirm(category);

    expect(mockAlertService.presentDeleteConfirm).toHaveBeenCalledWith(
      component.config,
      jasmine.any(Function),
      expectedMessage
    );
  });

  it(`Given the confirm callback is triggered,
      When presentDeleteConfirm is called,
      Then it should delete the category`, () => {
    const category = mockCategories[0];
    component.allowCategoryDeletion = true;
    spyOn(component, 'deleteCategories');

    component.presentDeleteConfirm(category);

    const confirmFn = mockAlertService.presentDeleteConfirm.calls.mostRecent().args[1]!;
    confirmFn();

    expect(component.deleteCategories).toHaveBeenCalledWith(category.id);
  });

  it(`Given deletion is allowed,
      When deleteCategories is called,
      Then it should call the service and reload`, () => {
    component.allowCategoryDeletion = true;
    spyOn(component, 'loadCategories');

    component.deleteCategories('1');

    expect(mockCategoryService.deleteCategory).toHaveBeenCalledWith('1');
    expect(component.loadCategories).toHaveBeenCalled();
  });

  it(`Given deletion is not allowed,
      When deleteCategories is called,
      Then it should not call the service`, () => {
    component.allowCategoryDeletion = false;
    component.deleteCategories('1');
    expect(mockCategoryService.deleteCategory).not.toHaveBeenCalled();
  });

  it(`Given category update is allowed,
      When openEditCategoryModal is called,
      Then it should open the modal with correct data`, () => {
    const category = mockCategories[0];
    component.allowCategoryUpdate = true;
    spyOn(component, 'loadCategories');

    component.openEditCategoryModal(category);

    expect(mockModalService.openModal).toHaveBeenCalledWith(
      'editCategory',
      'custom-modal-category',
      { category, allowCategoryUpdate: true },
      jasmine.any(Function)
    );
  });

  it(`Given the modal callback is triggered,
      When openEditCategoryModal is called,
      Then it should reload the categories`, () => {
    const category = mockCategories[0];
    component.allowCategoryUpdate = true;
    spyOn(component, 'loadCategories');

    component.openEditCategoryModal(category);

    const callbackFn = mockModalService.openModal.calls.mostRecent().args[3]!;
    callbackFn();

    expect(component.loadCategories).toHaveBeenCalled();
  });
});
