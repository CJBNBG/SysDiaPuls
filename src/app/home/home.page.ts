import { Component } from '@angular/core';
import { Router } from '@angular/router';

//import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  thePath: any;

  constructor(private router: Router )  //, private screenOrientation: ScreenOrientation) 
  {
  }

  ionViewWillEnter() {
    //this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
  }

  AnzeigeTabelle() {
    console.log("Ansicht Tabelle");
  }

  AnzeigeDiagramm() {
    console.log("Ansicht Diagramm");
  }

  AnzeigeEinstellungen() {
    this.thePath = ['./einstellungen'];
    console.log('Aufruf - ' + this.thePath);
    this.router.navigate(this.thePath);
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
