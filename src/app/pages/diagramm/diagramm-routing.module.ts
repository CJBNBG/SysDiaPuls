import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiagrammPage } from './diagramm.page';

const routes: Routes = [
  {
    path: '',
    component: DiagrammPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiagrammPageRoutingModule {}
