import { AlertService } from './alert.service';
import { AlertController } from '@ionic/angular';

describe('AlertService', () => {
  let service: AlertService;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;
  let alertSpy: jasmine.SpyObj<HTMLIonAlertElement>;

  beforeEach(() => {
    alertSpy = jasmine.createSpyObj('HTMLIonAlertElement', ['present']);
    alertControllerSpy = jasmine.createSpyObj('AlertController', ['create']);
    alertControllerSpy.create.and.resolveTo(alertSpy);

    service = new AlertService(alertControllerSpy);
  });

  it(`Given a config object,
      When showAlertInfo is called,
      Then it should create and present an alert with correct config`, async () => {
    // Arrange
    const config = {
      ALERTS: {
        TITLE: 'Información',
        MESSAGE: 'Mensaje de prueba',
        BUTTON: 'Aceptar',
      },
    };

    // Act
    await service.showAlertInfo(config);

    // Assert
    expect(alertControllerSpy.create).toHaveBeenCalledWith({
      header: config.ALERTS.TITLE,
      message: config.ALERTS.MESSAGE,
      buttons: [config.ALERTS.BUTTON],
    });
    expect(alertSpy.present).toHaveBeenCalled();
  });

  it(`Given a config and function,
      When presentDeleteConfirm is called,
      Then it should create and present a confirmation alert`, async () => {
    // Arrange
    const config = {
      TEXTS: {
        DELETE_CONFIRM_TITLE: '¿Eliminar?',
        DELETE_CANCELLED: 'Eliminación cancelada',
      },
      BUTTONS: {
        CANCEL: { LABEL: 'Cancelar' },
        DELETE: { LABEL: 'Eliminar' },
      },
    };

    const mockFunction = jasmine.createSpy('funtionToExec');
    const message = '¿Estás seguro?';
    let confirmHandler!: () => void;
    alertControllerSpy.create.and.callFake(async (options: any) => {
      confirmHandler = options.buttons[1].handler;
      return alertSpy;
    });

    // Act
    await service.presentDeleteConfirm(config, mockFunction, message);
    confirmHandler();

    // Assert
    expect(alertControllerSpy.create).toHaveBeenCalledWith({
      header: config.TEXTS.DELETE_CONFIRM_TITLE,
      message,
      cssClass: 'custom-alert',
      buttons: jasmine.any(Array),
    });
    expect(alertSpy.present).toHaveBeenCalled();
    expect(mockFunction).toHaveBeenCalled();
  });

  it(`Given a cancel button,
      When it is clicked,
      Then it should log cancellation message`, async () => {
    // Arrange
    const config = {
      TEXTS: {
        DELETE_CONFIRM_TITLE: '¿Eliminar?',
        DELETE_CANCELLED: 'Cancelado',
      },
      BUTTONS: {
        CANCEL: { LABEL: 'Cancelar' },
        DELETE: { LABEL: 'Eliminar' },
      },
    };

    spyOn(console, 'log');

    let cancelHandler!: () => void;
    alertControllerSpy.create.and.callFake(async (options: any) => {
      cancelHandler = options.buttons[0].handler;
      return alertSpy;
    });

    // Act
    await service.presentDeleteConfirm(config, () => {}, '¿Seguro?');
    cancelHandler();

    // Assert
    expect(console.log).toHaveBeenCalledWith(config.TEXTS.DELETE_CANCELLED);
  });
});
