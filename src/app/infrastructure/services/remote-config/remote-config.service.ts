import { Injectable } from '@angular/core';
import { RemoteConfig } from '@angular/fire/remote-config';
import {
  fetchAndActivate,
  getStringChanges,
} from '@angular/fire/remote-config';
import { from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RemoteConfigService {

  constructor(private remoteConfig: RemoteConfig) {}

  public activateRemoteConfig(): Observable<boolean> {
    this.remoteConfig.settings.minimumFetchIntervalMillis = 0;
    return from(fetchAndActivate(this.remoteConfig));
  }

  public getBooleanValue$(key: string): Observable<boolean> {
    return getStringChanges(this.remoteConfig, key).pipe(
      map(value => value === 'true')
    );
  }
}