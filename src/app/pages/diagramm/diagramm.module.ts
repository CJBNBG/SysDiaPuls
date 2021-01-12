import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiagrammPageRoutingModule } from './diagramm-routing.module';

import { DiagrammPage } from './diagramm.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DiagrammPageRoutingModule
  ],
  declarations: [DiagrammPage]
})
export class DiagrammPageModule {}
