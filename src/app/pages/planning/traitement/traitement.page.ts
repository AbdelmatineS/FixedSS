import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertController, IonicModule, LoadingController, ModalController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { TraitementService } from '../../services/traitement/traitement.service';
import { StorageService } from '../../login/services/storage.service';

@Component({
  selector: 'app-traitement',
  templateUrl: './traitement.page.html',
  styleUrls: ['./traitement.page.scss'],
  standalone: true,
  providers: [TraitementService],
  imports: [
    ReactiveFormsModule,
    IonicModule, 
    CommonModule, 
    FormsModule],

})
export class TraitementPage implements OnInit {


ficheInt: FormGroup;

  
  photoTaken: boolean = false;
  ImageSource:any;

  @Input() itemDetails: any;
  cgps: string = "" ;
  constructor(
    private traitementService: TraitementService,
    private storageService: StorageService,
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router
    ) {
      this.ficheInt = this.formBuilder.group({
        action: ['', Validators.required],
        raison: [''],
        imagePvInter: [''],
        snswap: [''],
        commentaire: ['', Validators.required]
      });

      this.ficheInt.get('action')!.valueChanges.subscribe(selectedAction => {
        this.handleActionChange(selectedAction);
      });

     }

  ngOnInit() {
    this.cgps= this.itemDetails.reservation.latitude + "," + this.itemDetails.reservation.longitude;
    console.log(this.cgps);
  }


  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source:CameraSource.Camera
    });
    const validImages = image.base64String;
    this.ImageSource=`data:image/jpeg;base64,${image.base64String}`
    this.ficheInt.get('imagePvInter')!.patchValue(validImages); // Set the form control value

    //console.log(this.ficheInt.get('imagePvInter')!.value);
    
    this.photoTaken = true;
    this.ficheInt.get('imagePvInter')!.markAsTouched();

  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }


  goToEvents(demandeId: number, prenom: string) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        id: demandeId,
        prenom: prenom

      }
    };
    console.log(demandeId);
    this.router.navigate(['/planning'], navigationExtras);  
  }


  handleActionChange(selectedAction: string) {
    if (selectedAction === 'SUCCESS') {
      this.ficheInt.get('raison')!.reset();
    }
  }

  async onSubmit(){
    this.ConfirmationFormSubmitAlert('Confirmation', 'Etes-vous sur de vouloir confirmer ?');
  }

  async ConfirmationFormSubmitAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: [      
        {
        text: 'Annuler',
        role: 'cancel',
        handler: () => {
          this.ficheInt.reset();
        }
      },
      {
        text: 'modifier',
        role: 'cancel',
        handler: () => {
        }
      },
      {
        text: 'Confirmer',
        handler: () => {
          this.submitForm();
        }
      }]
    });
    await alert.present();
  }


  async submitForm() {
    const loading = await this.loadingCtrl.create({
      message: 'Veuillez patienter ...',
    });
    await loading.present();
    const userId = this.storageService.getUserId();
    const demandeId = this.itemDetails.id;
    const formData = this.ficheInt.value;

    this.traitementService.addDateFicheinter(userId,demandeId,formData)
      .subscribe(
        (response) => {
          loading.dismiss();
          this.ficheInt.reset();
          this.ImageSource = null;
          this.presentAlert('Succès', 'Votre fiche d"intervention a été enregistré avec succès.');
          console.log('Form submitted successfully');
        },
        (error) => {
          loading.dismiss();
          this.presentAlert('Erreur', 'Échec de l"enregistrement des données dans la base de données. Veuillez réessayer plus tard.');
          console.error('Error submitting form:', error);
          this.ficheInt.reset();
          this.ImageSource = null;
        }
      );
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: [      
        {
        text: 'Confirmer',
        handler: () => {
          this.modalCtrl.dismiss(null, 'cancel');
          this.gotoHome();
        }
      }]
    });
    await alert.present();

  }

  gotoHome() {
    this.ficheInt.reset();
    this.router.navigate(['/home']);
  }
/* 
  getStatusCircleStyle(status: string, targetStatus: string): any {
    let circleColor: string = ''; // Define default color or logic based on status


    return {
      'width': '20px',
      'height': '20px',
      'border-radius': '50%',
      'background-color': circleColor // Set the determined color here
    };
  } */

}
