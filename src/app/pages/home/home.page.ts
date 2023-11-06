import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class HomePage implements OnInit{
  items: any;

  constructor(    
    private router:Router,
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
  
        this.router.navigate(['/'+item.route])
  
    }
    
}
