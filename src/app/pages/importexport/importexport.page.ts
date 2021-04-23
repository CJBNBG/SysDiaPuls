import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Plugins, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';
import { Platform, AlertController, ToastController } from '@ionic/angular';
import { File, Entry } from '@ionic-native/file/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { DbService } from 'src/app/services/db.service';

const { Filesystem } = Plugins;

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
              // private toastCtrl: ToastController,
              // private route: ActivatedRoute,
              private file: File,
              private androidPermissions: AndroidPermissions
              ) {
  }

  intDBVersion: string = '1';
  lblMeldung: any;
  directories: any = [];
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
//-------------------------------------------------------------------------------------

  private verifyIfExists(ITEM, LIST) {
    let verification = false;
    console.log('LIST: ' + JSON.stringify(LIST));
    console.log('ITEM: ' + JSON.stringify(ITEM));
    for (let i = 0; i < LIST.length; i++) {
      if (LIST[i] === ITEM[0]) {
        verification = true;
        break;
      }
    }
    return verification;
  }

  async readdir() {
    try {
      let ret = await Filesystem.readdir({
        path: '',
        directory: FilesystemDirectory.External
      });
      this.directories = ret;
      if (this.verifyIfExists(['Export_SysDiaPuls.db'], ret.files)) {
        console.log("Export_SysDiaPuls.db gefunden!");
      }
      else {
        // Do something else
      }
    } 
    catch(e) {
      console.log('Verzeichnis kann nicht gelesen werden: ' + e);
    }
  }

