import { computed, Injectable, signal } from '@angular/core';
import { IHero } from '../../models/hero.model';
import { ISearch } from '../../models/search.model';
import { HttpClient } from '@angular/common/http';
import { debounceTime, take } from 'rxjs';
import { METHODS, URLS } from '../../constants/urls';

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
  
  constructor(private httpClient:HttpClient){}

  getHeroes(): IHero[] {
    this.fakeApiCall(URLS.getHeroes,METHODS.get);
    return this.heroes(); 
  }
  
  addHero(hero:IHero) {
    this.heroesIndex.update(currentIndex => currentIndex + 1);
    let newHero = {
      id: this.heroesIndex(),
      name: hero.name,
    }
    this.heroes.update(currentArray => [...currentArray, newHero]);
    // added call to search to update results 
    this.search();
    this.fakeApiCall(URLS.hero,METHODS.post);
  }
  
  removeHeroById(id:number) {
    this.heroes.update(currentArray => [...currentArray.filter(val => val.id !== id)]);
    // added call to search to update results
    this.search();
    this.fakeApiCall(URLS.hero,METHODS.delete);
  }
  
  search() {
    if(this.searchTerm().trim().length === 0) {
      this.heroesDisplay.update(() => this.getHeroes());
    }else if(this.isSearchById()) {
      let item: IHero | null  = this.getHeroById(Number(this.searchObject().term));
      this.heroesDisplay.update(() => {
        let result = item ? [item]: [];
        return result;
      });
    } else if(!this.isSearchById()) {
      this.heroesDisplay.update(() => this.getHeroesByString(this.searchTerm() ?? ''));
    }
    const startIndex = this.pageIndex() * this.pageSize();
    const endIndex = startIndex + this.pageSize();
    this.heroesDisplayTotal.update(() => this.heroesDisplay().length);
    this.heroesDisplay.update(() => this.heroesDisplay().slice(startIndex, endIndex))

    this.fakeApiCall(URLS.search,METHODS.post);
    return this.heroesDisplay();
  }
  
  getHeroById(id:number): IHero | null {
    const result = this.heroes().find(val => val.id === id);
    this.fakeApiCall(URLS.getHeroes,METHODS.get);
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

  fakeApiCall(url:string,method: string, timeout: number = 1000, errorMsg:string = 'error', obj: any = null) {
    if(method === METHODS.post) {
      this.httpClient.post(URLS.search, obj)
      .pipe(
        take(1),
        debounceTime(timeout)
      ).subscribe({
        next: () => {
          this.logApiCall(url);
        },
        error: () => {
          console.log(errorMsg);
        }
      });
    } else if(method === METHODS.get){
      this.httpClient.get(url)
      .pipe(
        take(1),
        debounceTime(timeout)
      ).subscribe({
        next: () => {
          this.logApiCall(url);
        },
        error: () => {
          console.log(errorMsg);
        }
      });
    } else if(method === METHODS.put) {
      this.httpClient.put(url,obj)
      .pipe(
        take(1),
        debounceTime(timeout)
      ).subscribe({
        next: () => {
          this.logApiCall(url);
        },
        error: () => {
          console.log(errorMsg);
        }
      });
    } else if(method === METHODS.delete) {
      this.httpClient.delete(url)
      .pipe(
        take(1),
        debounceTime(timeout)
      ).subscribe({
        next: () => {
          this.logApiCall(url);
        },
        error: () => {
          console.log(errorMsg);
        }
      });
    }    
  }
  
  logApiCall(url: string) {
    console.log("Api called with: ", url);
  }
}
