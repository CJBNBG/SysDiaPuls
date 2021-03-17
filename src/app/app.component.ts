import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  public selectedIndex = 0;
  currentPageTitle = 'home';

  // die Einträge dieser Liste erscheinen als Auswahl im Menü in dieser Reihenfolge
  public appPages = [
    {
      title: 'Einträge ansehen',
      url: '/tabelle',
      icon: 'document-text'
    },
    // {
    //   title: 'Diagramm',
    //   url: '/diagramm',
    //   icon: 'trending-up'
    // },
    {
      title: 'Einstellungen',
      url: '/einstellungen',
      icon: 'settings'
    },
    {
      title: 'Import / Export',
      url: '/importexport',
      icon: 'swap-vertical'
    },
    {
      title: 'Über diese App',
      url: '/ueber',
      icon: 'information'    
    }
  ];

  // die Einträge dieser Liste erscheint unter der Auswahl im Menü in eben dieser Reihenfolge
  //public labels = ['Übersicht', 'Einstellungen', 'Über'];

  constructor(
    private router: Router,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public toastController: ToastController
  ) {
    this.initializeApp();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'SysDiaPuls wurde beendet.',
      duration: 10000
    });
    toast.present();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      // damit die App beendet wird, wenn der Back-Button erneut betätigt wird
      this.platform.backButton.subscribeWithPriority(0, () => {
        const path = window.location.pathname;
        if (path === '/home') {
          this.presentToast();
          console.log('App beendet.');
          navigator['app'].exitApp(); 
        } else {
          switch ( path ) {
            case '/detail':
              this.router.navigate(['./tabelle']);
              break;
            case '/tabelle':
            case '/einstellungen':
            case '/ueber':
            default:
              this.router.navigate(['home']);
              break;
          }
        }
      });
    });
  }

  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }
}
