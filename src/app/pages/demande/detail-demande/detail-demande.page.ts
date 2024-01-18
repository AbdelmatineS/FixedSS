import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-detail-demande',
  templateUrl: './detail-demande.page.html',
  styleUrls: ['./detail-demande.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,HttpClientModule]
})
export class DetailDemandePage implements OnInit {

  @Input() itemDetails: any;
  cgps: string = "" ;
  constructor(
    private modalCtrl: ModalController,
    private router: Router
    ) { }

  ngOnInit() {
    this.cgps= this.itemDetails.latitude + " ," + this.itemDetails.longitude;
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
    this.modalCtrl.dismiss(null, 'cancel');
    this.router.navigate(['/planning'], navigationExtras);  
  }

  getStatusCircleStyle(status: string, targetStatus: string): any {
    let circleColor: string = ''; // Define default color or logic based on status

    // Set circleColor based on status and targetStatus
    // Add your logic here to determine circleColor based on the status and targetStatus

    return {
      'width': '20px',
      'height': '20px',
      'border-radius': '50%',
      'background-color': circleColor // Set the determined color here
    };
  }

}
