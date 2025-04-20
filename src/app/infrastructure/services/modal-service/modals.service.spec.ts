import { ModalsService } from './modals.service';
import { ModalController } from '@ionic/angular';
import { AddCategoriesComponent } from 'src/app/presentation/categories/components/add-categories/add-categories.component';

describe('ModalsService', () => {
  let service: ModalsService;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let modalSpy: jasmine.SpyObj<HTMLIonModalElement>;

  beforeEach(() => {
    modalSpy = jasmine.createSpyObj<HTMLIonModalElement>('HTMLIonModalElement', ['present', 'onDidDismiss']);
    modalControllerSpy = jasmine.createSpyObj<ModalController>('ModalController', ['create', 'dismiss']);
    modalControllerSpy.create.and.returnValue(Promise.resolve(modalSpy));

    service = new ModalsService(modalControllerSpy);
  });

  it(`Given a type and cssClass,
      When openModal is called,
      Then it should create and present the corresponding component modal`, async () => {
    const dismissPromise = Promise.resolve({ data: undefined, role: 'dismiss' });
    modalSpy.onDidDismiss.and.returnValue(dismissPromise);
    const cssClass = 'custom-modal';
    const data = { title: 'Category Title' };

    await service.openModal('addCategory', cssClass, data);
    await dismissPromise;

    expect(modalControllerSpy.create).toHaveBeenCalledWith({
      component: AddCategoriesComponent,
      cssClass,
      componentProps: data
    });
    expect(modalSpy.present).toHaveBeenCalled();
    expect(modalSpy.onDidDismiss).toHaveBeenCalled();
  });

  it(`Given a type and a functionToExec,
      When openModal is called and modal is dismissed,
      Then the function should be executed`, async () => {
    const dismissPromise = Promise.resolve({ data: undefined, role: 'confirm' });
    modalSpy.onDidDismiss.and.returnValue(dismissPromise);
    const callbackFn = jasmine.createSpy('functionToExec');

    await service.openModal('addTask', 'task-modal', {}, callbackFn);
    await dismissPromise;
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(modalSpy.present).toHaveBeenCalled();
    expect(modalSpy.onDidDismiss).toHaveBeenCalled();
    expect(callbackFn).toHaveBeenCalled();
  });

  it(`Given a data object,
      When closeModal is called,
      Then it should call ModalController.dismiss with the data`, () => {
    const returnData = { saved: true };
    service.closeModal(returnData);
    expect(modalControllerSpy.dismiss).toHaveBeenCalledWith(returnData);
  });

  it(`When closeModal is called without data,
      Then it should call ModalController.dismiss with undefined`, () => {
    service.closeModal();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledWith(undefined);
  });
});
