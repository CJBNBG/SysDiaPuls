import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-ueber',
  templateUrl: './ueber.page.html',
  styleUrls: ['./ueber.page.scss'],
})
export class UeberPage implements OnInit {

  lblAppVersion: any;
  public btnText = "weitere Details anzeigen";
  thePath: any;
  theAppName: any;
  thePackageName: any;
  theVersionCode: any;
  theVersionNumber: any;
  myWidth: number = 0;
  myHeight: number = 0;
  showDetails: boolean = false;

  constructor(private appVersion: AppVersion, 
              private router: Router,
              platform: Platform) {
    platform.ready().then(() => {
      this.myWidth = platform.width();
      this.myHeight = platform.height();
    });
  }

  goHome() {
    this.thePath = ['home'];
    console.log('Aufruf - ' + this.thePath);
    this.router.navigate(this.thePath);
  }

  AnzeigeEinstellungen() {
    this.thePath = ['./einstellungen'];
    console.log('Aufruf - ' + this.thePath);
    this.router.navigate(this.thePath);
  }

  async GetAppName()
  {
    return await this.appVersion.getAppName();
  }

  async GetPackageName()
  {
    return await this.appVersion.getPackageName();
  }

  async GetVersionCode()
  {
    return await this.appVersion.getVersionCode();
  }

  async GetVersionNumber()
  {
    return await this.appVersion.getVersionNumber();
  }

  async getVersionInfo() {
    this.theVersionNumber = await this.GetVersionNumber();
    this.theAppName = await this.GetAppName();
    this.thePackageName = await this.GetPackageName();
    this.theVersionCode = await this.GetVersionCode();
  }

  ngOnInit() {
    this.getVersionInfo();
  }

  async AnzeigeDetails() {
    this.lblAppVersion = document.getElementById('txtAppVersion').getElementsByTagName('textarea')[0];
    if ( this.showDetails === false ) {
      await this.getVersionInfo();
  
      let strZeilen: string = "5";
      let strAusgabe: string = "Versionsnummer:\t" + this.theVersionNumber
      + "\nVersionscode:\t\t" + this.theVersionCode
      + "\nName der App:\t\t" + this.theAppName
      + "\nPackagename:\t\t" + this.thePackageName;
      if ( this.myWidth != 0 && this.myHeight != 0 ) {
        strAusgabe += "\nAnzeigeformat:\t\t" + this.myWidth.toString() + "x" + this.myHeight.toString();
        strZeilen = "6";
      } else {
        strZeilen = "5";
      }
      this.lblAppVersion.value = strAusgabe;
      this.lblAppVersion.rows = strZeilen;
      this.btnText = "weitere Details verstecken";
      console.log(this.lblAppVersion.value);
      this.showDetails = true;
    } else {
      this.lblAppVersion.value = "";
      this.lblAppVersion.rows = "0";
      this.btnText = "weitere Details anzeigen";
      this.showDetails = false;
    }
  }

  showOptimal() {
    return "optimal";
  }
  showNormal() {
    return "normal";
  }
  showHochnormal() {
    return "hochnormal";
  }
  showStufe1() {
    return "stufe1";
  }
  showStufe2() {
    return "stufe2";
  }
  showStufe3() {
    return "stufe3";
  }
  showPulsLangsam() {
    return "puls_langsam";
  }
  showPulsNormal() {
    return "puls_normal";
  }
  showPulsSchnell() {
    return "puls_schnell";
  }
  showGewichtNormal() {
    return "gew_normal";
  }
}
