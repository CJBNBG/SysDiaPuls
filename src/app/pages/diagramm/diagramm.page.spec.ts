import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DiagrammPage } from './diagramm.page';

describe('DiagrammPage', () => {
  let component: DiagrammPage;
  let fixture: ComponentFixture<DiagrammPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiagrammPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DiagrammPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
