import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IHero } from '../../core/models/hero.model';
import { HeroFormDialog } from './hero-form-dialog';
import { TEXTS_UI } from '../../core/constants/texts_ui';
import { MOCK_HEROES } from '../../core/constants/mock_data';


describe('HeroFormDialog', () => {
  let component: HeroFormDialog;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<HeroFormDialog>>;
  let fixture: ComponentFixture<HeroFormDialog>;

  function createComponentWithData(heroData: IHero | null) {
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: { hero: heroData } });
    fixture = TestBed.createComponent(HeroFormDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }
  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [HeroFormDialog],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { hero: null } }
      ]
    }).compileComponents();
  });

  it('should create with hero = null (new hero)', () => {
    createComponentWithData(null);
    expect(component).toBeTruthy();
    expect(component.id()).toBe(0);
    expect(component.name()).toBe('');
  });

  it('should create with existing hero', () => {
    const hero: IHero = MOCK_HEROES[0];
    createComponentWithData(hero);
    expect(component.id()).toBe(1);
    expect(component.name()).toBe(MOCK_HEROES[0].name);
  });

  it('should send trimmed result', () => {
    const hero: IHero = { id: 0, name: '  Ironman  ', description:'Iron man desc', powers:[] };
    createComponentWithData(hero);
    const result = component.sendResult();
    expect(result.name).toBe('Ironman');
    expect(result.id).toBe(0);
  });

  it('should close dialog on onNoClick', () => {
    createComponentWithData(null);
    component.onNoClick();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  describe('isValidName', () => {
    it('should return true for new hero with non-empty name', () => {
      createComponentWithData(null);
      component.name.set('Batman');
      expect(component.isValidName()).toBeTrue();
    });

    it('should return false for new hero with empty name', () => {
      createComponentWithData(null);
      component.name.set('');
      expect(component.isValidName()).toBeFalse();
    });

    it('should return false for existing hero with unchanged name', () => {
      const hero: IHero = { id: 2, name: 'Thor',description:'desc',powers:[] };
      createComponentWithData(hero);
      component.name.set('Thor');
      expect(component.isValidName()).toBeFalse();
    });

    it('should return true for existing hero with changed name', () => {
      const hero: IHero = { id: 2, name: 'Thor',description:'desc',powers:[] };

      createComponentWithData(hero);
      component.name.set('Thor Odinson');
      expect(component.isValidName()).toBeTrue();
    });
  });

  it('should display add labels for new hero', () => {
    createComponentWithData(null);
    expect(component.displayActionLabel()).toBe(TEXTS_UI.add);
    expect(component.displayActionHeader()).toBe(TEXTS_UI.add);
  });

  it('should display edit/save labels for existing hero', () => {
    const hero: IHero = { id: 3, name: 'Hulk', description:'Hulk', powers:[] };
    createComponentWithData(hero);
    expect(component.displayActionLabel()).toBe(TEXTS_UI.save);
    expect(component.displayActionHeader()).toBe(TEXTS_UI.edit);
  });
});