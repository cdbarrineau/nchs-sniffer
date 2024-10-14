import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionDialogComponent } from './connection-dialog.component';

describe('ConnectionDialogComponent', () => {
  let component: ConnectionDialogComponent;
  let fixture: ComponentFixture<ConnectionDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConnectionDialogComponent]
    });
    fixture = TestBed.createComponent(ConnectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
