import { Component, computed, EventEmitter, Output, Signal } from '@angular/core';
import { HeroesService } from '../../core/heroes-service';
import { IHero } from '../../core/models/hero.model';
import { MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-hero-table',
  imports: [MatTableModule,MatIcon, MatButtonModule,MatTooltip],
  templateUrl: './table.html',
  styleUrl: './table.scss'
})
export class HeroTableComponent{
  @Output('editHeroEvent') editHeroEvent: EventEmitter<IHero> = new EventEmitter<IHero>();
  @Output('deleteHeroEvent') deleteHeroEvent: EventEmitter<IHero> = new EventEmitter<IHero>();
  dataSet!: Signal<IHero[]>;
  displayedColumns: string[] = ['id', 'name', 'actions'];
  constructor(private heroService:HeroesService){
    this.dataSet = computed(this.heroService.heroes);
  }
  editHero(hero:IHero){
    console.log("hero to edit:", hero);
    this.editHeroEvent.emit(hero);
  }
  deleteHero(hero:IHero) {
    console.log("hero to delete:",hero);
    this.deleteHeroEvent.emit(hero);
  }
}
