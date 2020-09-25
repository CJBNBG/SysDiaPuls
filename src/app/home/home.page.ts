import { Component } from '@angular/core';

import { AppVersion } from '@ionic-native/app-version/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  lblAppVersion: any;

  constructor(private appVersion: AppVersion) 
  {
  }

  GetAppName()
  {
    this.appVersion.getAppName().then((appname) => {
      alert( "App Name: " + appname );
    },
    (err) => {
      alert( JSON.stringify(err));
    })
  }

  GetPackageName()
  {
    this.appVersion.getPackageName().then((packagename) => {
      alert( "PACKAGE NAME: " + packagename );
    },
    (err) => {
      alert( JSON.stringify(err));
    })
  }

  GetVersionCode()
  {
    this.appVersion.getVersionCode().then((versioncode) => {
      alert( "Version Code: " + versioncode );
    },
    (err) => {
      alert( JSON.stringify(err));
    })
  }

  GetVersionNumber()
  {
    this.appVersion.getVersionNumber().then((versionnumber) => {
      alert( "Version Number: " + versionnumber );
    },
    (err) => {
      alert( JSON.stringify(err));
    })
  }

  AnzeigeTabelle() {
    console.log("Ansicht Tabelle");
  }

  AnzeigeDiagramm() {
    console.log("Ansicht Diagramm");
  }

  AnzeigeEinstellungen() {
    console.log("Ansicht Einstellung");
    this.GetVersionNumber();

    this.lblAppVersion = document.getElementById('txtAppVersion').getElementsByTagName('textarea')[0];
    this.appVersion.getVersionNumber().then((versionnumber) => {
      this.lblAppVersion.value = versionnumber;
    },
    (err) => {
      this.lblAppVersion.value = JSON.stringify(err);
    })
    console.log(this.lblAppVersion.value);
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
