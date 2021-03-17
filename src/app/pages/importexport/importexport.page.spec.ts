import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ImportexportPage } from './importexport.page';

describe('ImportexportPage', () => {
  let component: ImportexportPage;
  let fixture: ComponentFixture<ImportexportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportexportPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ImportexportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
