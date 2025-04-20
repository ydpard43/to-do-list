import { Injectable } from '@angular/core';
import { RemoteConfig } from '@angular/fire/remote-config';
import { fetchAndActivate, getStringChanges } from '@angular/fire/remote-config';
import { from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RemoteConfigService {
  constructor(private remoteConfig: RemoteConfig) {}
  public fetchAndActivateFn = fetchAndActivate;
  public getStringChangesFn = getStringChanges;

  public activateRemoteConfig(): Observable<boolean> {
    this.remoteConfig.settings.minimumFetchIntervalMillis = 0;
    return from(this.fetchAndActivateFn(this.remoteConfig));
  }

  public getBooleanValue$(key: string): Observable<boolean> {
    return this.getStringChangesFn(this.remoteConfig, key).pipe(
      map(value => value === 'true')
    );
  }
}
