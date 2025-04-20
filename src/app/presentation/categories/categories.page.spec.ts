import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoriesPage } from './categories.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RemoteConfigService } from 'src/app/infrastructure/services/remote-config/remote-config.service';
import { ModalsService } from 'src/app/infrastructure/services/modal-service/modals.service';
import { of } from 'rxjs';

describe('CategoriesPage (controlled lifecycle)', () => {
  let fixture: ComponentFixture<CategoriesPage>;
  let component: CategoriesPage;

  const mockRemoteConfigService = jasmine.createSpyObj('RemoteConfigService', [
    'activateRemoteConfig',
    'getBooleanValue$'
  ]);

  const mockModalService = jasmine.createSpyObj('ModalsService', ['openModal']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoriesPage],
      providers: [
        { provide: RemoteConfigService, useValue: mockRemoteConfigService },
        { provide: ModalsService, useValue: mockModalService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesPage);
    component = fixture.componentInstance;
  });

  it(`Given RemoteConfig returns true,
      When ngOnInit and ngAfterViewInit are called,
      Then it should call loadCategories on child component`, () => {
    // Arrange
    mockRemoteConfigService.activateRemoteConfig.and.returnValue(of(true));
    mockRemoteConfigService.getBooleanValue$.and.returnValue(of(true));

    component.ListCategories = {
      loadCategories: jasmine.createSpy()
    } as any;

    // Act
    component.ngOnInit();
    component.ngAfterViewInit();

    // Assert
    expect(component.ListCategories.loadCategories).toHaveBeenCalled();
  });

  it(`Given openAddModal is triggered,
      When the modal closes via callback,
      Then it should reload the category list`, () => {
    // Arrange
    const loadSpy = jasmine.createSpy();
    component.ListCategories = { loadCategories: loadSpy } as any;

    // Act
    component.openAddModal();
    const callbackFn = mockModalService.openModal.calls.mostRecent().args[3]!;
    callbackFn();

    // Assert
    expect(loadSpy).toHaveBeenCalled();
  });
});
