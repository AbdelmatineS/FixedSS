import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from "@angular/common/http";
import { register } from 'swiper/element/bundle';
import { EventsService } from './pages/planning/services/events.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgCalendarModule } from 'ionic7-calendar';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [

    FormsModule,
    IonicModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgCalendarModule
  ],
})
export class AppComponent {
  constructor(private eventsService: EventsService) {
    this.eventsService.init();
  }


}
