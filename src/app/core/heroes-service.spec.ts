import { TestBed } from '@angular/core/testing';

import { HeroesService } from './heroes-service';
import { IHero } from './models/hero.model';

describe('HeroesService', () => {
  let service: HeroesService;
  const mockHeroes: IHero[] = [
    { id: 1, name: 'Batman' },
    { id: 2, name: 'Superman' },
    { id: 3, name: 'Hulk' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeroesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return empty array initially', () => {
    expect(service.getHeroes()).toEqual([]);
  });

  it('should add a hero', () => {
    service.addHero(mockHeroes[0]);
    expect(service.getHeroes()).toEqual([mockHeroes[0]]);
  });

  it('should add multiple heroes', () => {
    mockHeroes.forEach(hero => service.addHero(hero));
    expect(service.getHeroes().length).toBe(3);
  });

  it('should remove hero by id', () => {
    mockHeroes.forEach(hero => service.addHero(hero));
    service.removeHeroById(2);
    expect(service.getHeroes().find(h => h.id === 2)).toBeUndefined();
    expect(service.getHeroes().length).toBe(2);
  });

  it('should return a hero by id', () => {
    service.addHero(mockHeroes[0]);
    const hero = service.getHeroById(1);
    expect(hero).toEqual(mockHeroes[0]);
  });

  it('should return null if hero id not found', () => {
    const hero = service.getHeroById(999);
    expect(hero).toBeNull();
  });

  it('should filter heroes by string', () => {
    mockHeroes.forEach(hero => service.addHero(hero));
    const result = service.getHeroesByString('man');
    expect(result.map(h => h.name)).toContain('Batman');
    expect(result.map(h => h.name)).toContain('Superman');
    expect(result.map(h => h.name)).not.toContain('Hulk');
  });

  it('should edit a hero if exists', () => {
    service.addHero({ id: 1, name: 'Flash' });
    service.editHero({ id: 1, name: 'Wolverine' });

    const hero = service.getHeroById(1);
    expect(hero?.name).toBe('Wolverine');
  });

  it('should not edit if hero id does not exist', () => {
    service.addHero({ id: 1, name: 'Deadpool' });
    service.editHero({ id: 999, name: 'Unknown Hero' });

    const heroes = service.getHeroes();
    expect(heroes.length).toBe(1);
    expect(heroes[0].name).toBe('Deadpool');
  });
});
