import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DbService, DataInterface } from '../services/db.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  lblStatus: any;
  thePath: any;
  records: DataInterface[] = [];

  constructor(
    private router: Router,
    private dbService: DbService,
    public alertController: AlertController,
  ) {

  }

  ionViewWillLeave() {
    console.log("HomePage: ionViewWillLeave");
  }

  ionViewWillEnter() {
    console.log("HomePage: ionViewWillEnter");
  }

  ionViewDidLeave() {
    console.log("HomePage: ionViewDidLeave");
  }

  ionViewWillUnload() {
    console.log("HomePage: ionViewWillUnload");
  }

  ionViewDidLoad() {
    console.log("HomePage: ionViewDidLoad");
  }

  ionViewDidEnter() {
    console.log("HomePage: ionViewDidEnter");
    this.dbService.getAllRecords().then(data => this.records = data);
  }

  zufall (min: number, max: number): number {
    return (Math.floor(Math.random() * (max - min + 1)) + min);
  }

  zufall_x (min: number, max: number, stellen: number): number {
    return parseFloat((Math.random() * (max - min + 1) + min).toFixed(stellen));
  }

  isValidDate(d: any): boolean {
    return d instanceof Date && !isNaN(d.getTime()) && !isNaN(d.getDate());
  }

  async presentAlertConfirm() {
    const msg: string = "Sie können die bestehenden Einträge in der Datenbank entweder nur löschen oder durch Zufallseinträge ersetzen."
                        + "<br><br><strong>Wollen Sie das?</strong></br></br>"
                        + "Mit 'Abbrechen' bleibt alles unverändert."
                        + "<br>Mit 'Nur Löschen' werden alle bestehenden Einträge gelöscht.</br>"
                        + "<br>Mit 'Zufallseinträge' werden alle bestehenden Einträge gelöscht und 10 neue Einträge mit zufälligem Inhalt eingetragen.</br>";
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'ACHTUNG!',
      message: msg,
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Aktion abgebrochen');
          }
        }, {
          text: 'Zufallseinträge',
          handler: () => {
            this.ErgaenzeTestdaten();
            console.log('Zufallseinträge erstellen');
          }
        }, {
          text: 'Nur Löschen',
          handler: () => {
            this.dbService.deleteAllRecords();
            console.log('Datensätze löschen');
          }
        }
      ]
    });
    await alert.present();
  }

  async ErgaenzeTestdaten() {
    await this.dbService.deleteAllRecords();
    var min_systole: number  = 100;
    var max_systole: number = 200;
    var min_diastole: number = 75;
    var max_diastole: number = 120;
    var min_puls: number = 60;
    var max_puls: number = 90;
    var min_gewicht: number = 75;
    var max_gewicht: number = 81;
    for(var i = 1; i <= 10; i++) {
      var tag_und_zeit: Date;
      var cnt: number = 0;
      do {
        tag_und_zeit = new Date(this.zufall(2018,2021) + "-" + this.zufall(1,12) + "-" + this.zufall(1,31) + " " + this.zufall(0,23) + ":" + this.zufall(0,59) + ":" + this.zufall(0,59));
        cnt++;
      } while (!this.isValidDate(tag_und_zeit) && cnt < 100);

      await this.dbService.addKomplett( this.dbService.dateFormatted(tag_und_zeit)
                                ,this.zufall(min_systole,max_systole)
                                ,this.zufall(min_diastole,max_diastole)
                                ,this.zufall(min_puls,max_puls)
                                ,this.zufall_x(min_gewicht,max_gewicht, 1)
                                ,"Testeintrag");
      console.log("Zeitpunkt: " + this.dbService.dateFormatted(tag_und_zeit));
    }
    console.log("Testdaten erzeugt");
  }

  AnzeigeTabelle() {
    this.thePath = ['./tabelle'];
    console.log('HomePage: Aufruf - ' + this.thePath);
    this.router.navigate(this.thePath);
  }

  AnzeigeDiagramm() {
    this.thePath = ['./diagramm'];
    console.log('HomePage: Aufruf - ' + this.thePath);
    this.router.navigate(this.thePath);
  }

  AnzeigeEinstellungen() {
    this.thePath = ['./einstellungen'];
    console.log('HomePage: Aufruf - ' + this.thePath);
    this.router.navigate(this.thePath);
  }

  goInfo() {
    this.thePath = ['./ueber'];
    console.log('HomePage: Aufruf - ' + this.thePath);
    this.router.navigate(this.thePath);
  }
}
