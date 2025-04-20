import { EncryptedStorageService } from './encrypted-storage.service';
import { ENCRYPTION_KEY } from './encryption-key.token';
import * as CryptoJS from 'crypto-js';

describe('EncryptedStorageService', () => {
  let service: EncryptedStorageService;
  const encryptionKey = 'test-encryption-key';

  beforeEach(() => {
    service = new EncryptedStorageService(encryptionKey);
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem');
    spyOn(localStorage, 'removeItem');
  });

  it(`Given a key and value,
      When save is called,
      Then it should encrypt the value and save it to localStorage`, () => {
    const key = 'user';
    const value = { name: 'John Doe', age: 30 };

    service.save(key, value);

    expect(localStorage.setItem).toHaveBeenCalled();
    const [calledKey, encryptedValue] = (localStorage.setItem as jasmine.Spy).calls.mostRecent().args;

    expect(calledKey).toBe(key);
    expect(typeof encryptedValue).toBe('string');
    expect(encryptedValue.length).toBeGreaterThan(0);
  });

  it(`Given a key with encrypted data in localStorage,
      When get is called,
      Then it should decrypt and return the original value`, () => {
    const key = 'user';
    const originalValue = { name: 'Alice', age: 25 };

    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(originalValue),
      encryptionKey
    ).toString();

    (localStorage.getItem as jasmine.Spy).and.returnValue(encrypted);

    const result = service.get<typeof originalValue>(key);

    expect(localStorage.getItem).toHaveBeenCalledWith(key);
    expect(result).toEqual(originalValue);
  });

  it(`Given a key not in localStorage,
      When get is called,
      Then it should return null`, () => {
    const key = 'non-existent';
    (localStorage.getItem as jasmine.Spy).and.returnValue(null);

    const result = service.get<any>(key);

    expect(result).toBeNull();
  });

  it(`Given a key,
      When remove is called,
      Then it should remove the key from localStorage`, () => {
    const key = 'session';

    service.remove(key);

    expect(localStorage.removeItem).toHaveBeenCalledWith(key);
  });
});
