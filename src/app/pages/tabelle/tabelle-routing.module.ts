import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabellePage } from './tabelle.page';

const routes: Routes = [
  {
    path: '',
    component: TabellePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabellePageRoutingModule {}
