import { Component, computed, Signal, inject, output } from '@angular/core';
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
  heroService = inject(HeroesService);

  editHeroEvent = output<IHero>();
  deleteHeroEvent = output<IHero>();
  dataSet!: Signal<IHero[]>;
  displayedColumns: string[] = ['id', 'name', 'actions'];
  pageSize = 3;
  pageIndex = 0;

  constructor(){
    this.heroService.updatePageSearch(this.pageSize,this.pageIndex)
    this.dataSet = computed(this.heroService.heroesDisplay);
  }
  editHero(hero:IHero){
    this.editHeroEvent.emit(hero);
  }
  deleteHero(hero:IHero) {
    this.deleteHeroEvent.emit(hero);
  }
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.heroService.updatePageSearch(this.pageSize,this.pageIndex);
    this.heroService.search();
  }
}
