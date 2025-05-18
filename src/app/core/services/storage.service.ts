import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly _keyPrefix = 'app_secure_';

  get<T>(key: string): T | null {
    try {
      const storedData = localStorage.getItem(this._keyPrefix + key);
      return storedData ? JSON.parse(storedData) : null;
    } catch {
      this.remove(key);
      return null;
    }
  }

  set(key: string, value: unknown): void {
    const jsonData = JSON.stringify(value);
    localStorage.setItem(this._keyPrefix + key, jsonData);
  }

  remove(key: string): void {
    localStorage.removeItem(this._keyPrefix + key);
  }
}
