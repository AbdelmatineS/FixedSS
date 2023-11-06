import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'demande',
    loadComponent: () => import('./pages/demande/demande.page').then( m => m.DemandePage)
  },
  {
    path: 'planning',
    loadComponent: () => import('./pages/planning/planning.page').then( m => m.PlanningPage)
  },
  {
    path: 'traitement',
    loadComponent: () => import('./pages/traitement/traitement.page').then( m => m.TraitementPage)
  },
  {
    path: 'detail-demande',
    loadComponent: () => import('./pages/demande/detail-demande/detail-demande.page').then( m => m.DetailDemandePage)
  },
];
