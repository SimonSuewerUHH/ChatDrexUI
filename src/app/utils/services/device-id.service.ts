import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceIdService {
  private readonly storageKey = 'device_unique_id';
  private deviceId: string;

  constructor() {
    this.deviceId = this.loadOrGenerateDeviceId();
  }

  private loadOrGenerateDeviceId(): string {
    let id = localStorage.getItem(this.storageKey);
    if (!id) {
      id = this.generateUUID();
      localStorage.setItem(this.storageKey, id);
    }
    return id;
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  public setToTest(){
    this.deviceId = 'test';
    localStorage.setItem(this.storageKey, this.deviceId);
  }

  public getDeviceId(): string {
    return this.deviceId;
  }
}
