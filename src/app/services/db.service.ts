import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { Platform } from '@ionic/angular';
import * as delay from 'delay';
import { taggedTemplate } from '@angular/compiler/src/output/output_ast';

export interface DataInterface {
  Jetzt: string;
  dt_formatiert: string;
  pid: number;
  Zeitpunkt: string;
  Systole: number;
  Diastole: number;
  Puls: number;
  Gewicht: number;
  Bemerkung: string;
}

@Injectable({
  providedIn: 'root'
})

export class DbService {

  public dbInstance: SQLiteObject = null;
 
  constructor(private pltfrm: Platform, 
              private sqlite: SQLite,
              private sqlitePorter: SQLitePorter
              ) {
    this.pltfrm.ready().then(() => {
      this.sqlite.create({ name: 'SysDiaPuls.db', location: 'default' }).then(
        (db: SQLiteObject) => {
          this.dbInstance = db;
          db.executeSql('CREATE TABLE IF NOT EXISTS '
            + 'tDaten(pid INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,'
            + 'Zeitpunkt DATETIME NOT NULL,'
            + 'Systole INTEGER NOT NULL,'
            + 'Diastole INTEGER NOT NULL,'
            + 'Puls INTEGER NULL,'
            + 'Gewicht FLOAT NULL,'
            + 'Bemerkung TEXT NULL'
            + ')', [])
            .then(() => console.log('Datenbank geöffnet'))
            .catch(e => console.log(e));
        }
      ).catch().then((e) => {
        console.log(e);
      });
    });
  }

  public dbIsReady(): boolean {
    if ( this.dbInstance === null ) {
      return true;
    } else {
      return false;
    }
  }

  async waitForDbToBeOpen() {
    while (this.dbIsReady() === false ) {
      console.log("waiting for DB to open...");
      await delay(100);                     // 100 ms
    }
  }

  async getAllRecords() {
    let theData: DataInterface[] = [];
    await this.dbInstance.executeSql("SELECT strftime('%H:%M %Y-%m-%d', datetime('now')) AS Jetzt, strftime('%d.%m.%Y\n%H:%M', Zeitpunkt) AS dt_formatiert,* FROM tDaten ORDER BY datetime(Zeitpunkt) DESC", []).then(
      (res) => {
        for(var x=0; x<res.rows.length; x++)
          theData.push(res.rows.item(x));
      }
    ).catch(e => {
      console.log(e);
    });
    return theData;
  }
 
  async getRecord(id: number) {
    if ( this.dbInstance === null ) {
      console.log("getRecord: Datenbank ist geschlossen");
      return [];
    } else {
      let resultSet: DataInterface[] = [];
      await this.dbInstance.executeSql("SELECT strftime('%H:%M %Y-%m-%d', datetime('now')) AS Jetzt, strftime('%d.%m.%Y\n%H:%M', Zeitpunkt) AS dt_formatiert,* FROM tDaten WHERE pid=?", [id])
      .then(
        (res) => {
          if ( res.rows.length > 0 ) {
//            for(var x=0; x<res.rows.length; x++) {
//              resultSet.push(res.rows.item(x));
//            }
            resultSet.push(res.rows.item(0));
            console.log('getRecord(' + id + '): ' + JSON.stringify(resultSet));
          } else {
            console.log("getRecord(" + id + "): keine Daten")
          }
        }
      ).catch(e => {
        console.log(e);
      });
      return resultSet;
    }
  }
 
  async getRecordcount(zeitraum: string): Promise<string> {
    let retVal: string = 'keine Daten';
    let data = [];
    let sqlcmd: string = 'SELECT COUNT(*) AS cnt FROM tDaten';
    if ( zeitraum !== 'alle' ) {
      let Jetzt = new Date();
      let Tag = Jetzt.getDate();
      let Monat = Jetzt.getMonth();
      let Jahr = Jetzt.getFullYear();
      let Zeitoffset = parseInt(zeitraum,10);
      let Zeit2 = new Date(Jahr, Monat, Tag + Zeitoffset);
      // console.log('Jetzt: ' + Jetzt.toISOString() );
      // console.log('Zeit2: ' + Zeit2.toISOString());
      if ( Zeitoffset > 0 ) {
        data = [Jetzt.toISOString(), Zeit2.toISOString()];
      } else {
        data = [Zeit2.toISOString(), Jetzt.toISOString()];
      }
      sqlcmd += " where Zeitpunkt BETWEEN ?";
      sqlcmd += " AND ?";
    }
    if ( this.dbInstance === null ) {
      console.log("getRecordcount: Datenbank ist geschlossen");
    } else {
      await this.dbInstance.executeSql(sqlcmd, data).then(
        (res) => {
          // console.log('cnt=' + res.rows.item(0).cnt);
          let erg: number = res.rows.item(0).cnt;
          if ( erg === null ) {
            retVal = '-1';
          } else {
            retVal = parseInt(res.rows.item(0).cnt, 10).toString();
          }
        }
      ).catch(e => {
        console.log("getRecordcount: Fehler - " + e);
      });
      // console.log('retVal: ' + retVal);
    }
    return retVal;
  }
 
