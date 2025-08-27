import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroTableComponent } from './table';
import { signal } from '@angular/core';
import { IHero } from '../../core/models/hero.model';
import { HeroesService } from '../../core/heroes-service';

class MockHeroesService {
  heroes = signal<IHero[]>([
    { id: 1, name: 'Batman' },
    { id: 2, name: 'Superman' }
  ]);
}

describe('HeroTableComponent', () => {
  let component: HeroTableComponent;
  let fixture: ComponentFixture<HeroTableComponent>;
  let mockService: MockHeroesService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroTableComponent], // since it’s standalone
      providers: [{ provide: HeroesService, useClass: MockHeroesService }]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroTableComponent);
    component = fixture.componentInstance;
    mockService = TestBed.inject(HeroesService) as unknown as MockHeroesService;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize displayedColumns correctly', () => {
    expect(component.displayedColumns).toEqual(['id', 'name', 'actions']);
  });

  it('should read heroes from the service signal', () => {
    const heroes = component.dataSet();
    expect(heroes.length).toBe(2);
    expect(heroes[0].name).toBe('Batman');
  });

  it('should emit editHeroEvent when editHero is called', () => {
    const hero: IHero = { id: 99, name: 'Spiderman' };
    spyOn(component.editHeroEvent, 'emit');

    component.editHero(hero);

    expect(component.editHeroEvent.emit).toHaveBeenCalledWith(hero);
  });

  it('should emit deleteHeroEvent when deleteHero is called', () => {
    const hero: IHero = { id: 100, name: 'Ironman' };
    spyOn(component.deleteHeroEvent, 'emit');

    component.deleteHero(hero);

    expect(component.deleteHeroEvent.emit).toHaveBeenCalledWith(hero);
  });
});