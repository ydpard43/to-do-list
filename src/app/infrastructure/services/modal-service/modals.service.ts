import { Injectable } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { AddCategoriesComponent } from "src/app/presentation/categories/components/add-categories/add-categories.component";
import { UpdateCategoriesComponent } from "src/app/presentation/categories/components/update-categories/update-categories.component";
import { AddTasksComponent } from "src/app/presentation/tasks/components/tasks/add-tasks/add-tasks.component";
import { UpdateTaskComponent } from "src/app/presentation/tasks/components/tasks/update-tasks/update-tasks.component";

@Injectable({
    providedIn: 'root',
})
export class ModalsService {

    private components = {
        addCategory: AddCategoriesComponent,
        addTask: AddTasksComponent,
        editCategory: UpdateCategoriesComponent,
        editTasks: UpdateTaskComponent
    };
    constructor(private modalController: ModalController) { }

    public closeModal(data?: any) {
        this.modalController.dismiss(data)
    }

    public openModal(type: keyof typeof this.components, cssClass: string, data?: object, functionToExec?: () => void) {
        const component = this.components[type];

        this.modalController.create({
            component,
            cssClass,
            componentProps: data
        }).then(async (modal) => {
            await modal.present()
            modal.onDidDismiss().then(() => {
                if (functionToExec) {
                    functionToExec()
                }
            })
        })
    }

}
