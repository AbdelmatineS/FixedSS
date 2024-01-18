import { Component } from '@angular/core';
import { IonicModule, Platform } from '@ionic/angular';
import { HttpClientModule } from "@angular/common/http";
import { register } from 'swiper/element/bundle';
import { EventsService } from './pages/planning/services/events.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgCalendarModule } from 'ionic7-calendar';
import { IonicStorageModule } from '@ionic/storage-angular';
import { FcmService } from './pages/services/fcm/fcm.service';
import { StorageService } from './pages/login/services/storage.service';
import { ActionPerformed, PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonicStorageModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgCalendarModule
  ],
})
export class AppComponent {
  constructor(
    private eventsService: EventsService,
    private platform: Platform,
    private fcm: FcmService,
    private storage: StorageService,
    ) {

    this.eventsService.init();

    this.platform.ready().then(() => {
      this.fcm.initPush();
    }).catch(e => {
      console.log('error fcm: ', e);
    });
  }


}
