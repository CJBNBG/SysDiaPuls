import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'einstellungen',
    loadChildren: () => import('./pages/einstellungen/einstellungen.module').then( m => m.EinstellungenPageModule)
  },
  {
    path: 'ueber',
    loadChildren: () => import('./pages/ueber/ueber.module').then( m => m.UeberPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
