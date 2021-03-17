import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImportexportPageRoutingModule } from './importexport-routing.module';

import { ImportexportPage } from './importexport.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImportexportPageRoutingModule
  ],
  declarations: [ImportexportPage]
})
export class ImportexportPageModule {}
