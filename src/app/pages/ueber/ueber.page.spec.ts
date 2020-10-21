import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UeberPage } from './ueber.page';

describe('UeberPage', () => {
  let component: UeberPage;
  let fixture: ComponentFixture<UeberPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UeberPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UeberPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
