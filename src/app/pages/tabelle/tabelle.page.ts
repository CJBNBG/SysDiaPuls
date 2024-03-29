import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DbService, DataInterface } from '../../services/db.service';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-tabelle',
  templateUrl: './tabelle.page.html',
  styleUrls: ['./tabelle.page.scss'],
})

export class TabellePage implements OnInit {

  lblStatus: any;
  txtButtontext: string = ':-)';
  thePath: any;
  rec_count: string;
  records: DataInterface[] = null;
  myWidth: number = 0;
  myHeight: number = 0;

  constructor(private storage: Storage,
    private router: Router, 
    private dbService: DbService,
    public alertController: AlertController,
    platform: Platform) {
      platform.ready().then(() => {
        this.myWidth = platform.width();
        this.myHeight = platform.height();
      });
  }

  myScreenFormat() {
    if ( this.myWidth < 576 ) {
      return "smaller";
    } else if ( this.myWidth>=576 && this.myWidth<768 ) {
      return "small";
    } else if ( this.myWidth>=768 && this.myWidth<992 ) {
      return "small";
      // return "medium";
    } else if ( this.myWidth>=992 && this.myWidth<1200 ) {
      return "small";
      // return "large";
    } else {
      return "small";
      // return "larger";
    }
  }

  myUebZeit() {
    let Erg: string = "row-Zeit_Ueb";
    return Erg;
  }
  myUebWerte() {
    return "row-Werte_Ueb";
  }
  myUebBem() {
    return "row-Bem_Ueb";
  }
  myUebButton() {
    return "row-Button_Ueb";
  }

  myZeitpunktFormat(record: DataInterface) {
    let Erg: string = "row-Zeitpunkt_";
    return Erg + this.myScreenFormat();
  }

  mySystoleFormat(record: DataInterface) {
    let Erg: string = "row-Werte_";
    if ( record.Systole<120 ) {
      Erg += "optimal";
    } else if ( record.Systole>=120 && record.Systole<130 ) {
      Erg += "normal";
    } else if ( record.Systole>=130 && record.Systole<140 ) {
      Erg += "hochnormal";
    } else if ( record.Systole>=140 && record.Systole<160 ) {
      Erg += "stufe1";
    } else if ( record.Systole>=160 && record.Systole<180 ) {
      Erg += "stufe2";
    } else {
      Erg += "stufe3";
    }
    return Erg + "_" + this.myScreenFormat();
  }

  myDiastoleFormat(record: DataInterface) {
    let Erg: string = "row-Werte_";
    if ( record.Diastole<80 ) {
      Erg += "optimal";
    } else if ( record.Diastole>=80 && record.Diastole<85 ) {
      Erg += "normal";
    } else if ( record.Diastole>=85 && record.Diastole<90 ) {
      Erg += "hochnormal";
    } else if ( record.Diastole>=90 && record.Diastole<100 ) {
      Erg += "stufe1";
    } else if ( record.Diastole>=100 && record.Diastole<110 ) {
      Erg += "stufe2";
    } else {
      Erg += "stufe3";
    }
    return Erg + "_" + this.myScreenFormat();
  }

  myPulsFormat(record: DataInterface) {
    let Erg: string = "row-Werte_";
    if ( record.Puls>0 && record.Puls<60 ) {
      Erg += "puls_langsam";
    } else if ( record.Puls>=60 && record.Puls<=100 ) {
      Erg += "puls_normal";
    } else if ( record.Puls>100 ) {
      Erg += "puls_schnell";
    }
    return Erg + "_" + this.myScreenFormat();
  }

  myGewichtFormat(record: DataInterface) {
    let Erg: string = "row-Werte_";
    if ( record.Gewicht>0.0 ) {
      Erg += "gew_normal";
    }
    return Erg + "_" + this.myScreenFormat();
  }

  myBemerkungFormat(record: DataInterface) {
    let Erg: string = "row-Werte_Bem_";
    return Erg + this.myScreenFormat();
  }

  ionViewDidEnter() {
    console.log("TabellePage: ionViewDidEnter");
  }

  ionViewWillLeave() {
    console.log("TabellePage: ionViewWillLeave");
  }

  ionViewWillEnter() {
    console.log("TabellePage: ionViewWillEnter");
    this.records = [];
    this.doInit100();
  }

  ionViewDidLeave() {
    console.log("TabellePage: ionViewDidLeave");
  }

