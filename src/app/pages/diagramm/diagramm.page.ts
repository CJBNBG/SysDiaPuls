import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-diagramm',
  templateUrl: './diagramm.page.html',
  styleUrls: ['./diagramm.page.scss'],
})
export class DiagrammPage implements OnInit {

  thePath: any;

  constructor(private router: Router) { }

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

  ngOnInit() {
  }

}
