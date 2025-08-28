import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IHero } from '../../core/models/hero.model';
import { HeroFormDialog } from './hero-form-dialog';
import { TEXTS_UI } from '../../core/constants/texts_ui';

class MockDialogRef {
  close = jasmine.createSpy('close');
}

describe('HeroFormDialog', () => {
  let component: HeroFormDialog;
  let dialogRef: MockDialogRef;

  beforeEach(() => {
    dialogRef = new MockDialogRef();

    TestBed.configureTestingModule({
      providers: [
        HeroFormDialog,
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { hero: null } }
      ]
    });

    component = TestBed.inject(HeroFormDialog);
  });

  it('should initialize with default values when hero is null', () => {
    expect(component.name()).toBe('');
    expect(component.id()).toBe(0);
  });

  it('should initialize with provided hero data', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        HeroFormDialog,
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { hero: { id: 5, name: 'Superman' } as IHero } }
      ]
    });
    const compWithData:HeroFormDialog = TestBed.inject(HeroFormDialog);

    expect(compWithData.name()).toBe('Superman');
    expect(compWithData.id()).toBe(5);
  });

  it('sendResult should return trimmed hero object', () => {
    component.name.set('  Batman  ');
    component.id.set(10);

    const result = component.sendResult();

    expect(result).toEqual({ id: 10, name: 'Batman' });
  });

  it('onNoClick should call dialogRef.close()', () => {
    component.onNoClick();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('isValidName should return true for non-empty name', () => {
    component.name.set('wolverine');
    expect(component.isValidName()).toBeTrue();
  });

  it('isValidName should return false for empty/whitespace name', () => {
    component.name.set('   ');
    expect(component.isValidName()).toBeFalse();
  });

  it('displayActionLabel should return save when editing', () => {
    component.id.set(99)
    expect(component.displayActionLabel()).toBe(TEXTS_UI.save);
  });

  it('displayActionHeader should return edit when editing', () => {
    component.id.set(99)
    expect(component.displayActionHeader()).toBe(TEXTS_UI.edit);
  });

  it('displayActionLabel should return add when creating a new hero', () => {
    component.id.set(0);
    expect(component.displayActionLabel()).toBe(TEXTS_UI.add);
  });
});