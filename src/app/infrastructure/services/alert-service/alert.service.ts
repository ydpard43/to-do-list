import { Injectable } from "@angular/core";
import { AlertController } from "@ionic/angular";

@Injectable({
    providedIn: 'root',
})
export class AlertService {

    constructor(private alertController: AlertController) { }

    public async showAlertInfo(config: any) {
        const alert = await this.alertController.create({
            header: config.ALERTS.TITLE,
            message: config.ALERTS.MESSAGE,
            buttons: [config.ALERTS.BUTTON],
        });
        await alert.present();
    }

    public async presentDeleteConfirm(config: any, funtionToExec: () => void, message: string) {
        const alert = await this.alertController.create({
            header: config.TEXTS.DELETE_CONFIRM_TITLE,
            message,
            cssClass: 'custom-alert',
            buttons: [
                {
                    text: config.BUTTONS.CANCEL.LABEL,
                    role: 'cancel',
                    handler: () => {
                        console.log(config.TEXTS.DELETE_CANCELLED);
                    },
                },
                {
                    text: config.BUTTONS.DELETE.LABEL,
                    role: 'confirm',
                    handler: () => {
                        if (funtionToExec) {
                            funtionToExec()
                        }

                    },
                },
            ],
        });

        await alert.present();
    }


}