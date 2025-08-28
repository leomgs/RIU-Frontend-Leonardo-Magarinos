import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroTableComponent } from './table';
import { signal } from '@angular/core';
import { IHero } from '../../core/models/hero.model';
import { HeroesService } from '../../core/heroes-service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

const mockHeroes: IHero[] = [
  { id: 1, name: 'Batman' },
  { id: 2, name: 'Superman' }
];

describe('HeroTableComponent', () => {
  let component: HeroTableComponent;
  let fixture: ComponentFixture<HeroTableComponent>;
  let heroesServiceSpy: jasmine.SpyObj<HeroesService>;

  beforeEach(async () => {
    heroesServiceSpy = jasmine.createSpyObj('HeroesService', [
      'updatePageSearch',
      'search'
    ], {
      heroesDisplay: signal<IHero[]>(mockHeroes),
      heroes: signal<IHero[]>(mockHeroes),
      heroesDisplayTotal: signal<number>(2),

    });

    await TestBed.configureTestingModule({
      imports: [
        HeroTableComponent, MatPaginatorModule
      ],
      providers: [{ provide: HeroesService, useValue: heroesServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
 it('should call updatePageSearch on init', () => {
    expect(heroesServiceSpy.updatePageSearch).toHaveBeenCalledWith(3, 0);
  });

  it('should emit editHeroEvent when editHero is called', () => {
    const hero: IHero = { id: 99, name: 'Flash' };
    spyOn(component.editHeroEvent, 'emit');

    component.editHero(hero);

    expect(component.editHeroEvent.emit).toHaveBeenCalledWith(hero);
  });

  it('should emit deleteHeroEvent when deleteHero is called', () => {
    const hero: IHero = { id: 100, name: 'Green Lantern' };
    spyOn(component.deleteHeroEvent, 'emit');

    component.deleteHero(hero);

    expect(component.deleteHeroEvent.emit).toHaveBeenCalledWith(hero);
  });

  it('should update pageIndex and pageSize on page change', () => {
    const event: PageEvent = { pageIndex: 2, pageSize: 10, length: 30 };
    component.onPageChange(event);

    expect(component.pageIndex).toBe(2);
    expect(component.pageSize).toBe(10);
    expect(heroesServiceSpy.updatePageSearch).toHaveBeenCalledWith(10, 2);
    expect(heroesServiceSpy.search).toHaveBeenCalled();
  });
});