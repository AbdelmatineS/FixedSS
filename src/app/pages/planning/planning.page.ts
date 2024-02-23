import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, IonModal, IonRouterOutlet, ModalController, NavController } from '@ionic/angular';
import { CalendarComponent, CalendarMode, NgCalendarModule } from 'ionic7-calendar';
import { HttpClient } from '@angular/common/http';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr'
import { CalEvent, EventsService } from './services/events.service';
import { format, parseISO } from 'date-fns';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailDemandePage } from '../demande/detail-demande/detail-demande.page';
import { catchError, of, switchMap, tap } from 'rxjs';
import { SousTraitantService } from '../services/sous-traitant.service';
import { TraitementPage } from './traitement/traitement.page';
registerLocaleData(localeFr, 'fr');

@Component({
  selector: 'app-planning',
  templateUrl: './planning.page.html',
  styleUrls: ['./planning.page.scss'],
  standalone: true,
  providers:[EventsService,SousTraitantService],
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
  num: string= "";

  calendar = {
    mode: "month" as CalendarMode,
    currentDate: new Date(),
  }

  viewTitle = '';
  eventSource: any[] = [];

  @ViewChild(CalendarComponent) myCal!: CalendarComponent; 
  @ViewChild('modal') modal!: IonModal;
  presentingElement:any = null;

  newEvent: any = {
    id: this.demandeId,
    title: this.num,
    allDay: false,
    startTime: null,
    endTime: null
  };

  showStart = false;
  showEnd = false;

  formatedStart = '';
  formatedEnd = '';

  constructor(
    private alertController: AlertController,

    private modalCtrl: ModalController,
    private dService: SousTraitantService,
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
      this.num = params['num'];
    });
    console.log(this.demandeId);
    console.log(this.num);
    console.log(this.newEvent);



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
    const selected = new Date(ev.selectedTime);

    this.formatedStart = format(ev.selectedTime, 'HH:mm, MMM d, yyyy');
    this.newEvent.startTime = format(ev.selectedTime, "yyyy-MM-dd'T'HH:mm:ss");

     const later = ev.selectedTime.setHours(ev.selectedTime.getHours() + 1);
    this.formatedEnd = format(later, 'HH:mm, MMM d, yyyy');
    //    this.formatedEnd = format(later, 'd MMM, H:mm a');

    this.newEvent.endTime = format(later, "yyyy-MM-dd'T'HH:mm:ss");
    if (this.calendar.mode === 'day' || this.calendar.mode === 'week'){
      this.modal.present();
    }
  }

 


   async scheduleEvent(){

    const toAdd: CalEvent = {
      title: this.newEvent.title,
      startTime: new Date(this.newEvent.startTime),
      endTime: new Date(this.newEvent.endTime),
      allDay: this.newEvent.allDay,
      id: this.demandeId,
    }

      const loading = await this.presentLoading('En cours d\'informer le client du date planifiée...');
  
      
      this.dService.updateDatePlanif(toAdd.id, this.newEvent.startTime)
      .subscribe(
        response => {
          // Handle successful response
          console.log('DatePlanif updated:', response);
          loading.dismiss();
          this.eventSource.push(toAdd);
          this.myCal.loadEvents();
          this.eventsService.addData(toAdd);
          this.presentSuccessAlert('La date est bien fixée');
        },
        error => {
          loading.dismiss();
          this.presentErrorAlert('Vous n\'avez séléctionner aucune demande à planifiée ');
          console.error('Error updating DatePlanif:', error);
        }
      );
      
      

  


    this.newEvent = {

      id:null,
      title: this.num,
      allDay: false,
      startTime: null,
      endTime: null,
    };

    this.modal.dismiss();
    }



    onEventSelected(event: any){
      console.log('Event selected:', event);
      this.openDetails(event);
    }

  startChanged(value: any){
    this.newEvent.startTime = value;
    this.formatedStart = format(parseISO(value), 'HH:mm, MMM d, yyyy');
    //    this.formatedStart = format(parseISO(value), 'd MMM, H:mm a');

  }

  updateDatePlanif(demandeId: number | null, newDatePlanif: string) {

  }

    endChanged(value: any){
    this.newEvent.endTime = value;
    this.formatedEnd = format(parseISO(value), 'HH:mm, MMM d, yyyy');
  }  



  async openDetails(event: any) {
    const loadingAlert = await this.presentLoading('Récupération des données...'); // Show loading spinner for login

    this.dService.retrieveDemandeInterById(event.id)
      .subscribe(
        async (data) => {
          loadingAlert.dismiss(); // Dismiss loading spinner
          console.log('Retrieved demande:', data);
          const modal = await this.modalCtrl.create({
            component: TraitementPage,
            componentProps: {
              itemDetails: data,
            },
          });
          await modal.present();
        },
        (error) => {
          loadingAlert.dismiss(); // Dismiss loading spinner

          this.presentErrorAlert(error.error.message); // Show error alert with message    
          console.error('Error retrieving demande:', error);
        }
      );

  }


  async presentSuccessAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Success',
      message: message,
    });
    await alert.present();
    
     setTimeout(() => {
       alert.dismiss();
     }, 1000);
  }
  
  async presentErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentLoading(message: string) {
    const loading = await this.alertController.create({
      message: message,
      translucent: true,
      backdropDismiss: false,
      //spinner: 'crescent'
    });
    await loading.present();
    return loading;
  }

}