  async getAVGSystole(zeitraum: string): Promise<string> {
    let retVal: string = 'keine Daten';
    let data = [];
    let sqlcmd: string = 'SELECT AVG(Systole) AS erg FROM tDaten';
    if ( zeitraum !== 'alle' ) {
      let Jetzt = new Date();
      let Tag = Jetzt.getDate();
      let Monat = Jetzt.getMonth();
      let Jahr = Jetzt.getFullYear();
      let Zeitoffset = parseInt(zeitraum,10);
      let Zeit2 = new Date(Jahr, Monat, Tag + Zeitoffset);
      if ( Zeitoffset > 0 ) {
        data = [Jetzt.toISOString(), Zeit2.toISOString()];
      } else {
        data = [Zeit2.toISOString(), Jetzt.toISOString()];
      }
      sqlcmd += " where Zeitpunkt BETWEEN ?";
      sqlcmd += " AND ?";
    }
    if ( this.dbInstance === null ) {
      console.log("getAVGSystole: Datenbank ist geschlossen");
    } else {
      await this.dbInstance.executeSql(sqlcmd, data).then(
        (res) => {
          retVal = Number.parseFloat(res.rows.item(0).erg.toString()).toFixed(1) + ' mmHg';
        }
      ).catch(e => {
        console.log("getAVGSystole: Fehler - " + e);
      });
    }
    return retVal;
  }
 
  async getAVGDiastole(zeitraum: string): Promise<string> {
    let retVal: string = 'keine Daten';
    let data = [];
    let sqlcmd: string = 'SELECT AVG(Diastole) AS erg FROM tDaten';
    if ( zeitraum !== 'alle' ) {
      let Jetzt = new Date();
      let Tag = Jetzt.getDate();
      let Monat = Jetzt.getMonth();
      let Jahr = Jetzt.getFullYear();
      let Zeitoffset = parseInt(zeitraum,10);
      let Zeit2 = new Date(Jahr, Monat, Tag + Zeitoffset);
      if ( Zeitoffset > 0 ) {
        data = [Jetzt.toISOString(), Zeit2.toISOString()];
      } else {
        data = [Zeit2.toISOString(), Jetzt.toISOString()];
      }
      sqlcmd += " where Zeitpunkt BETWEEN ?";
      sqlcmd += " AND ?";
    }
    if ( this.dbInstance === null ) {
      console.log("getAVGDiastole: Datenbank ist geschlossen");
    } else {
      await this.dbInstance.executeSql(sqlcmd, data).then(
        (res) => {
          retVal = Number.parseFloat(res.rows.item(0).erg.toString()).toFixed(1) + ' mmHg';
        }
      ).catch(e => {
        console.log("getAVGDiastole: Fehler - " + e);
      });
    }
    return retVal;
  }
 
  async getAVGPuls(zeitraum: string): Promise<string> {
    let retVal: string = 'keine Daten';
    let data = [];
    let sqlcmd: string = 'SELECT AVG(Puls) AS erg FROM tDaten';
    if ( zeitraum !== 'alle' ) {
      let Jetzt = new Date();
      let Tag = Jetzt.getDate();
      let Monat = Jetzt.getMonth();
      let Jahr = Jetzt.getFullYear();
      let Zeitoffset = parseInt(zeitraum,10);
      let Zeit2 = new Date(Jahr, Monat, Tag + Zeitoffset);
      if ( Zeitoffset > 0 ) {
        data = [Jetzt.toISOString(), Zeit2.toISOString()];
      } else {
        data = [Zeit2.toISOString(), Jetzt.toISOString()];
      }
      sqlcmd += " where Zeitpunkt BETWEEN ?";
      sqlcmd += " AND ?";
    }
    if ( this.dbInstance === null ) {
      console.log("getAVGPuls: Datenbank ist geschlossen");
    } else {
      await this.dbInstance.executeSql(sqlcmd, data).then(
        (res) => {
          retVal = Number.parseFloat(res.rows.item(0).erg.toString()).toFixed(1) + ' bps';
        }
      ).catch(e => {
        console.log("getAVGPuls: Fehler - " + e);
      });
    }
    return retVal;
  }
 
  async addKomplett(Zeitpunkt: string, Systole: number, Diastole: number, Puls: number, Gewicht: number, Bemerkung: string) {
    await this.dbInstance.executeSql('INSERT INTO tDaten(Zeitpunkt,Systole,Diastole,Puls,Gewicht,Bemerkung) VALUES(?,?,?,?,?,?)', [Zeitpunkt,Systole,Diastole,Puls,Gewicht,Bemerkung])
    .then( val => {
      console.log("addKomplett: " + JSON.stringify(val));
    })
    .catch(e => console.log(e));
    return this.getAllRecords();
  }
 
  async addBlutdruck(Zeitpunkt: string, Systole: number, Diastole: number, Bemerkung: string) {
    await this.dbInstance.executeSql('INSERT INTO tDaten(Zeitpunkt,Systole,Diastole,Bemerkung) VALUES(?,?,?,?)', [Zeitpunkt,Systole,Diastole,Bemerkung])
    .then( val => {
      console.log("addBlutdruck: " + JSON.stringify(val));
    })
    .catch(e => console.log(e));
    return this.getAllRecords();
  }
 
