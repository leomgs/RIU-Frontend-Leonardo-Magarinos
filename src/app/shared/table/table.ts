import { Component, computed, EventEmitter, Output, Signal } from '@angular/core';
import { HeroesService } from '../../core/services/heroes/heroes-service';
import { IHero } from '../../core/models/hero.model';
import { MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-hero-table',
  imports: [
    MatTableModule,
    MatIcon,
    MatButtonModule,
    MatTooltip,
    MatPaginatorModule
  ],
  templateUrl: './table.html',
  styleUrl: './table.scss'
})
export class HeroTableComponent{
  @Output('editHeroEvent') editHeroEvent: EventEmitter<IHero> = new EventEmitter<IHero>();
  @Output('deleteHeroEvent') deleteHeroEvent: EventEmitter<IHero> = new EventEmitter<IHero>();
  dataSet!: Signal<IHero[]>;
  displayedColumns: string[] = ['id', 'name', 'actions'];
  pageSize:number = 3;
  pageIndex: number = 0;
  constructor(public heroService:HeroesService){
    this.heroService.updatePageSearch(this.pageSize,this.pageIndex)
    this.dataSet = computed(this.heroService.heroesDisplay);
  }
  editHero(hero:IHero){
    console.log("hero to edit:", hero);
    this.editHeroEvent.emit(hero);
  }
  deleteHero(hero:IHero) {
    console.log("hero to delete:",hero);
    this.deleteHeroEvent.emit(hero);
  }
  onPageChange(event: PageEvent) {
    console.log("page change",event); 
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.heroService.updatePageSearch(this.pageSize,this.pageIndex);
    this.heroService.search();
  }
}
