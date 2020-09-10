import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor() {}

  AnzeigeTabelle() {
    console.log("Ansicht Tabelle");
  }

  AnzeigeDiagramm() {
    console.log("Ansicht Diagramm");
  }

  AnzeigeEinstellungen() {
    console.log("Ansicht Einstellung");
  }

  AnzeigeUmschalten( xValue: string ) {
    switch ( xValue ) {
      case 'Tabelle':
        this.AnzeigeTabelle();
        break;

      case 'Diagramm':
        this.AnzeigeDiagramm();
        break;

        case 'Einstellung':
          this.AnzeigeEinstellungen();
          break;
  
        default:
        console.log("Ansicht unklar");
        break;
    }
  }
}
