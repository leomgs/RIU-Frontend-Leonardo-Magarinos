import { computed, Injectable, signal } from '@angular/core';
import { IHero } from './models/hero.model';
import { Observable, of } from 'rxjs';
import { ISearch } from './models/search.model';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {
  readonly heroesIndex = signal<number>(0);
  readonly heroes = signal<IHero[]>([]);
  readonly heroesDisplay = signal<IHero[]>([]);
  readonly searchTerm = signal('');
  readonly isSearchById = signal(false);
  readonly pageIndex = signal(0);
  readonly pageSize = signal(1);
  readonly heroesDisplayTotal = signal(0);
  readonly searchObject = computed<ISearch>(
   () => {
    const newObj:ISearch = {
      isById:this.isSearchById(),
      pageIndex: this.pageIndex(),
      pageSize: this.pageSize(),
      term: this.searchTerm()
    }
    return newObj;
   }
  );
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
    //agrego call a search para el caso donde el usuario ingreso un termino de busqueda y al mismo tiempo agrego un nuevo heroe 
    this.search();
  }
  
  removeHeroById(id:number) {
    this.heroes.update(currentArray => [...currentArray.filter(val => val.id !== id)]);
    //agrego call a search para el caso donde el usuario ingreso un termino de busqueda y al mismo tiempo elimino un nuevo heroe 
    this.search();

  }
  
  search() {
    console.log("busqueda heroe", this.searchObject());
    if(this.searchTerm().trim().length === 0) {
      this.heroesDisplay.update(() => this.getHeroes());
    }else if(this.isSearchById()) {
      console.log("busqueda por id");
      let item: IHero | null  = this.getHeroById(Number(this.searchObject().term));
      this.heroesDisplay.update(() => {
        let result = item ? [item]: [];
        return result;
      });
    } else if(!this.isSearchById()) {
      console.log("busqueda por contains");
      this.heroesDisplay.update(() => this.getHeroesByString(this.searchTerm() ?? ''));
    }
    const startIndex = this.pageIndex() * this.pageSize();
    const endIndex = startIndex + this.pageSize();
    console.log("page index",startIndex, endIndex, this.heroesDisplay());
    this.heroesDisplayTotal.update(() => this.heroesDisplay().length);
    this.heroesDisplay.update(() => this.heroesDisplay().slice(startIndex, endIndex))
    return this.heroesDisplay();
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
      this.heroes.update(() => [...currentArray]);
    }
    //agrego call a search para el caso donde el usuario ingreso un termino de busqueda y al mismo tiempo edito un nuevo heroe 
    this.search();
  }
  
  updatePageSearch(pageSize: number,pageIndex:number) {
    this.pageSize.update(() => pageSize);
    this.pageIndex.update(() => pageIndex);
  }
}
