import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DbService, DataInterface } from '../../services/db.service';
import { Storage } from '@ionic/storage';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  thePath: any;
  thisID: any = null;
  thisRecord: DataInterface[] = [];
  myWidth: number = 0;
  myHeight: number = 0;

  detailform = new FormGroup({
    ctlZeitpunkt: new FormControl('', Validators.compose([
      Validators.required
    ])),
    ctlSystole: new FormControl('', Validators.compose([
      Validators.minLength(2),
      Validators.maxLength(3),
      Validators.pattern('[0-9]{2,3}'),
      Validators.required
    ])),
    ctlDiastole: new FormControl('', Validators.compose([
      Validators.minLength(2),
      Validators.maxLength(3),
      Validators.pattern('[0-9]{2,3}'),
      Validators.required
    ])),
    ctlPuls: new FormControl('', Validators.compose([
      //PulsValidator.validPuls,
      Validators.maxLength(3),
      Validators.minLength(2),
      Validators.pattern('[0-9]{2,3}'),
      Validators.required
    ])),
    ctlGewicht: new FormControl('', Validators.compose([
      //GewichtValidator.validGewicht,
      Validators.maxLength(5),
      Validators.minLength(1),
      Validators.pattern('[0-9]{2,3}.[0-9]')
      // Validators.required
    ])),
    ctlBemerkung: new FormControl('', Validators.compose([
      Validators.minLength(0),
      Validators.pattern('^[a-zA-Z][a-zäöüÄÖÜßA-Z0-9_(){}=?!<>°$%&+*/.,:;~ ]{0,1000}') // \-
      // Validators.required
    ]))
  });

  validation_messages = {
    'ctlZeitpunkt': [
      { type: 'required', message: 'Es ist ein Wert für den Zeitpunkt erforderlich.' }
    ],
    'ctlSystole': [
      { type: 'minlength', message: 'Der Wert muss mindestens 2 Stellen haben.' },
      { type: 'maxlength', message: 'Der Wert darf maximal 3 Stellen haben.' },
      { type: 'pattern', message: 'Es dürfen nur Zahlen eingegeben werden.' },
      { type: 'required', message: 'Der Wert muss zwischen 100 und 200 liegen.' }
    ],
    'ctlDiastole': [
      { type: 'minlength', message: 'Der Wert muss mindestens 2 Stellen haben.' },
      { type: 'maxlength', message: 'Der Wert darf maximal 3 Stellen haben.' },
      { type: 'pattern', message: 'Es dürfen nur Zahlen eingegeben werden.' },
      { type: 'required', message: 'Der Wert muss zwischen 100 und 200 liegen.' }
    ],
    'ctlPuls': [
      //{ type: 'validPuls', message: 'Der Wert muss zwischen 60 und 140 liegen.' },
      { type: 'minlength', message: 'Der Wert muss mindestens 2 Stellen haben.' },
      { type: 'maxlength', message: 'Der Wert darf maximal 3 Stellen haben.' },
      { type: 'pattern', message: 'Es dürfen nur Zahlen eingegeben werden.' },
      { type: 'required', message: 'Es ist ein Wert für den Puls erforderlich.' }
    ],
    'ctlGewicht': [
      //{ type: 'validGewicht', message: 'Der Wert muss positiv sein und darf nicht größer sein als 300.' },
      { type: 'minlength', message: 'Der Wert muss mindestens 1 Stelle haben.' },
      { type: 'maxlength', message: 'Der Wert darf maximal 5 Stellen inkl. Komma haben.' },
      { type: 'pattern', message: 'Es dürfen nur Zahlen mit einer Nachkommastelle eingegeben werden.' },
      { type: 'required', message: 'Es ist kein Wert für das Gewicht erforderlich.' }
    ],
    'ctlBemerkung': [
      { type: 'minlength', message: 'Eine Bemerkung muss mindestens 1 Zeichen lang sein.' },
      { type: 'required', message: 'Eine Bemerkung ist nicht erforderlich.' }
    ]
  };

  constructor(private route: ActivatedRoute,
              private storage: Storage, 
              private router: Router, 
              private dbService: DbService,
              platform: Platform) {
    console.log('DetailPage: constructor()');
    platform.ready().then(() => {
      this.myWidth = platform.width();
      this.myHeight = platform.height();
    });
    this.thisRecord.push({
      Jetzt: "01.01.2000 00:00",
      dt_formatiert: "01.01.2000 00:00",
      pid: -1,
      Zeitpunkt: "01.01.2000 00:00",
      Systole: 120,
      Diastole: 80,
      Puls: 60,
      Gewicht: null,
      Bemerkung: ""
    });
    console.log(JSON.stringify(this.thisRecord));
    this.init();
  }

  async init() {
    await this.getData();
    await this.setAllValues();
  }

  goInfo() {
    this.thePath = ['./ueber'];
    console.log('HomePage: Aufruf - ' + this.thePath);
    this.router.navigate(this.thePath);
  }

  goHome() {
    this.thePath = ['home'];
    console.log('DetailPage: Aufruf - ' + this.thePath);
    this.router.navigate(this.thePath);
  }

  AnzeigeEinstellungen() {
    this.thePath = ['./einstellungen'];
    console.log('DetailPage: Aufruf - ' + this.thePath);
    this.router.navigate(this.thePath);
  }

  async getData() {
    console.log("DetailPage: getData()");

    try {
      const val = await this.storage.get("ID");
      this.thisRecord[0].pid = val
    } catch(e) {
      console.log("Fehler ID " + e.message)
    }
    console.log("DetailPage: ID: " + this.thisRecord[0].pid);

    try {
      const val = await this.storage.get("Zeitpunkt");
      this.thisRecord[0].Zeitpunkt = val
    } catch(e) {
      console.log("Fehler Zeitpunkt " + e.message)
    }
    console.log("DetailPage: Zeitpunkt: " + this.thisRecord[0].Zeitpunkt);

    try {
      const val = await this.storage.get("Systole");
      this.thisRecord[0].Systole = val
    } catch(e) {
      console.log("Fehler Systole " + e.message)
    }
    console.log("DetailPage: Systole: " + this.thisRecord[0].Systole);

    try {
      const val = await this.storage.get("Diastole");
      this.thisRecord[0].Diastole = val
    } catch(e) {
      console.log("Fehler Diastole " + e.message)
    }
    console.log("DetailPage: Diastole: " + this.thisRecord[0].Diastole);

    try {
      const val = await this.storage.get("Puls");
      this.thisRecord[0].Puls = val
    } catch(e) {
      console.log("Fehler Puls " + e.message)
    }
    console.log("DetailPage: Puls: " + this.thisRecord[0].Puls);

    try {
      const val = await this.storage.get("Gewicht");
      this.thisRecord[0].Gewicht = val
    } catch(e) {
      console.log("Fehler Gewicht " + e.message)
    }
    console.log("DetailPage: Gewicht: " + this.thisRecord[0].Gewicht);

    try {
      const val = await this.storage.get("Bemerkung");
      this.thisRecord[0].Bemerkung = val
    } catch(e) {
      console.log("Fehler Bemerkung " + e.message)
    }
    console.log("DetailPage: Bemerkung: " + this.thisRecord[0].Bemerkung);
  }

  async SystolePlusMinus(op:string) {
    try {
      let w: any = await this.detailform.get('ctlSystole').value;
      let Wert: number = parseInt(w.toString(), 10);
      if ( op === "+" ) {
        if ( Wert < 200 ) Wert += 1;
      } else {
        if ( Wert > 100 ) Wert -= 1;
      }
      this.detailform.setValue({
        ctlZeitpunkt: await this.detailform.get('ctlZeitpunkt').value,
        ctlSystole: Wert,
        ctlDiastole: await this.detailform.get('ctlDiastole').value,
        ctlPuls: await this.detailform.get('ctlPuls').value,
        ctlGewicht: await this.detailform.get('ctlGewicht').value,
        ctlBemerkung: await this.detailform.get('ctlBemerkung').value
      });
      this.thisRecord[0].Systole = Wert;
      console.log(Wert);
    } catch (e) {
      console.log(e);
    }
  }

  async DiastolePlusMinus(op:string) {
    try {
      let w: any = await this.detailform.get('ctlDiastole').value;
      let Wert: number = parseInt(w.toString(), 10);
      if ( op === "+" ) {
        if ( Wert < 120 ) Wert += 1;
      } else {
        if ( Wert > 60 ) Wert -= 1;
      }
      this.detailform.setValue({
        ctlZeitpunkt: await this.detailform.get('ctlZeitpunkt').value,
        ctlSystole: await this.detailform.get('ctlSystole').value,
        ctlDiastole: Wert,
        ctlPuls: await this.detailform.get('ctlPuls').value,
        ctlGewicht: await this.detailform.get('ctlGewicht').value,
        ctlBemerkung: await this.detailform.get('ctlBemerkung').value
      });
      this.thisRecord[0].Diastole = Wert;
      console.log(Wert);
    } catch (e) {
      console.log(e);
    }
  }

  async PulsPlusMinus(op:string) {
    try {
      let w: any = await this.detailform.get('ctlPuls').value;
      let Wert: number = parseInt(w.toString(), 10);
      if ( op === "+" ) {
        if ( Wert < 140 ) Wert += 1;
      } else {
        if ( Wert > 40 ) Wert -= 1;
      }
      this.detailform.setValue({
        ctlZeitpunkt: await this.detailform.get('ctlZeitpunkt').value,
        ctlSystole: await this.detailform.get('ctlSystole').value,
        ctlDiastole: await this.detailform.get('ctlDiastole').value,
        ctlPuls: Wert,
        ctlGewicht: await this.detailform.get('ctlGewicht').value,
        ctlBemerkung: await this.detailform.get('ctlBemerkung').value
      });
      this.thisRecord[0].Puls = Wert;
      console.log(Wert);
    } catch (e) {
      console.log(e);
    }
  }

  async GewichtPlusMinus(op:string) {
    try {
      let w: any = await this.detailform.get('ctlGewicht').value;
      let Wert: number = Number.parseFloat(Number.parseFloat(w.toString()).toFixed(1));
      if ( op === "+" ) {
        if ( Wert < 300.0 ) Wert += 0.1;
      } else {
        if ( Wert > 0.0 ) Wert -= 0.1;
      }
      Wert = Number.parseFloat(Number.parseFloat(Wert.toString()).toFixed(1));
      let Erg: string = Wert.toString();
      if ( Erg.indexOf(".") === -1 ) Erg = Wert.toString() + ".0";
      this.detailform.setValue({
        ctlZeitpunkt: await this.detailform.get('ctlZeitpunkt').value,
        ctlSystole: await this.detailform.get('ctlSystole').value,
        ctlDiastole: await this.detailform.get('ctlDiastole').value,
        ctlPuls: await this.detailform.get('ctlPuls').value,
        ctlGewicht: Erg,
        ctlBemerkung: await this.detailform.get('ctlBemerkung').value
      });
      this.thisRecord[0].Gewicht = await this.detailform.get("ctlGewicht").value;
      console.log(Erg + " - " + Wert);
    } catch (e) {
      console.log(e);
    }
  }

  rgbToHex(r: number, g: number, b: number) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  setAllValues() {
    try {
      let Wstr = this.thisRecord[0].Gewicht.toString();
      let Erg: string = Number.parseFloat(Wstr).toFixed(1);
      if ( Erg.indexOf(".") === -1 ) Erg = Erg + ".0";
      this.detailform.setValue({
        ctlZeitpunkt: new Date(this.thisRecord[0].Zeitpunkt).toISOString(),
        ctlSystole: this.thisRecord[0].Systole.toString(),
        ctlDiastole: this.thisRecord[0].Diastole.toString(),
        ctlPuls: this.thisRecord[0].Puls.toString(),
        ctlGewicht: Erg,
        ctlBemerkung: this.thisRecord[0].Bemerkung
      });
    } catch(e) {
      console.log("setAllValues Error: " + e.message);
      this.detailform.setValue({
        ctlZeitpunkt: new Date().toISOString(),
        ctlDiastole: "80",
        ctlSystole: "120",
        ctlPuls: "70",
        ctlGewicht: "80.0",
        ctlBemerkung: ""
      });
    }
  }

  ngOnInit() {
    console.log("DetailPage: ngOnInit()");
  }

  async onSubmit(values){
    let dieID = this.thisRecord[0].pid;
    let dasDatum: Date = new Date(await this.detailform.get("ctlZeitpunkt").value);
    let dieSystole = await this.detailform.get('ctlSystole').value;
    let dieDiastole = await this.detailform.get('ctlDiastole').value;
    let derPuls = await this.detailform.get('ctlPuls').value;
    let dasGewicht = await this.detailform.get('ctlGewicht').value;
    let dieBemerkung = await this.detailform.get("ctlBemerkung").value;
    // wenn ein neuer DS erzeugt werden muss
    if ( this.thisRecord[0].pid === -1 || this.thisRecord[0].pid === null ) {
      await this.dbService.addKomplett(
        this.dbService.dateFormatted(dasDatum),
        dieSystole,
        dieDiastole,
        derPuls,
        dasGewicht,
        dieBemerkung
      );
    } 
    // wenn der bestehende DS abgeändert werden muss
    else {
      await this.dbService.updateBlutdruck(
        dieID,
        this.dbService.dateFormatted(dasDatum),
        dieSystole,
        dieDiastole
      );
      await this.dbService.updatePuls(
        dieID,
        derPuls
      );
      await this.dbService.updateGewicht(
        dieID,
        dasGewicht
      );
      await this.dbService.updateBemerkung(
        dieID,
        dieBemerkung
      );
    }
    console.log("onSubmit() beendet");
    this.router.navigate(["./tabelle"]);
  }

  myScreenFormat() {
    if ( this.myWidth < 576 ) {
      return "smaller";
    } else if ( this.myWidth>=576 && this.myWidth<768 ) {
      return "small";
    } else if ( this.myWidth>=768 && this.myWidth<992 ) {
      return "medium";
    } else if ( this.myWidth>=992 && this.myWidth<1200 ) {
      return "large";
    } else {
      return "larger";
    }
  }

  myZeitpunktFormat(record: DataInterface) {
    let Erg: string = "row-Zeitpunkt_";
    return Erg + this.myScreenFormat();
  }

  myBezeichnungFormat(record: DataInterface) {
    let Erg: string = "row-Bezeichnung_";
    return Erg + this.myScreenFormat();
  }

  myWertFormat(record: DataInterface) {
    let Erg: string = "row-Wert_";
    return Erg + this.myScreenFormat();
  }

  myBemerkungFormat(record: DataInterface) {
    let Erg: string = "row-Bemerkung_";
    return Erg + this.myScreenFormat();
  }
}