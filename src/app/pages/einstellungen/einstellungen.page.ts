import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-einstellungen',
  templateUrl: './einstellungen.page.html',
  styleUrls: ['./einstellungen.page.scss'],
})
export class EinstellungenPage implements OnInit {

  constructor(private router: Router) { }

  thePath: any;

  goHome() {
    this.thePath = ['home'];
    console.log('Aufruf - ' + this.thePath);
    this.router.navigate(this.thePath);
  }

  ngOnInit() {
  }

}
