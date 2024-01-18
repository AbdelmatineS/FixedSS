import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, ModalController, NavController } from '@ionic/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DetailDemandePage } from './detail-demande/detail-demande.page';
import { SousTraitantService } from '../services/sous-traitant.service';
import { NavigationExtras, Router } from '@angular/router';
import { StorageService } from '../login/services/storage.service';

@Component({
  selector: 'app-demande',
  templateUrl: './demande.page.html',
  styleUrls: ['./demande.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule, 
    FormsModule,
    HttpClientModule
  ],
  providers:[SousTraitantService]
})
export class DemandePage implements OnInit {



  searchTerm: string | undefined;
  data: any = [];
  demandes: any = [];

  constructor(
    private storageService: StorageService,
    private modalCtrl: ModalController,
    private stService: SousTraitantService,
    private alertController: AlertController,
    private navCtrl: NavController,
    private router: Router

  ) { }

  ngOnInit() {
    this.getListDemandeByUser();
  }


  Search(){

  }

  goToEvents(demandeId: number, phone: number) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        id: demandeId,
        num: phone

      }
    };
    console.log(demandeId);
    this.router.navigate(['/planning'], navigationExtras);  
  }

  async callNumber(number: string) {
    const alert = await this.alertController.create({
      header: 'Confirmer l"appel',
      message: `Voulez vous appeler ce numéro: ${number}?`,
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: () => {
            console.log('Call canceled');
          }
        },
        {
          text: 'Appeler',
          handler: () => {
            window.open(`tel:${number}`, '_system');
          }
        }
      ]
    });
  
    await alert.present();
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.getListDemandeByUser();
      event.target.complete();
    }, 2000);
  }

  getListDemande(){
    this.stService.getAllDemandeinter().subscribe(data => {
      console.log(data);
      this.demandes = data;
    })
  }

  getListDemandeByUser(){
    const userId = this.storageService.getUserId();

    this.stService.getAllDemandeinterByUser(userId).subscribe(data => {
      console.log(data);
      this.demandes = data;
    })
    
  }

  loadMore($event: Event) {
    throw new Error('Method not implemented.');
    }

    
    async openDetails(itemDetails: any) {
      const modal = await this.modalCtrl.create({
        component: DetailDemandePage,
        componentProps: {
          itemDetails: itemDetails,
        },
      });
      await modal.present();
    }

}
