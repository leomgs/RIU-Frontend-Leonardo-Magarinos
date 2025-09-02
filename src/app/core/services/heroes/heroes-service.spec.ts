import { TestBed } from '@angular/core/testing';

import { HeroesService } from './heroes-service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { METHODS, URLS } from '../../constants/urls';
import { MOCK_HEROES } from '../../constants/mock_data';

describe('HeroesService', () => {
  let service: HeroesService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

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
    service.heroes.set([MOCK_HEROES[1]]);
    const result = service.getHeroes();
    expect(result.length).toBe(1);
    expect(service.fakeApiCall).toHaveBeenCalledWith(URLS.getHeroes, METHODS.get);
  });

  it('should return empty array initially', () => {
    expect(service.getHeroes()).toEqual([]);
    expect(service.heroesDisplay().length).toBe(0);
  });

  it('should add a hero and increment index', () => {
    service.addHero(MOCK_HEROES[0]);
    const heroes = service.getHeroes();

    expect(heroes.length).toBe(1);
    expect(heroes[0].name).toBe('Batman');
    expect(heroes[0].id).toBe(1);

    expect(service.heroesIndex()).toBe(1);
    expect(service.getHeroes()).toEqual([MOCK_HEROES[0]]);
  });

  it('should add multiple heroes', () => {
    MOCK_HEROES.forEach(hero => service.addHero(hero));
    expect(service.getHeroes().length).toBe(MOCK_HEROES.length);
  });

  it('should remove hero by id', () => {
    MOCK_HEROES.forEach(hero => service.addHero(hero));
    service.removeHeroById(2);
    expect(service.getHeroes().find(h => h.id === 2)).toBeUndefined();
    expect(service.getHeroes().length).toBe(MOCK_HEROES.length - 1);
  });

  it('should return a hero by id', () => {
    service.addHero(MOCK_HEROES[0]);
    const hero = service.getHeroById(1);
    expect(hero).toEqual(MOCK_HEROES[0]);
  });

 it('should search heroes by name substring', () => {
    service.addHero(MOCK_HEROES[0]);
    service.addHero(MOCK_HEROES[2]);

    service.searchTerm.set('Hulk');
    service.isSearchById.set(false);

    const results = service.search();
    expect(results.length).toBe(1);
    expect(results[0].name).toBe('Hulk');
  });

  it('should search hero by id', () => {
    service.addHero(MOCK_HEROES[0]);

    service.searchTerm.set('1');
    service.isSearchById.set(true);

    const results = service.search();
    expect(results.length).toBe(1);
    expect(results[0].name).toBe('Batman');
  });

  it('should filter heroes by string', () => {
    MOCK_HEROES.forEach(hero => service.addHero(hero));
    const result = service.getHeroesByString('man');
    expect(result.map(h => h.name)).toContain('Batman');
    expect(result.map(h => h.name)).toContain('Superman');
    expect(result.map(h => h.name)).not.toContain('Hulk');
  });

  it('should edit a hero if exists', () => {
    service.addHero(MOCK_HEROES[0]);
    service.editHero({ id: 1, name: 'Wolverine',description:'Wolverine desc',powers:[] });

    const hero = service.getHeroById(1);
    expect(hero?.name).toBe('Wolverine');
  });

  it('should edit hero and update name', () => {
    service.addHero({ id: 0, name: 'Robin', description:'Robin desc', powers:[] });
    const hero = service.getHeroes()[0];

    service.editHero({ id: hero.id, name: 'Nightwing',description: 'Not Robin.',powers:[] });
    const updatedHero = service.getHeroById(hero.id);

    expect(updatedHero?.name).toBe('Nightwing');
  });

  it('should not edit if hero id does not exist', () => {
    service.addHero({ id: 0, name: 'Deadpool', description:'desc',powers:[] });
    service.editHero({ id: 999, name: 'Unknown Hero', description: 'desc', powers:[] });

    const heroes = service.getHeroes();
    expect(heroes.length).toBe(1);
    expect(heroes[0].name).toBe('Deadpool');
  });

  it('should update pagination and slice results', () => {
    service.addHero(MOCK_HEROES[0]);
    service.addHero(MOCK_HEROES[1]);
    service.addHero(MOCK_HEROES[2]);
    service.addHero(MOCK_HEROES[3]);  

    service.updatePageSearch(2, 1); 
    const results = service.search();

    expect(results.length).toBe(2);
    console.log(results);
    expect(results[0].name).toBe(MOCK_HEROES[2].name);
    expect(results[1].name).toBe(MOCK_HEROES[3].name);
    expect(service.heroesDisplayTotal()).toBe(4);
  });
});
