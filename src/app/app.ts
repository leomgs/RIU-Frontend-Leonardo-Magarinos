import { Component, model, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TEXTS_UI } from './core/constants/texts_ui';
import { MatDialog } from '@angular/material/dialog';
import { HeroFormDialog } from './shared/hero-form-dialog/hero-form-dialog';
import { IHero } from './core/models/hero.model';
import { HeroesService } from './core/heroes-service';
import { SharedModule } from './shared/shared-module';
import { ConfirmDialogData } from './core/models/confirm-dialog.model';
import { ConfirmDialog } from './shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-root',
  imports: [
    FormsModule, 
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatIcon,
    MatToolbarModule,
    SharedModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  readonly title = signal('RIU-Frontend-Leonardo-Magarinos');
  isSearchById = model(false);
  searchLabel = TEXTS_UI.searchLabel;
  searchValueControl = new FormControl('', {nonNullable: true});
  TEXTS_UI = TEXTS_UI;
  

  constructor(
    private dialogService: MatDialog,
    private heroService: HeroesService
  ){}
  onInput(event: Event) {
    console.log((event.target as HTMLInputElement).value);
    
    this.searchValueControl.patchValue((event.target as HTMLInputElement).value);
  }
  isSearchByIdChange() {
    console.log(this.isSearchById());
    this.searchLabel = this.isSearchById() ? TEXTS_UI.searchByIdLabel: TEXTS_UI.searchLabel;
    this.resetSearchValue();
  }
  resetSearchValue() {
    this.searchValueControl.reset();
  }
  openForm(hero: IHero | null = null){
    const dialogRef = this.dialogService.open(HeroFormDialog, {
      data: {hero},
    });

    dialogRef.afterClosed().subscribe((result:IHero)=> {
      console.log('The dialog was closed');
      if (result !== undefined) {
        if(result.id === 0) {
          this.heroService.addHero(result);
          console.log('heroe agregado:', result);
        }else {
          this.heroService.editHero(result);
          console.log('heroe editado:', result);
        }
        console.log('heroes actuales:', this.heroService.getHeroes());
      }
    });
  }
  
  handleEditHero(hero: IHero) {
    hero.name = hero.name;
    this.openForm(hero);
  }

  handleDeleteHero(hero: IHero) {
    const dialogData: ConfirmDialogData = {
      title: TEXTS_UI.confirm,
      message: TEXTS_UI.deleteMessageWithId(hero.id)
    };   
    const dialogRef = this.dialogService.open(ConfirmDialog, {
      data: dialogData,
      minWidth: '250px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true)
        this.heroService.removeHeroById(hero.id);
    });
  }
}
