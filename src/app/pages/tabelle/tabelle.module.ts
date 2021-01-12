import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabellePageRoutingModule } from './tabelle-routing.module';

import { TabellePage } from './tabelle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabellePageRoutingModule
  ],
  declarations: [TabellePage]
})
export class TabellePageModule {}