//-------------------------------------------------------------------------------------
  async loadDocuments() {
    this.plt.ready().then(() => {
      this.lblMeldung = document.getElementById('txtMeldung').getElementsByTagName('textarea')[0];
      this.checkReadWritePermissions();
 
      if ( this.file.externalApplicationStorageDirectory.length > 0 ) {
        console.log('this.file.externalApplicationStorageDirectory: ' + this.file.externalApplicationStorageDirectory);
        // this.readdir();
        this.file.checkDir(this.file.externalApplicationStorageDirectory, 'files').then(_ => {
          // console.log('Verzeichnis SysDiaPuls existiert');
          this.file.listDir(this.file.externalApplicationStorageDirectory, 'files').then(res => {
            this.directories = res;
          });
        }).catch(err => {
          console.log('Verzeichnis SysDiaPuls existiert nicht');
        });
      } else {
        console.log('externalRootDiretory ist nicht definiert')
      }
    });
  }
  
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
      this.lblMeldung.value = "Die Datenbank wurde erfolgreich exportiert.";
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
    }
    if ( sqldata.length > 0 ) {
      // let sqldatabearbeitet: string = this.bearbeiteDaten(sqldata);
      // console.log("sqldatabearbeitet: " + sqldatabearbeitet);
      let ret: any = await this.theImportFromSql(sqldata);
      let ianz: number = parseInt(ret.toString()) - 2;
      this.lblMeldung.value = 'Die bisherigen Einträge wurden durch ' + ianz + ' importierte Einträge ersetzt.';
    } else {
      console.log('Die ausgewählte Date ist leer');
      this.lblMeldung.value = 'Die ausgewählte Datei ist leer!';
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
  
// -----------------------------------------------------------------------
/*
  async fileWrite() {
    try {
      const result = await Filesystem.writeFile({
        path: 'SysDiaPuls/SysDiaPuls.txt',
        data: "Yippie: SysDiaPuls war erfolgreich!",
        directory: FilesystemDirectory.ExternalStorage,
        encoding: FilesystemEncoding.UTF8,
        recursive: true
      });
      await this.fileRead();
      console.log('ExternalStorage: ' + JSON.stringify(FilesystemDirectory.ExternalStorage));
      console.log('Datei geschrieben', result);
    } catch(e) {
      console.error('Datei konnte nicht geschrieben werden', e);
    }
  }

  async fileRead() {
    let contents = await Filesystem.readFile({
      path: 'SysDiaPuls/SysDiaPuls.txt',
      directory: FilesystemDirectory.ExternalStorage,
      encoding: FilesystemEncoding.UTF8
    });
    console.log('ExternalStorage: ' + JSON.stringify(FilesystemDirectory.ExternalStorage));
    console.log(JSON.stringify(contents));
    if ( this.lblMeldung == null ) {
      console.log('this.lblMeldung.value is null');
    } else {
      this.lblMeldung.value = JSON.stringify(contents);
    }
  }

  async fileAppend() {
    try {
      let ret = await Filesystem.appendFile({
        path: 'SysDiaPuls/SysDiaPuls.txt',
        data: "\nWEITERE TESTS",
        directory: FilesystemDirectory.ExternalStorage,
        encoding: FilesystemEncoding.UTF8
      });
      console.log('fileAppend(): ' + JSON.stringify(ret));
      this.fileRead();
    } catch(e) {
      console.error('Datei konnte nicht erweitert werden: ', e);
    }
  }

  async fileDelete() {
    await Filesystem.deleteFile({
      path: 'SysDiaPuls/SysDiaPuls.txt',
      directory: FilesystemDirectory.ExternalStorage
    });
  }

  async mkdir() {
    try {
      let ret = await Filesystem.mkdir({
        path: 'SysDiaPuls',
        directory: FilesystemDirectory.ExternalStorage,
        recursive: false // like mkdir -p
      });
      if ( this.lblOrdner == null ) {
        console.log('this.lblOrdner.value is null');
      } else {
        this.lblOrdner.value = JSON.stringify(ret);
      }
      console.log('mkdir(): ' + JSON.stringify(ret));
      console.log('Verzeichnis SysDisPuls angelegt');
    } catch(e) {
      console.error('Verzeichnis konnte nicht angelegt werden: ', e);
    }
  }

  async rmdir() {
    try {
      let ret = await Filesystem.rmdir({
        path: 'SysDiaPuls',
        directory: FilesystemDirectory.ExternalStorage,
        recursive: false,
      });
      if ( this.lblOrdner == null ) {
        console.log('this.lblOrdner.value is null');
      } else {
        this.lblOrdner.value = JSON.stringify(ret);
      }
      console.log('rmdir(): ' + JSON.stringify(ret));
    } catch(e) {
      console.error('Verzeichnis SysDiaPuls konnte nicht entfernt werden', e);
    }
  }

  async readdir() {
    try {
      let ret = await Filesystem.readdir({
        path: 'SysDiaPuls',
        directory: FilesystemDirectory.ExternalStorage
      });
      console.log('readdir(): ' + JSON.stringify(ret));
    } catch(e) {
      console.error('Verzeichnis SysDiaPuls konnte nicht gelesen werden', e);
    }
  }

  async stat() {
    try {
      let ret = await Filesystem.stat({
        path: 'SysDiaPuls/SysDiaPuls.txt',
        directory: FilesystemDirectory.ExternalStorage
      });
      console.log('stat(): ' + JSON.stringify(ret));
    } catch(e) {
      console.error('kein Status der Datei text.txt', e);
    }
  }

  async readFilePath() {
    // Here's an example of reading a file with a full file path. Use this to
    // read binary data (base64 encoded) from plugins that return File URIs, such as
    // the Camera.
    try {
      let data = await Filesystem.readFile({
        path: 'file:///var/mobile/Containers/Data/Application/22A433FD-D82D-4989-8BE6-9FC49DEA20BB/Documents/text.txt'
      });
    } catch(e) {
      console.error('Datei kann nicht gelesen werden', e);
    }
  }

  async rename() {
    try {
      // This example moves the file within the same 'directory'
      let ret = await Filesystem.rename({
        from: 'SysDiaPuls/SysDiaPuls.txt',
        to: 'SysDiaPuls/SysDiaPuls2.txt',
        directory: FilesystemDirectory.ExternalStorage
      });
      console.log('Datei umbenannt');
    } catch(e) {
      console.error('Datei kann nicht umbenannt werden', e);
    }
  }

  async copy() {
    try {
      // This example copies a file within the documents directory
      let ret = await Filesystem.copy({
        from: 'SysDiaPuls/SysDiaPuls.txt',
        to: 'SysDiaPuls/SysDiaPuls2.txt',
        directory: FilesystemDirectory.ExternalStorage
      });
    } catch(e) {
      console.error('Datei kann nicht kopiert werden', e);
    }
  }
*/
// -----------------------------------------------------------------------


}
