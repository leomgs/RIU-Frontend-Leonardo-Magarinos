import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { App } from './app';
import { signal } from '@angular/core';
import { IHero } from './core/models/hero.model';
import { HeroesService } from './core/services/heroes/heroes-service';
import { MatDialog } from '@angular/material/dialog';
import { TEXTS_UI } from './core/constants/texts_ui';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

 const mockHeroes: IHero[] = [
  { id: 1, name: 'Batman' },
  { id: 2, name: 'Superman' }
];


describe('App Component', () => {
  let component: App;
  let fixture: ComponentFixture<App>; 
  let heroesServiceSpy: jasmine.SpyObj<HeroesService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    heroesServiceSpy = jasmine.createSpyObj('HeroesService', [
      'addHero',
      'editHero',
      'removeHeroById',
      'getHeroes',
      'search',
      'updatePageSearch',
    ], {
      searchTerm: { update: jasmine.createSpy('update') },
      isSearchById: { update: jasmine.createSpy('update') },
      heroesDisplay: signal<IHero[]>(mockHeroes),
      heroes: signal<IHero[]>(mockHeroes),
      heroesDisplayTotal: signal<number>(2),
    });
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, App],
      providers: [
        { provide: HeroesService, useValue: heroesServiceSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
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

  it('should patch value on onInput without searchById', () => {
    const event = { target: { value: 'test123' } } as unknown as Event;
    component.isSearchById.set(false);
    spyOn(component.searchValueControl, 'patchValue');
    component.onInput(event);
    expect(component.searchValueControl.patchValue).toHaveBeenCalledWith('test123');
  });

  it('should patch only numbers on onInput with searchById true', () => {
    const event = { target: { value: 'abc123def' } } as unknown as Event;
    component.isSearchById.set(true);
    spyOn(component.searchValueControl, 'patchValue');
    component.onInput(event);
    expect(component.searchValueControl.patchValue).toHaveBeenCalledWith('123');
  });

  it('should update label and reset search when isSearchByIdChange is called', () => {
    spyOn(component, 'resetSearchValue');
    component.isSearchById.set(true);
    component.isSearchByIdChange();
    expect(component.searchLabel).toBe(TEXTS_UI.searchByIdLabel);
    expect(heroesServiceSpy.isSearchById.update).toHaveBeenCalled();
    expect(component.resetSearchValue).toHaveBeenCalled();
  });
  
  it('should reset search value and call service.search', () => {
    component.searchValueControl.setValue('something');
    component.resetSearchValue();
    expect(component.searchValueControl.value).toBe('');
    expect(heroesServiceSpy.search).toHaveBeenCalled();
  });
  
  it('should show searchByIdLabel if true label and reset search', () => {
    spyOn(component, 'resetSearchValue');

    component.isSearchById.set(true);
    component.isSearchByIdChange();

    expect(component.searchLabel).toBe(TEXTS_UI.searchByIdLabel);
    expect(heroesServiceSpy.isSearchById.update).toHaveBeenCalled();
    expect(component.resetSearchValue).toHaveBeenCalled();
  });

  it('should show searchLabel if false label and reset search', () => {
    spyOn(component, 'resetSearchValue');

    component.isSearchById.set(false);
    component.isSearchByIdChange();

    expect(component.searchLabel).toBe(TEXTS_UI.searchLabel);
    expect(heroesServiceSpy.isSearchById.update).toHaveBeenCalled();
    expect(component.resetSearchValue).toHaveBeenCalled();
  });

  it('should clear search control and call search', () => {
    component.searchValueControl.setValue('test');
    component.resetSearchValue();

    expect(component.searchValueControl.value).toBe('');
    expect(heroesServiceSpy.search).toHaveBeenCalled();
  });
  
  it('should call addHero when result has id=0', () => {
    const hero: IHero = { id: 0, name: 'Hero' };
    dialogSpy.open.and.returnValue({ afterClosed: () => of(hero) } as any);

    component.openForm(null);

    expect(heroesServiceSpy.addHero).toHaveBeenCalledWith(hero);
  });

  it('should call editHero when result has id!=0', () => {
    const hero: IHero = { id: 5, name: 'Edited Hero' };
    dialogSpy.open.and.returnValue({ afterClosed: () => of(hero) } as any);

    component.openForm(hero);

    expect(heroesServiceSpy.editHero).toHaveBeenCalledWith(hero);
  });

  it('should handle open edit hero', () => {
    const hero: IHero = { id: 1, name: 'edited Hero' };
    dialogSpy.open.and.returnValue({ afterClosed: () => of(hero) } as any);

    component.handleEditHero(hero);

    expect(heroesServiceSpy.editHero).toHaveBeenCalledWith(hero);
  })
  

  it('should do nothing when result is undefined', () => {
    dialogSpy.open.and.returnValue({ afterClosed: () => of(undefined) } as any);

    component.openForm(null);

    expect(heroesServiceSpy.addHero).not.toHaveBeenCalled();
    expect(heroesServiceSpy.editHero).not.toHaveBeenCalled();
  });
  
  it('should call removeHeroById when confirm dialog returns true', () => {
    const hero: IHero = { id: 7, name: 'Deleted hero' };
    dialogSpy.open.and.returnValue({ afterClosed: () => of(true) } as any);

    component.handleDeleteHero(hero);

    expect(heroesServiceSpy.removeHeroById).toHaveBeenCalledWith(7);
  });

  it('should not call removeHeroById when confirm dialog returns false', () => {
    const hero: IHero = { id: 8, name: 'KeepMe' };
    dialogSpy.open.and.returnValue({ afterClosed: () => of(false) } as any);

    component.handleDeleteHero(hero);

    expect(heroesServiceSpy.removeHeroById).not.toHaveBeenCalled();
  });

  it('should update searchTerm when control value changes', fakeAsync(() => {
    // reset spies
    (heroesServiceSpy.searchTerm.update as jasmine.Spy).calls.reset();
    (heroesServiceSpy.search as jasmine.Spy).and.returnValue([]);

    component.searchValueControl.setValue('abcd');
    tick(400); // Advance time by 400ms because of debounce

    expect(heroesServiceSpy.searchTerm.update).toHaveBeenCalled();
  }));
  
  it('should unsubscribe on destroy', () => {
    spyOn(component['valueChangesSubscription'], 'unsubscribe');
    component.ngOnDestroy();
    expect(component['valueChangesSubscription'].unsubscribe).toHaveBeenCalled();
  });
  
});
