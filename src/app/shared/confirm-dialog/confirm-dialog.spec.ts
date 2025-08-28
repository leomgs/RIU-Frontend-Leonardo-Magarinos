import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogData } from '../../core/models/confirm-dialog.model';
import { ConfirmDialog } from './confirm-dialog';

class MockDialogRef {
  close = jasmine.createSpy('close');
}

describe('ConfirmDialog', () => {
  let component: ConfirmDialog;
  let dialogRef: MockDialogRef;
  const dialogData: ConfirmDialogData = {
    title: 'Confirm Delete',
    message: 'Are you sure you want to delete this item?'
  };

  beforeEach(() => {
    dialogRef = new MockDialogRef();

    TestBed.configureTestingModule({
      providers: [
        ConfirmDialog,
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: dialogData }
      ]
    });

    component = TestBed.inject(ConfirmDialog);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with provided data', () => {
    expect(component.title).toBe(dialogData.title);
    expect(component.message).toBe(dialogData.message);
  });

  it('should have TEXTS_UI defined', () => {
    expect(component.TEXTS_UI).toBeDefined();
  });

  it('should inject MatDialogRef', () => {
    expect(component.dialogRef).toBe(dialogRef as any);
  });
});