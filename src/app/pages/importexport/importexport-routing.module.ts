import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImportexportPage } from './importexport.page';

const routes: Routes = [
  {
    path: '',
    component: ImportexportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImportexportPageRoutingModule {}
