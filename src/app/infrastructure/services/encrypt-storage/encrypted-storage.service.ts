import { Injectable, Inject } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { ENCRYPTION_KEY } from './encryption-key.token';

@Injectable({
  providedIn: 'root',
})
export class EncryptedStorageService {
  constructor(@Inject(ENCRYPTION_KEY) private encryptionKey: string) { }

  public save(key: string, value: any): void {
    const encryptedValue = CryptoJS.AES.encrypt(
      JSON.stringify(value),
      this.encryptionKey
    ).toString();
    localStorage.setItem(key, encryptedValue);
  }

  public get<T>(key: string): T | null {
    const encryptedValue = localStorage.getItem(key);
    if (encryptedValue) {
      const decryptedValue = CryptoJS.AES.decrypt(
        encryptedValue,
        this.encryptionKey
      ).toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedValue) as T;
    }
    return null;
  }

  public remove(key: string): void {
    localStorage.removeItem(key);
  }
}
