import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EinstellungenPageRoutingModule } from './einstellungen-routing.module';

import { EinstellungenPage } from './einstellungen.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    EinstellungenPageRoutingModule
  ],
  declarations: [EinstellungenPage]
})
export class EinstellungenPageModule {}
