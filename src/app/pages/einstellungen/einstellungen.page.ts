import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DbService, DataInterface, SettingsInterface } from '../../services/db.service';
import { Platform } from '@ionic/angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-einstellungen',
  templateUrl: './einstellungen.page.html',
  styleUrls: ['./einstellungen.page.scss'],
})
export class EinstellungenPage implements OnInit {

  thePath: any;
  intAnzEntries: number = 0;
  myWidth: number = 0;
  myHeight: number = 0;

  settingsform = new FormGroup({
    ctlAnzEntries: new FormControl('', Validators.compose([
      Validators.minLength(1),
      Validators.maxLength(2),
//      Validators.min(1),
//      Validators.max(99),
      Validators.pattern('^[1-9][0-9]{0,1}'),
      Validators.required
    ]))
  });

  validation_messages = {
    'ctlAnzEntries': [
      { type: 'minlength', message: 'Es muss mindestens eine 1-stellige Zahl sein.' },
      { type: 'maxlength', message: 'Es kann maximal eine 2-stellige Zahl sein.' },
      { type: 'min', message: 'Die Untergrenze ist 1.' },
      { type: 'max', message: 'Die Obergrenze ist 99.' },
      { type: 'required', message: 'Diese Einstellung ist erforderlich.' }
    ]
  };

  async onSubmit(values){
    let dieAnzEntries = await this.settingsform.get('ctlAnzEntries').value;
    if ( isNaN(dieAnzEntries) ) {
      console.log("falsche Eingabe: " + dieAnzEntries );
    } else if ( dieAnzEntries < 1 || dieAnzEntries > 99 ) {
      console.log("falsche Eingabe: " + dieAnzEntries.toString() );
    } else {
      await this.dbService.setTabEntryCount(dieAnzEntries)
      .then((val) => {
        console.log("EinstellungenPage - onSubmit: " + JSON.stringify(val) );
      })
      .catch(e => console.log(e));
      this.goHome();
      }
  };

  setAllValues() {
    try {
      this.settingsform.setValue({
        ctlAnzEntries: this.intAnzEntries
      });
    } catch(e) {
      console.log("setAllValues Error: " + e.message);
      this.settingsform.setValue({
        ctlAnzEntries: "50"
      });
    }
  }

  constructor(private dbService: DbService,
    private router: Router,
    platform: Platform) {
      platform.ready().then(() => {
        this.myWidth = platform.width();
        this.myHeight = platform.height();
        console.log('Einstellungen - Breite: ' + this.myWidth + ' Höhe: ' + this.myHeight);
      });
    }

  async onCancel() {
    this.goHome();
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
  }

  async ngOnInit() {
    console.log("Einstellungen: ngOnInit");
    await this.init();
  }

  async getData() {
    await this.dbService.getTabEntryCount()
    .then((val) => {
      this.intAnzEntries = val;
    })
    .catch(e => console.log("EinstellungenPage - getData - Fehler: " + e));
  }

  async init() {
    await this.getData();
    await this.setAllValues();
  }

}
