import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EinstellungenPage } from './einstellungen.page';

const routes: Routes = [
  {
    path: '',
    component: EinstellungenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EinstellungenPageRoutingModule {}
