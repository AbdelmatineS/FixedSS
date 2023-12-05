import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonicModule, NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../login/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [AuthService],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class HomePage implements OnInit{
  items: any;

  constructor(    
    private router:Router,
    private authService: AuthService,
    private alertController: AlertController,
    private navCtrl: NavController


    ) {}

    ngOnInit() {

      this.items=[
        {
    
          img: 'assets/images/demande.png',
          name: 'Demandes interventions',
          route: 'demande'
    
        },
        {
    
          img: 'assets/images/reserv.png',
          name: 'planning interventions',
          route: 'planning'
    
    
        },    {
    
          img: 'assets/images/reg.png',
          name: 'Traitements & interventions',
          route: 'traitement'
    
    
        }
      
      ]
  
    }
  
  
    goto(item: { route: string; }){
  
       // this.router.navigate(['/'+item.route])
       this.navCtrl.navigateRoot('/'+item.route); // Navigate to login page

    }

    async onLogout() {
      const loadingAlert = await this.presentLoading(); // Show loading spinner for logout
  
      this.authService.logout().subscribe(
        () => {
          loadingAlert.dismiss(); // Dismiss loading spinner
          this.navCtrl.navigateRoot('/login'); // Navigate to login page
        },
        error => {
          loadingAlert.dismiss(); // Dismiss loading spinner
          // Handle error if logout fails
          this.presentErrorAlert('Logout failed'); // Show error alert
        }
      );
    }


    async presentLoading() {
      const loading = await this.alertController.create({
        message: 'Logging out...',
        translucent: true,
        backdropDismiss: false,
      });
      await loading.present();
      return loading;
    }
  
    async presentErrorAlert(message: string) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: message,
        buttons: ['OK']
      });
      await alert.present();
    }
    
}