  async addPuls(Puls: number) {
    await this.dbInstance.executeSql('INSERT INTO tDaten(Puls) VALUES(?)', [Puls])
    .then( val => {
      console.log("addPuls: " + JSON.stringify(val));
    })
    .catch(e => console.log(e));
    return this.getAllRecords();
  }
 
  async addGewicht(Gewicht: number) {
    await this.dbInstance.executeSql('INSERT INTO tDaten(Gewicht) VALUES(?)', [Gewicht])
    .then( val => {
      console.log("addGewicht: " + JSON.stringify(val));
    })
    .catch(e => console.log(e));
    return this.getAllRecords();
  }
 
  async updateBlutdruck(pid: number, Zeitpunkt: string, Systole: number, Diastole: number) {
    console.log("updateBlutdruck( " + pid + ", " + Zeitpunkt + ", " + Systole + ", " + Diastole + ")");
    await this.dbInstance.executeSql('UPDATE tDaten SET Zeitpunkt=?,Systole=?,Diastole=? WHERE pid=?', [Zeitpunkt,Systole,Diastole,pid])
    .then( val => {
      console.log("updateBlutdruck: " + JSON.stringify(val));
    })
    .catch(e => console.log(e));
    return this.getAllRecords();
  }
 
  async updatePuls(pid: number, Puls: number) {
    console.log("updatePuls( " + pid + ", " + Puls + ")");
    await this.dbInstance.executeSql('UPDATE tDaten SET Puls=? WHERE pid=?', [Puls,pid])
    .then( val => {
      console.log("updatePuls: " + JSON.stringify(val));
    })
    .catch(e => console.log(e));
    return this.getAllRecords();
  }
 
  async updateGewicht(pid: number, Gewicht: number) {
    console.log("updateGewicht( " + pid + ", " + Gewicht + ")");
    await this.dbInstance.executeSql('UPDATE tDaten SET Gewicht=? WHERE pid=?', [Gewicht,pid])
    .then( val => {
      console.log("updateGewicht: " + JSON.stringify(val));
    })
    .catch(e => console.log(e));
    return this.getAllRecords();
  }
 
  async updateBemerkung(pid: number, Bem: string) {
    console.log("updateBemerkung( " + pid + ", " + Bem + ")");
    await this.dbInstance.executeSql('UPDATE tDaten SET Bemerkung=? WHERE pid=?', [Bem,pid])
      .then( val => {
        console.log("updateBemerkung: " + JSON.stringify(val));
      })
      .catch(e => console.log(e));
    return this.getAllRecords();
  }
 
  async deleteRecord(pid: number) {
    await this.dbInstance.executeSql('DELETE FROM tDaten WHERE pid=?', [pid])
    .then(res => console.log("Datensatz gelöscht. " + JSON.stringify(res)))
    .catch(e => console.log(e));
    return this.getAllRecords();
  }

  async deleteAllRecords() {
    await this.dbInstance.executeSql('DELETE FROM tDaten', [])
    .then(res => console.log("alle Datensätze gelöscht. " + JSON.stringify(res)))
    .catch(e => console.log(e));
    return this.getAllRecords();
  }

  public dateFormatted(date: Date): string {
    let Erg: string = date.getFullYear()
              + '-' + this.leftpad(date.getMonth() + 1, 2)
              + '-' + this.leftpad(date.getDate(), 2)
              + ' ' + this.leftpad(date.getHours(), 2)
              + ':' + this.leftpad(date.getMinutes(), 2)
              + ':' + this.leftpad(date.getSeconds(), 2);
              //+ ".000+01:00";
    console.log("dateFormatted(): " + Erg)
    return Erg;
  }
  
  public leftpad(val, resultLength = 2, leftpadChar = '0'): string {
    return (String(leftpadChar).repeat(resultLength)
          + String(val)).slice(String(val).length);
  }

  /**
  * @public
  * @method exportAsSQL
  * @description          Exports SQL data from the application database
  * @return {Promise}
  */
  public exportAsSQL(): Promise<number>
  {
    return new Promise((resolve, reject) =>
    {
      this.sqlitePorter.exportDbToSql(this.dbInstance)
      .then((data) =>
      {
          resolve(data);
      })
      .catch((e) =>
      {
          reject(e);
          console.log('exportDbToSql-Fehler: ' + JSON.stringify(e));
      });
    });
  }

  /**
  * @public
  * @method importAsSQL
  * @description          Imports SQL data into the application database
  * @return {Promise}
  */
  public importAsSQL(sqldata: string): Promise<any>
  {
    return new Promise((resolve, reject) => {
      this.sqlitePorter.importSqlToDb(this.dbInstance, sqldata)
      .then((data) =>
      {
        resolve(data);
      })
      .catch((e) =>
      {
        reject(e);
        console.log('importSqlToDb-Fehler: ' + JSON.stringify(e));
      });
    });
  }
}
