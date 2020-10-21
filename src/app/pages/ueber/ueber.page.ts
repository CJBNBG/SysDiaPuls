import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppVersion } from '@ionic-native/app-version/ngx';

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

  constructor(private appVersion: AppVersion, private router: Router) {}

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

  GetAppName()
  {
    this.appVersion.getAppName().then((appname) => {
      this.theAppName = appname;
    }
/*    
    ,(err) => {
      alert( JSON.stringify(err));
    }
*/    
    )
  }

  GetPackageName()
  {
    this.appVersion.getPackageName().then((packagename) => {
      this.thePackageName = packagename;
    }
    /*    
        ,(err) => {
          alert( JSON.stringify(err));
        }
    */    
    )
  }

  GetVersionCode()
  {
    this.appVersion.getVersionCode().then((versioncode) => {
      this.theVersionCode = versioncode;
    }
    /*    
        ,(err) => {
          alert( JSON.stringify(err));
        }
    */    
    )
  }

  GetVersionNumber()
  {
    this.appVersion.getVersionNumber().then((versionnumber) => {
      this.theVersionNumber = versionnumber;
    }
    /*    
        ,(err) => {
          alert( JSON.stringify(err));
        }
    */    
    )
  }

  ngOnInit() {
  }

  ionViewWillEnter() { 

    this.GetVersionNumber();
    this.GetAppName();
    this.GetPackageName();
    this.GetVersionCode();

    this.lblAppVersion = document.getElementById('txtAppVersion').getElementsByTagName('textarea')[0];

    this.lblAppVersion.value = "Versionsnummer:\t" + this.theVersionNumber
                               + "\nVersionscode:\t\t" + this.theVersionCode
                               + "\nName der App:\t\t" + this.theAppName
                               + "\nPackagename:\t\t" + this.thePackageName
                               + "\nAusgabedatum:\t\t20.10.2020";
    
    console.log(this.lblAppVersion.value);

  }
}
