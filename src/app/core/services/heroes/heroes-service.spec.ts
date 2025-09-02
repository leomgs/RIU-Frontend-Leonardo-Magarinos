import { TestBed } from '@angular/core/testing';

import { HeroesService } from './heroes-service';
import { IHero } from '../../models/hero.model';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { METHODS, URLS } from '../../constants/urls';

describe('HeroesService', () => {
  let service: HeroesService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  const mockHeroes: IHero[] = [
    { id: 1, name: 'Batman' },
    { id: 2, name: 'Superman' },
    { id: 3, name: 'Hulk' }
  ];

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);

    httpClientSpy.get.and.returnValue(of({}));
    httpClientSpy.post.and.returnValue(of({}));
    httpClientSpy.put.and.returnValue(of({}));
    httpClientSpy.delete.and.returnValue(of({}));
    TestBed.configureTestingModule({
      providers: [
        HeroesService,
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });
    service = TestBed.inject(HeroesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return computed searchObject', () => {
    service.searchTerm.set('batman');
    service.pageIndex.set(2);
    service.pageSize.set(5);
    service.isSearchById.set(true);

    const searchObj = service.searchObject();
    expect(searchObj.term).toBe('batman');
    expect(searchObj.isById).toBeTrue();
    expect(searchObj.pageIndex).toBe(2);
    expect(searchObj.pageSize).toBe(5);
  });

  it('should getHeroes and call fakeApiCall', () => {
    spyOn(service, 'fakeApiCall');
    service.heroes.set([{ id: 1, name: 'Superman' }]);
    const result = service.getHeroes();
    expect(result.length).toBe(1);
    expect(service.fakeApiCall).toHaveBeenCalledWith(URLS.getHeroes, METHODS.get);
  });

  it('should return empty array initially', () => {
    expect(service.getHeroes()).toEqual([]);
    expect(service.heroesDisplay().length).toBe(0);
  });

  it('should add a hero and increment index', () => {
    service.addHero(mockHeroes[0]);
    const heroes = service.getHeroes();

    expect(heroes.length).toBe(1);
    expect(heroes[0].name).toBe('Batman');
    expect(heroes[0].id).toBe(1);

    expect(service.heroesIndex()).toBe(1);
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

 it('should search heroes by name substring', () => {
    service.addHero({ id: 0, name: 'Flash' });
    service.addHero({ id: 0, name: 'Hulk' });

    service.searchTerm.set('flash');
    service.isSearchById.set(false);

    const results = service.search();
    expect(results.length).toBe(1);
    expect(results[0].name).toBe('Flash');
  });

  it('should search hero by id', () => {
    service.addHero({ id: 0, name: 'Aquaman' });

    service.searchTerm.set('1');
    service.isSearchById.set(true);

    const results = service.search();
    expect(results.length).toBe(1);
    expect(results[0].name).toBe('Aquaman');
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

  it('should edit hero and update name', () => {
    service.addHero({ id: 0, name: 'Robin' });
    const hero = service.getHeroes()[0];

    service.editHero({ id: hero.id, name: 'Nightwing' });
    const updatedHero = service.getHeroById(hero.id);

    expect(updatedHero?.name).toBe('Nightwing');
  });

  it('should not edit if hero id does not exist', () => {
    service.addHero({ id: 1, name: 'Deadpool' });
    service.editHero({ id: 999, name: 'Unknown Hero' });

    const heroes = service.getHeroes();
    expect(heroes.length).toBe(1);
    expect(heroes[0].name).toBe('Deadpool');
  });

    it('should update pagination and slice results', () => {
    service.addHero({ id: 0, name: 'Hero1' });
    service.addHero({ id: 0, name: 'Hero2' });
    service.addHero({ id: 0, name: 'Hero3' });
    service.addHero({ id: 0, name: 'Hero4' });

    service.updatePageSearch(2, 1); 
    const results = service.search();

    expect(results.length).toBe(2);
    expect(results[0].name).toBe('Hero3');
    expect(results[1].name).toBe('Hero4');
    expect(service.heroesDisplayTotal()).toBe(4);
  });
});
