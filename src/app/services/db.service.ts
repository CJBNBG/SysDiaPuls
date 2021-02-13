import { isNull } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';

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

  private dbInstance: SQLiteObject = null;
 
  constructor(private pltfrm: Platform, private sqlite: SQLite) {
    this.pltfrm.ready().then(() => {
      this.sqlite.create({ name: 'SysDiaPuls.db', location: 'default' }).then(
        (db: SQLiteObject) => {
          this.dbInstance = db;
          db.executeSql('CREATE TABLE IF NOT EXISTS '
            + 'tDaten(pid INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,'
            + 'Zeitpunkt DATETIME NOT NULL,'
            + 'Systole INTEGER NOT NULL,'
            + 'Diastole INTEGER NOT NULL,'
            + 'Puls INTEGER NOT NULL,'
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
 
  async getRecordcount(): Promise<number> {
    if ( this.dbInstance === null ) {
      console.log("getRecordcount: Datenbank ist geschlossen");
      return -1;
    } else {
      let retVal: number = -1;
      await this.dbInstance.executeSql('SELECT COUNT(*) AS cnt FROM tDaten', []).then(
        (res) => {
          console.log('cnt=' + res.rows.item(0).cnt);
          retVal = parseInt(res.rows.item(0).cnt, 10);
        }
      ).catch(e => {
        console.log("Recordcount Fehler - " + e);
      });
    console.log('retVal: ' + retVal);
    return retVal;
  }
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
}
