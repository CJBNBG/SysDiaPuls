import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EinstellungenPageRoutingModule } from './einstellungen-routing.module';

import { EinstellungenPage } from './einstellungen.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EinstellungenPageRoutingModule
  ],
  declarations: [EinstellungenPage]
})
export class EinstellungenPageModule {}
