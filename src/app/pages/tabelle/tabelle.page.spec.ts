import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabellePage } from './tabelle.page';

describe('TabellePage', () => {
  let component: TabellePage;
  let fixture: ComponentFixture<TabellePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabellePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TabellePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
