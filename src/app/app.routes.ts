import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'login',
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
    path: 'detail-demande',
    loadComponent: () => import('./pages/demande/detail-demande/detail-demande.page').then( m => m.DetailDemandePage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'traitement',
    loadComponent: () => import('./pages/planning/traitement/traitement.page').then( m => m.TraitementPage)
  },
  {
    path: 'parametres',
    loadComponent: () => import('./pages/parametres/parametres.page').then( m => m.ParametresPage)
  },
];
