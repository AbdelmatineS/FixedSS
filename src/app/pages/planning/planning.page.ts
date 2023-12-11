import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonModal, IonRouterOutlet, NavController } from '@ionic/angular';
import { CalendarComponent, CalendarMode, NgCalendarModule } from 'ionic7-calendar';
import { HttpClient } from '@angular/common/http';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr'
import { CalEvent, EventsService } from './services/events.service';
import { format, parseISO } from 'date-fns';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
registerLocaleData(localeFr, 'fr');

@Component({
  selector: 'app-planning',
  templateUrl: './planning.page.html',
  styleUrls: ['./planning.page.scss'],
  standalone: true,
  providers:[EventsService],
  imports: [
    IonicModule, 
    FormsModule,
    NgCalendarModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]


})
export class PlanningPage implements OnInit {

  demandeId: number | null = null; // Initialize it to null or a default value


  calendar = {
    mode: 'month' as CalendarMode,
    currentDate: new Date(),
  }

  viewTitle = '';
  eventSource: any[] = [];

  @ViewChild(CalendarComponent) myCal!: CalendarComponent; 
  @ViewChild('modal') modal!: IonModal;
  presentingElement:any = null;

  newEvent: any = {
    title: '',
    allDay: false,
    startTime: null,
    endTime: null
  };

  showStart = false;
  showEnd = false;

  formatedStart = '';
  formatedEnd = '';

  constructor(
    private ionRouterOutler: IonRouterOutlet,
    private http: HttpClient,
    private eventsService: EventsService,
    private route: ActivatedRoute,
    private router:Router, 



  ) {
    this.presentingElement = ionRouterOutler.nativeEl;
   }



  async ngOnInit() {
    this.eventSource = await this.eventsService.getData();


    this.route.queryParams.subscribe(params => {
      this.demandeId = params['id'];
    });
    console.log(this.demandeId);


    }

  setToday(){
    this.myCal.currentDate = new Date();
  }

  calendarForward(){
    this.myCal.slideNext();
  }

  calendarBack(){
    this.myCal.slidePrev();
  }

  onTimeSelected(ev: {selectedTime: Date; events: any[]}){


    this.formatedStart = format(ev.selectedTime, 'd MMM, H:mm a');
    this.newEvent.startTime = format(ev.selectedTime, "yyyy-MM-dd'T'HH:mm:ss");

     const later = ev.selectedTime.setHours(ev.selectedTime.getHours() + 1);
    this.formatedEnd = format(later, 'd MMM, H:mm a');
    this.newEvent.endTime = format(later, "yyyy-MM-dd'T'HH:mm:ss");
 
    if (this.calendar.mode === 'day' || this.calendar.mode === 'week'){
      this.modal.present();
    }
  }

 


  scheduleEvent(){

    const toAdd: CalEvent = {
      title: this.newEvent.title,
      startTime: new Date(this.newEvent.startTime),
      endTime: new Date(this.newEvent.endTime),
      allDay: this.newEvent.allDay,
    }

    this.eventSource.push(toAdd);
    this.myCal.loadEvents();
    this.eventsService.addData(toAdd);

    this.newEvent = {
      title: '',
      allDay: false,
      startTime: null,
      endTime: null,
    };

    this.modal.dismiss();
    }

    onEventSelected(event: any){
      console.log('Event selected:', event);
    }

  startChanged(value: any){
    this.newEvent.startTime = value;
    this.formatedStart = format(parseISO(value), 'd MMM, H:mm a');
  }

   endChanged(value: any){
    this.newEvent.endTime = value;
    this.formatedEnd = format(parseISO(value), 'd MMM, H:mm a');
  } 

}
