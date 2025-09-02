import { Component, model, OnDestroy, signal, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TEXTS_UI } from './core/constants/texts_ui';
import { MatDialog } from '@angular/material/dialog';
import { HeroFormDialog } from './shared/hero-form-dialog/hero-form-dialog';
import { IHero } from './core/models/hero.model';
import { HeroesService } from './core/services/heroes/heroes-service';
import { SharedModule } from './shared/shared-module';
import { ConfirmDialogData } from './core/models/confirm-dialog.model';
import { ConfirmDialog } from './shared/confirm-dialog/confirm-dialog';
import { debounceTime, distinctUntilChanged, Subscription, switchMap } from 'rxjs';
import { LoadingSpinner } from "./shared/loading-spinner/loading-spinner";

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
    LoadingSpinner
],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnDestroy {
  private dialogService = inject(MatDialog);
  private heroService = inject(HeroesService);

  readonly title = signal('RIU-Frontend-Leonardo-Magarinos');
  isSearchById = model(false);
  searchLabel = TEXTS_UI.searchLabel;
  searchValueControl = new FormControl('', {nonNullable: true});
  TEXTS_UI = TEXTS_UI;
  private valueChangesSubscription!: Subscription;

  constructor(){
    this.addSearchControlListener();
  }

  ngOnDestroy(): void {
    if (this.valueChangesSubscription) 
      this.valueChangesSubscription.unsubscribe();
  }

  addSearchControlListener() {
    this.valueChangesSubscription = this.searchValueControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(() => {
        this.heroService.searchTerm.update(() => this.searchValueControl.value);
        return this.heroService.search()
      })
    ).subscribe((results) => {
      console.log("Updated results:", results);
    });
  }
  
  onInput(event: Event) {
    let value = (event.target as HTMLInputElement).value;
    
    if(this.isSearchById()){
      value = value.replaceAll(/\D+/g,'');
    }
    this.searchValueControl.patchValue(value);
  }
  isSearchByIdChange() {
    this.searchLabel = this.isSearchById() ? TEXTS_UI.searchByIdLabel: TEXTS_UI.searchLabel;
    this.heroService.isSearchById.update(() => this.isSearchById());
    this.resetSearchValue();
  }
  resetSearchValue() {
    this.searchValueControl.patchValue('', {emitEvent: true});
    this.heroService.search();
  }
  openForm(hero: IHero | null = null){
    const dialogRef = this.dialogService.open(HeroFormDialog, {
      data: {hero},
    });

    dialogRef.afterClosed().subscribe((result:IHero)=> {
      if (result !== undefined) {
        if(result.id === 0) {
          this.heroService.addHero(result);
        }else {
          this.heroService.editHero(result);
        }
      }
    });
  }

  handleEditHero(hero: IHero) {
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
