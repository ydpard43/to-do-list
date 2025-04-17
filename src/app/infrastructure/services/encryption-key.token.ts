import { InjectionToken } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

export const ENCRYPTION_KEY = new InjectionToken<string>(environment.ENCRYPTION_KEY);