import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DbService, DataInterface, SettingsInterface } from '../../services/db.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-einstellungen',
  templateUrl: './einstellungen.page.html',
  styleUrls: ['./einstellungen.page.scss'],
})
export class EinstellungenPage implements OnInit {

  thePath: any;
  txtAnzahl: any;
  myWidth: number = 0;
  myHeight: number = 0;

  constructor(private dbService: DbService,
    private router: Router,
    platform: Platform) {
      platform.ready().then(() => {
        this.myWidth = platform.width();
        this.myHeight = platform.height();
        console.log('Einstellungen - Breite: ' + this.myWidth + ' Höhe: ' + this.myHeight);
      });
    }

  goHome() {
    this.thePath = ['home'];
    console.log('Aufruf - ' + this.thePath);
    this.router.navigate(this.thePath);
  }

  AnzeigeImportExport() {
    this.thePath = ['importexport'];
    console.log('Aufruf - ' + this.thePath);
    this.router.navigate(this.thePath);
  }

  async ionViewDidEnter() {
    console.log("Einstellungen: ionViewDidEnter");
    this.txtAnzahl = document.getElementById('txtAnz').getElementsByTagName('textarea')[0];
    await this.dbService.getTabEntryCount()
    .then((val) => {
      console.log('getTabEntryCount: ' + val.toString());
      this.txtAnzahl.value = val.toString();
    })
    .catch((e) => console.log(e));
  }

  async ngOnInit() {
    console.log("Einstellungen: ngOnInit");
  }

}
