import { Component, OnInit } from '@angular/core';
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
  thePath: any;
  theAppName: any;
  thePackageName: any;
  theVersionCode: any;
  theVersionNumber: any;
  myWidth: number = 0;
  myHeight: number = 0;

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
    await this.getVersionInfo();
    this.lblAppVersion = document.getElementById('txtAppVersion').getElementsByTagName('textarea')[0];

    if ( this.myWidth != 0 && this.myHeight != 0 ) {
      this.lblAppVersion.value = "Versionsnummer:\t" + this.theVersionNumber
                                + "\nVersionscode:\t\t" + this.theVersionCode
                                + "\nName der App:\t\t" + this.theAppName
                                + "\nPackagename:\t\t" + this.thePackageName
                                + "\nAnzeigeformat:\t\t" + this.myWidth.toString() + "x" + this.myHeight.toString();
      this.lblAppVersion.rows = "6";
    } else {
      this.lblAppVersion.value = "Versionsnummer:\t" + this.theVersionNumber
                                + "\nVersionscode:\t\t" + this.theVersionCode
                                + "\nName der App:\t\t" + this.theAppName
                                + "\nPackagename:\t\t" + this.thePackageName;
      this.lblAppVersion.rows = "5";
    }
    console.log(this.lblAppVersion.value);
  }
}
