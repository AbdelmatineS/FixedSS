import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { Preferences } from '@capacitor/preferences';



export const APP_TOKEN = 'app_token';


@Injectable({
  providedIn: 'root'
})
export class NotificationStorageService {

  constructor() { }


  setStorage(key: string, value: any) {
    Preferences.set({key: key, value: value});
  }

  getStorage(key: string): any {
    // Preferences.migrate();
    return Preferences.get({key: key});
  }

  removeStorage(key: string) {
    Preferences.remove({key: key});
  }

  clearStorage() {
    Preferences.clear();
  }

  getToken(): Observable<any> {
    return from(this.getStorage(APP_TOKEN));    
  }
  
}