  ionViewWillUnload() {
    console.log("TabellePage: ionViewWillUnload");
  }

  ionViewDidLoad() {
    console.log("TabellePage: ionViewDidLoad");
  }

  goInfo() {
    this.thePath = ['./ueber'];
    console.log('HomePage: Aufruf - ' + this.thePath);
    this.router.navigate(this.thePath);
  }

  goHome() {
    this.thePath = ['home'];
    console.log('TabellePage: Aufruf - ' + this.thePath);
    this.router.navigate(this.thePath);
  }

  AnzeigeEinstellungen() {
    this.thePath = ['./einstellungen'];
    console.log('TabellePage: Aufruf - ' + this.thePath);
    this.router.navigate(this.thePath);
  }
  
  async AnzeigeDetails(rec: DataInterface) {
    await this.storage.clear();
    await this.storage.set('ID', rec.pid.toString());
    await this.storage.set('Zeitpunkt', rec.Zeitpunkt.toString());
    await this.storage.set('Systole', rec.Systole.toString());
    await this.storage.set('Diastole', rec.Diastole.toString());
    if ( rec.Puls !== null ) {
      await this.storage.set('Puls', rec.Puls.toString());
    } else {
      await this.storage.set('Puls', "");
    }
    if ( rec.Gewicht !== null ) {
      await this.storage.set('Gewicht', rec.Gewicht.toString());
    } else {
      await this.storage.set('Gewicht', "");
    }
    await this.storage.set('Bemerkung', rec.Bemerkung.toString());
    console.log("Aufruf des Detail-Formulars...");
    await this.router.navigate(['./detail']);
    console.log("...erfolgt");
  }

  async presentAlertConfirm(rec: DataInterface) {
    const alert = await this.alertController.create({
      cssClass: 'my-alert-class',
      header: 'Bestätigung',
      message: 'Eintrag löschen? (ID=' + rec.pid + ')<br><br><strong>' + rec.dt_formatiert + '</strong>',
      buttons: [
        {
          text: 'Nein',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Datensatz nicht löschen');
          }
        }, {
          text: 'Ja',
          handler: () => {
            this.EntferneDetails(rec);
            console.log('Datensatz löschen');
          }
        }
      ]
    });
    await alert.present();
  }

  async EntferneDetails(rec: DataInterface) {
    await this.dbService.deleteRecord(rec.pid);
    this.records = [];
    this.doInit100();
  }

  async AnzeigeNeu() {
    await this.storage.set('ID', -1);
    await this.storage.set('Zeitpunkt', new Date().toISOString());
    await this.storage.set('Systole', 120);
    await this.storage.set('Diastole', 80);
    await this.storage.set('Puls', null);
    await this.storage.set('Gewicht', null);
    await this.storage.set('Bemerkung', "");
    await this.router.navigate(['./detail']);
  }

  async doButton() {
    this.lblStatus = document.getElementById('txtAnzDSe').getElementsByTagName('textarea')[0];
    if ( this.txtButtontext === 'alle anzeigen' ) {
      this.records = await this.dbService.getAllRecords();
      let Anz: number;
      await this.dbService.getTabEntryCount()
      .then(val => Anz = val)
      .catch(e => console.log(e));
      this.txtButtontext = "letzte " + Anz + " anzeigen";
     } else {
      this.records = await this.dbService.get100Records();
      this.txtButtontext = "alle anzeigen";
     }
     this.rec_count = this.records.length.toString();
     if ( this.rec_count === '0' ) {
      this.lblStatus.value = 'keine Einträge';
    } else if ( this.rec_count === '1' ) {
      this.lblStatus.value = this.rec_count + ' Eintrag';
    } else {
      this.lblStatus.value = this.rec_count + ' Einträge';
    }
  }

  async doInit100() {
    this.txtButtontext = "alle anzeigen"
    this.records = await this.dbService.get100Records();
    this.rec_count = this.records.length.toString();

    this.lblStatus = document.getElementById('txtAnzDSe').getElementsByTagName('textarea')[0];
    if ( this.rec_count === '0' ) {
      this.lblStatus.value = 'keine Einträge';
    } else if ( this.rec_count === '1' ) {
      this.lblStatus.value = this.rec_count + ' Eintrag';
    } else {
      this.lblStatus.value = this.rec_count + ' Einträge';
    }
  }

  ngOnInit() {
    console.log("TabellePage: ngOnInit");
    this.records = [];
    this.doInit100();
  }
}
