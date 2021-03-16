import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QlikLoaderComponent } from './qlik-loader.component';

describe('QlikLoaderComponent', () => {
  let component: QlikLoaderComponent;
  let fixture: ComponentFixture<QlikLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QlikLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QlikLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
