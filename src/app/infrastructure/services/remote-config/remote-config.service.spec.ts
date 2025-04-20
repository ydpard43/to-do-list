import { RemoteConfigService } from './remote-config.service';
import { RemoteConfig } from '@angular/fire/remote-config';
import { of } from 'rxjs';

describe('RemoteConfigService', () => {
  let service: RemoteConfigService;
  let mockRemoteConfig: RemoteConfig;

  beforeEach(() => {
    mockRemoteConfig = {
      settings: {
        minimumFetchIntervalMillis: 60000,
      }
    } as any;

    service = new RemoteConfigService(mockRemoteConfig);
  });

  it(`Given a RemoteConfig instance,
      When activateRemoteConfig is called,
      Then it should set fetch interval to 0 and call fetchAndActivate`, (done) => {
    const fetchSpy = jasmine.createSpy().and.returnValue(Promise.resolve(true));
    service.fetchAndActivateFn = fetchSpy;

    service.activateRemoteConfig().subscribe(result => {
      expect(mockRemoteConfig.settings.minimumFetchIntervalMillis).toBe(0);
      expect(fetchSpy).toHaveBeenCalledWith(mockRemoteConfig);
      expect(result).toBeTrue();
      done();
    });
  });

  it(`Given a key with 'true' and 'false' string values,
      When getBooleanValue$ is called,
      Then it should emit true or false accordingly`, (done) => {
    const key = 'feature_enabled';
    const getStringSpy = jasmine.createSpy().and.returnValue(of('true', 'false'));
    service.getStringChangesFn = getStringSpy;

    const results: boolean[] = [];

    service.getBooleanValue$(key).subscribe({
      next: val => results.push(val),
      complete: () => {
        expect(getStringSpy).toHaveBeenCalledWith(mockRemoteConfig, key);
        expect(results).toEqual([true, false]);
        done();
      }
    });
  });
});
