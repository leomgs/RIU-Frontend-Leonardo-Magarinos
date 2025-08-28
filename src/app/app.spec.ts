import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { signal } from '@angular/core';
import { IHero } from './core/models/hero.model';
import { HeroesService } from './core/heroes-service';
import { MatDialog } from '@angular/material/dialog';
import { TEXTS_UI } from './core/constants/texts_ui';
import { FormControl } from '@angular/forms';
import { of } from 'rxjs';

class MockDialogRef {
  afterClosed() {
    return of(undefined); // default behavior: closed without result
  }
}

class MockDialog {
  open() {
    return new MockDialogRef();
  }
}

class MockHeroesService {
  heroes = signal<IHero[]>([]);
  addHero = jasmine.createSpy('addHero');
  editHero = jasmine.createSpy('editHero');
  removeHeroById = jasmine.createSpy('removeHeroById');
  getHeroes = jasmine.createSpy('getHeroes').and.returnValue([]);
}

describe('App Component', () => {
  let component: App;
  let heroService: MockHeroesService;
  let dialogService: MockDialog;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        App,
        { provide: HeroesService, useClass: MockHeroesService },
        { provide: MatDialog, useClass: MockDialog }
      ]
    });

    component = TestBed.inject(App);
    heroService = TestBed.inject(HeroesService) as unknown as MockHeroesService;
    dialogService = TestBed.inject(MatDialog) as unknown as MockDialog;
  });

  it('should initialize with correct defaults', () => {
    expect(component.title()).toBe('RIU-Frontend-Leonardo-Magarinos');
    expect(component.isSearchById()).toBeFalse();
    expect(component.searchLabel).toBe(TEXTS_UI.searchLabel);
    expect(component.searchValueControl).toBeInstanceOf(FormControl);
  });

  it('should update searchValueControl on input', () => {
    const event = { target: { value: 'test123' } } as unknown as Event;
    component.onInput(event);
    expect(component.searchValueControl.value).toBe('test123');
  });

  it('should toggle search label and reset value on isSearchByIdChange()', () => {
    component.isSearchById.set(true);
    spyOn(component, 'resetSearchValue');
    component.isSearchByIdChange();
    expect(component.searchLabel).toBe(TEXTS_UI.searchByIdLabel);
    expect(component.resetSearchValue).toHaveBeenCalled();
  });

  it('should reset search value with resetSearchValue()', () => {
    component.searchValueControl.setValue('abc');
    component.resetSearchValue();
    expect(component.searchValueControl.value).toBe('');
  });

  it('should call addHero if dialog returns hero with id 0', () => {
    spyOn(dialogService, 'open').and.returnValue({
      afterClosed: () => of({ id: 0, name: 'New Hero' } as IHero)
    } as any);

    component.openForm();

    expect(heroService.addHero).toHaveBeenCalledWith({ id: 0, name: 'New Hero' });
  });

  it('should call editHero if dialog returns hero with id > 0', () => {
    spyOn(dialogService, 'open').and.returnValue({
      afterClosed: () => of({ id: 10, name: 'Edited Hero' } as IHero)
    } as any);

    component.openForm();

    expect(heroService.editHero).toHaveBeenCalledWith({ id: 10, name: 'Edited Hero' });
  });

  it('should call openForm on handleEditHero()', () => {
    const hero: IHero = { id: 1, name: 'Batman' };
    spyOn(component, 'openForm');
    component.handleEditHero(hero);
    expect(component.openForm).toHaveBeenCalledWith(hero);
  });

   it('should call removeHeroById if confirm dialog result is true', () => {
    spyOn(dialogService, 'open').and.returnValue({
      afterClosed: () => of(true)
    } as any);

    const hero: IHero = { id: 5, name: 'Batman' };
    component.handleDeleteHero(hero);

    expect(heroService.removeHeroById).toHaveBeenCalledWith(5);
  });

  it('should NOT call removeHeroById if confirm dialog result is false', () => {
    spyOn(dialogService, 'open').and.returnValue({
      afterClosed: () => of(false)
    } as any);

    const hero: IHero = { id: 6, name: 'Superman' };
    component.handleDeleteHero(hero);

    expect(heroService.removeHeroById).not.toHaveBeenCalled();
  });
});
