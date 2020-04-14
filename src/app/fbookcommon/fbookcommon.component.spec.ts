import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FbookcommonComponent } from './fbookcommon.component';

describe('FbookcommonComponent', () => {
  let component: FbookcommonComponent;
  let fixture: ComponentFixture<FbookcommonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FbookcommonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FbookcommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
