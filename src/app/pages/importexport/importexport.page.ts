import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Plugins, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';
import { Platform, AlertController, ToastController } from '@ionic/angular';
import { File, Entry } from '@ionic-native/file/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { DbService } from 'src/app/services/db.service';

const { Filesystem } = Plugins;

interface myType {
  Dateiname: string, 
  Pfad: string, 
  LetzteAenderung: string
};

@Component({
  selector: 'app-importexport',
  templateUrl: './importexport.page.html',
  styleUrls: ['./importexport.page.scss'],
})

export class ImportexportPage implements OnInit {

  constructor(private router: Router,
              private plt: Platform,
              private dbService: DbService,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController,
              // private route: ActivatedRoute,
              private file: File,
              private androidPermissions: AndroidPermissions
              ) {
  }

  intDBVersion: string = '1';
  lblMeldung: any;
  sortierteDateiliste: any = [];
  exportPfad: string = '';
  // sortierteDateiliste: Array<myType[]> = new Array();
  // metaDaten: string = '';
  thePath: any;
  theFile: Entry;
  External_READ_Persmission: boolean;
  External_WRITE_Persmission: boolean;

  async presentAlertConfirm() {
    const msg: string = "Mit dem Import der Datei"
                        + "<br><br>" + this.theFile.name
                        + "<br><br>gehen alle aktuellen Einträge in der Datenbank verloren."
                        + "<br><br><strong>Wollen Sie das?</strong></br></br>";
    const alert = await this.alertCtrl.create({
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
          text: 'Importieren',
          handler: () => {
            this.doImportDb(this.theFile);
            console.log('Datensätze importieren');
          }
        }
      ]
    });
    await alert.present();
  }

  async presentToast(theMessage: string) {
    const toast = await this.toastCtrl.create({
      message: theMessage,
      duration: 2000
    });
    toast.present();
  }

  async checkReadWritePermissions() {
    this.plt.ready().then(() => {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
        result => this.External_WRITE_Persmission = result.hasPermission,
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
      );
      if ( this.External_WRITE_Persmission == false ) {
        console.log('WRITE_EXTERNAL_STORAGE ***NOT*** permitted');
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
          result => this.External_WRITE_Persmission = result.hasPermission
        )
      } else {
        console.log('WRITE_EXTERNAL_STORAGE is permitted');
      }

      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
        result => this.External_READ_Persmission = result.hasPermission,
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
      );
      if ( this.External_READ_Persmission == false ) {
        console.log('READ_EXTERNAL_STORAGE ***NOT*** permitted');
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
          result => this.External_READ_Persmission = result.hasPermission
        )
      } else {
        console.log('READ_EXTERNAL_STORAGE is permitted');
      }
    });
  }

  async loadDocuments() {
    this.plt.ready().then(() => {
      this.lblMeldung = document.getElementById('txtMeldung').getElementsByTagName('textarea')[0];
      this.checkReadWritePermissions();

      if ( this.file.externalApplicationStorageDirectory.length > 0 ) {
        console.log('this.file.externalApplicationStorageDirectory: ' + this.file.externalApplicationStorageDirectory);
        // this.readdir();
        this.file.checkDir(this.file.externalApplicationStorageDirectory, 'files')
        .then(_ => {
          // console.log('Verzeichnis SysDiaPuls existiert');
          this.file.listDir(this.file.externalApplicationStorageDirectory, 'files')
          .then(res => {
            this.exportPfad = this.file.externalApplicationStorageDirectory + 'files';
            this.sortierteDateiliste = res.sort(function(a,b) {
              if ( a.name < b.name ) { return 1; }
              if ( a.name > b.name ) { return -1; }
              return 0;
            });
            // this.dateiliste.forEach(element => {
            //   this.ergaenzeDateiliste(element);
            // });
          });
        })
        .catch(err => {
          console.log('Verzeichnis SysDiaPuls existiert nicht');
        });
      } else {
        console.log('externalRootDiretory ist nicht definiert')
      }
    });
  }

  /*
  async ergaenzeDateiliste(element) {
    let derName: string = element.name;
    let derPfad: string = element.fullPath;

    function success(metadata) {
      try {
        // this.metaDaten = (new Date(metadata.modificationTime)).toLocaleString();
        // let theDate: string = (new Date(metadata.modificationTime)).toLocaleString();              // 'de-DE', { timeZone: 'GMT+0100' })
        // if ( this.sortierteDateiliste === undefined ) {
        //   this.sortierteDateiliste = [];
        //   console.log('sortierteDateiliste initialisiert')
        // }
        let lm: string = (new Date(metadata.modificationTime)).toLocaleString();
        this.sortierteDateiliste.push({Name: derName, Pfad: derPfad, LetzteAenderung: lm});
        console.log('Name: ' + derName + ', Pfad: ' + derPfad + ', LetzteAenderung: ' + lm);
      } catch (e) {
        console.log("Fehler ergaenzeDateiliste: " + e);
      }
    }

    function fail(error) {
      console.log(JSON.stringify(error));
    }
  
    await element.getMetadata(success, fail);
    try {
      // let values_to_push: myType[] = [];
      // values_to_push["Dateiname"] = element.name;
      // values_to_push["Pfad"] = element.fullPath;
      // values_to_push["LetzteAenderung"] = this.metaDaten;
      // console.log('values_to_push: ' + JSON.stringify(values_to_push));
      // this.sortierteDateiliste.push([Dateiname: element.name, Pfad: element.fullPath, LetzteAenderung: this.metaDaten]);
      // this.sortierteDateiliste.push(values_to_push);
      // let anzlen: number = this.sortierteDateiliste.length-1;
      // console.log('Anz. Eintraege: ' + JSON.stringify(anzlen));
      // console.log('neuer Eintrag: ' + JSON.stringify(this.sortierteDateiliste[anzlen]));
    } catch(e) {
      console.log('Fehler ergaenzeDateiliste: ' + e);
    }
  }
  */

  ngOnInit() {
    this.loadDocuments();
  }

  goHome() {
    this.thePath = ['home'];
    console.log('Aufruf - ' + this.thePath);
    this.router.navigate(this.thePath);
  }

  async doExportDb() {
    console.log("Datenbankexport gestartet");
    this.lblMeldung = document.getElementById('txtMeldung').getElementsByTagName('textarea')[0];

    let theData: string = await this.theExportToSql();
    if (theData != 'error' ) {
      let sqldatabearbeitet: string = this.bearbeiteDaten(theData);
      await this.writeSqlFile(sqldatabearbeitet);
      await this.loadDocuments();
      this.presentToast("Die Datenbank wurde erfolgreich exportiert.");
    }

    console.log("Datenbankexport beendet");
  }

  async theExportToSql(): Promise<string> {
    let retval: string = 'error';
    let contents = await this.dbService.exportAsSQL()
    .then((data) => {
      retval = JSON.stringify(data);
      console.log(JSON.stringify(data));
    })
    .catch((e) => {
      console.log(JSON.stringify(e));
      this.lblMeldung.value = JSON.stringify(e);
    });
    return retval;
  }

  async infoDatei(file: Entry) {

  }

  async theImportFromSql(sqldata: string): Promise<string> {
    let retval: string = 'error';
    let contents = await this.dbService.importAsSQL(sqldata)
    .then((data) => {
      retval = JSON.stringify(data);
      console.log('SQL-Daten importiert - ' + retval);
    })
    .catch((e) => {
      console.log(JSON.stringify(e));
      this.lblMeldung.value = JSON.stringify(e);
    });
    return retval;
  }
  
  bearbeiteDaten(daten: string): string {
    let retdata: string = '';
    let zwi: string;

    if ( daten.charAt(0) == String.fromCharCode(34) ) {                 // 34 ist das Gänsefüßchen
      zwi = daten.substring(1, daten.length-1);                         // entfernt das einleitende und das abschließende "
      let myarray: string[] = zwi.split(String.fromCharCode(92,110));   // sucht nach \n
      myarray.forEach(element => {
        zwi = element.replace(String.fromCharCode(92,100), '');        // \n wird entfernt
        // console.log('vorher: ' + element);
        // console.log('nachher: ' + zwi);
        retdata += zwi;
      });
    } else {
      retdata = daten;
      console.log('bearbeiteDaten(): unverändert');
    }
    return retdata;
  }

  async doTheImport(file: Entry) {
    this.theFile = file;
    await this.presentAlertConfirm();
  }
  
  async doImportDb(file: Entry) {
    console.log("Datenbankimport gestartet");
    this.lblMeldung = document.getElementById('txtMeldung').getElementsByTagName('textarea')[0];

    let sqldata: string;
    if(file.name.toLowerCase().endsWith(".sql")){
      console.log('zu importierende SQL-Datei: ' + file.name);
      await this.file.readAsText(this.file.externalApplicationStorageDirectory, 'files/' + file.name)
      .then((data) => {
        sqldata = data;
      })
      .catch((e) => {
        console.log('Fehler beim Lesen der SQL-Datei: ' + e);
      })
    } else {
      console.log('dies ist keine geeignete SQL-Datei: ' + file.name);
      this.presentToast('Dies ist keine geeignete Importdatei!');
    }
    if ( sqldata.length > 0 ) {
      // let sqldatabearbeitet: string = this.bearbeiteDaten(sqldata);
      // console.log("sqldatabearbeitet: " + sqldatabearbeitet);
      let ret: any = await this.theImportFromSql(sqldata);
      let ianz: number = parseInt(ret.toString()) - 2;
      this.presentToast('Die bisherigen Einträge wurden durch ' + ianz + ' importierte Einträge ersetzt.');
    } else {
      console.log('Die ausgewählte Date ist leer');
      this.presentToast('Die ausgewählte Datei ist leer!');
    }

    console.log("Datenbankimport beendet");
  }

  async entferneDatei(file: Entry) {
    let path = this.file.externalApplicationStorageDirectory + 'files';
    this.file.removeFile(path, file.name).then(() => {
      this.loadDocuments();
    });
  }

  async writeSqlFile(sqldata: string) {
    console.log('sqldata to write: ' + sqldata);
    let aktDateTime: Date = new Date();
    let aktJahr: string = aktDateTime.getFullYear().toString();
    let aktMonat: string = (aktDateTime.getMonth() + 1).toString();
    if ( aktMonat.length < 2 ) aktMonat = '0' + aktMonat;
    let aktTag: string = aktDateTime.getDate().toString();
    if ( aktTag.length < 2 ) aktTag = '0' + aktTag;
    let aktStunde: string = aktDateTime.getHours().toString();
    if ( aktStunde.length < 2 ) aktStunde = '0' + aktStunde;
    let aktMinute: string = aktDateTime.getMinutes().toString();
    if ( aktMinute.length < 2 ) aktMinute = '0' + aktMinute;
    let aktSekunde: string = aktDateTime.getSeconds().toString();
    if ( aktSekunde.length < 2 ) aktSekunde = '0' + aktSekunde;
    let aktMillisekunde: string = aktDateTime.getMilliseconds().toString();
    if ( aktMillisekunde.length < 2 ) aktMillisekunde = '00' + aktMillisekunde;
    else if ( aktMillisekunde.length < 3 ) aktMillisekunde = '0' + aktMillisekunde;
    let aktDateiname: string = 'files/' + aktJahr + aktMonat + aktTag + '_' + aktStunde + aktMinute + '_' + aktSekunde + aktMillisekunde + '_V' + this.intDBVersion + '_SysDiaPuls.sql';
    try {
      this.file.createFile(this.file.externalApplicationStorageDirectory,
                           aktDateiname,
                           true)
      .then((res) => {
        let myblob = new Blob([sqldata], { type: 'text', endings: 'native' });
        this.file.writeExistingFile(this.file.externalApplicationStorageDirectory, aktDateiname, myblob)
        .then((ret) => {
          console.log('Datei ' + aktDateiname + ' geschrieben');
        })
        .catch((e) => {
          console.log('Datei konnte nicht geschrieben werden: ' + e);
        });
      })
      .catch((err) => {
        console.log('Fehler beim Schreiben der Datei ' + aktDateiname + ' : ' + err);
      });
    } catch(e) {
      console.error('Datei ' + aktDateiname + ' kann nicht geschrieben werden: ', e);
    }
  }

  zeigeDatumDerDatei(derName: string): string {
    let dasJahr: string = derName.substr(0, 4);
    let derMonat: string = derName.substr(4, 2);
    let derTag: string = derName.substr(6, 2);
    let dieStunde: string = derName.substr(9, 2);
    let dieMinute: string = derName.substr(11, 2);
    return derTag + '.' + derMonat + '.' + dasJahr + ' ' + dieStunde + ':' + dieMinute;
  }

  zeigeNameDerDatei(derName: string): string {
    let pos: number = derName.lastIndexOf('_') + 1;
    return derName.substr(pos);
  }
}
