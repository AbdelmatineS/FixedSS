import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { ActionPerformed, PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../login/services/auth.service';
import { StorageService } from '../../login/services/storage.service';
import { NotificationStorageService } from '../notification-storage/notification-storage.service';

export const FCM_TOKEN = 'push_notification_token';
const NOT_API = `${environment.baseApiUrl}/api/auth/`;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  private _redirect = new BehaviorSubject<any>(null);

  get redirect() {
    return this._redirect.asObservable();
  }

  constructor(
    private storage: NotificationStorageService,
    private userTokenStorage: StorageService,
    private http:HttpClient
  ) { }

  initPush() {
    if(Capacitor.getPlatform() !== 'web') {
      this.registerPush();
      // this.getDeliveredNotifications();
    }
  }

  private async registerPush() {

    try {
      await this.addListeners();
      let permStatus = await PushNotifications.checkPermissions();
      if (permStatus.receive === 'prompt') {

        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        //PushNotifications.requestPermissions();

        throw new Error('User denied permissions!');
      }

      await PushNotifications.register();
    } catch(e) {
      console.log(e);
    }
  }

  async getDeliveredNotifications() {
    const notificationList = await PushNotifications.getDeliveredNotifications();
    console.log('delivered notifications', notificationList);
  }


  addListeners() {

    const userId = this.userTokenStorage.getUserId();


    PushNotifications.addListener(
      'registration',
      async(token: Token) => {
        console.log('My token: ', token);
        const fcm_token = (token?.value);
        let go = 1;
        const saved_token = await this.storage.getStorage(FCM_TOKEN); // Get saved token directly
        if(saved_token) {
          if(fcm_token == saved_token) {
            console.log('same token');
            go = 0;
          } else {
            go = 2;
          }
        }
        if(go == 1) {
          // save token
          this.storage.setStorage(FCM_TOKEN, JSON.stringify(fcm_token));
           /*this.saveFcmToken(userId, JSON.stringify(fcm_token))
          .subscribe(
            (response) => {
              console.log('FCM Token saved successfully',response);

            },
            error => {
              console.error('Error saving FCM Token:', error);
            }
          ); */
        } else if(go == 2) {
          // update token
          const data = {
            expired_token: saved_token,
            refreshed_token: fcm_token
          };
          this.storage.setStorage(FCM_TOKEN, fcm_token);
         /* this.updateFcmToken(userId,JSON.stringify(saved_token),JSON.stringify(fcm_token))
          .subscribe(
            (response) => {
              console.log('FCM Token updated successfully',response);

            },
            error => {
              console.error('Error updating FCM Token:', error);
            });*/
        }else{
          this.storage.setStorage(FCM_TOKEN, fcm_token);

          /*this.saveFcmToken(userId, JSON.stringify(fcm_token))
          .subscribe(
            (response) => {
              console.log('FCM Token saved successfully',response);

            },
            error => {
              console.error('Error saving FCM Token:', error);
            }
          ); */
        }
      }
    );

    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('Error: ' + JSON.stringify(error));
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      async (notification: PushNotificationSchema) => {
        console.log('Push received: ' + JSON.stringify(notification));
        const data = notification?.data;
        if(data?.redirect) this._redirect.next(data?.redirect);
      }
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      async (notification:ActionPerformed) => {
        const data = notification.notification.data;
        console.log('Action performed: ' + JSON.stringify(notification.notification));
        console.log('push data: ', data);
        if(data?.redirect) this._redirect.next(data?.redirect);
      }
    );
  }

  async removeFcmToken() {
    try {
      const saved_token = JSON.parse((await this.storage.getStorage(FCM_TOKEN)).value);
      this.storage.removeStorage(saved_token);
    } catch(e) {
      console.log(e);
      throw(e);
    }

  }


  saveFcmToken(userId: number | null, notToken: string): Observable<any> {
    return this.http.post(NOT_API+`/saveNotToken/${userId}`, notToken);
  }

  updateFcmToken(userId: number | null, oldToken: string, newToken: string): Observable<any>{
    const requestBody = {
      oldToken: oldToken,
      newToken: newToken
    };

    return this.http.post<any>(NOT_API+`/updateNotToken/${userId}`, requestBody);
  }

  
}