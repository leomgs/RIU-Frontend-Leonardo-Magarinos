import { Injectable, signal } from '@angular/core';
import { IHero } from './models/hero.model';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {
  readonly heroesIndex = signal<number>(0);
  readonly heroes = signal<IHero[]>([]);
  
  getHeroes(): IHero[] {
   return this.heroes(); 
  }
  addHero(hero:IHero) {
    this.heroesIndex.update(currentIndex => currentIndex + 1);
    let newHero = {
      id: this.heroesIndex(),
      name: hero.name,
    }
    this.heroes.update(currentArray => [...currentArray, newHero]);
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
    const heroIndex = this.heroes().findIndex(val => val.id === hero.id);
    let currentArray = this.heroes();
    if(heroIndex !== -1){
      currentArray[heroIndex].name =hero.name;
      this.heroes.update(array => [...currentArray]);
    }
  }
}
