import { Injectable, signal } from '@angular/core';
import { IHero } from './models/hero.model';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {
  private heroes = signal<IHero[]>([]);
  
  getHeroes(): IHero[] {
   return this.heroes(); 
  }
  addHero(hero:IHero) {
    this.heroes.update(currentArray => [...currentArray, hero]);
  }
  removeHeroById(id:number) {
    this.heroes.update(currentArray => [...currentArray.filter(val => val.id !== id)]);
  }
  getHeroById(id:number): IHero | null {
    const result = this.heroes().find(val => val.id === id);
    return result ?? null;
  }
  getHeroesByString(value:string): IHero[] {
    return this.heroes().filter(val => val.name.toUpperCase().includes(value.toUpperCase()));
  }
  editHero(hero:IHero) {
    this.heroes.update(currentArray => {
      const heroIndex = this.heroes().findIndex(val => val.id === hero.id);
      if(heroIndex !== -1)
        currentArray[heroIndex] = {...hero};

      return currentArray;
    });
  }
}
