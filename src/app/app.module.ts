import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LocalStorageTaskRepository } from './infrastructure/adapters/local-storage-task.repository';
import { ENCRYPTION_KEY } from './infrastructure/services/encrypt-storage/encryption-key.token';
import { TASK_REPOSITORY_TOKEN } from './application/ports/task-repository.token';
import { environment } from 'src/environments/environment.prod';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getRemoteConfig, provideRemoteConfig } from '@angular/fire/remote-config';
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: TASK_REPOSITORY_TOKEN, useClass: LocalStorageTaskRepository },
    { provide: ENCRYPTION_KEY, useValue: environment.ENCRYPTION_KEY },
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideRemoteConfig(() => getRemoteConfig())
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
