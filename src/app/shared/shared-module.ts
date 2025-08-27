import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroTableComponent } from './table/table';
import { HeroFormDialog } from './hero-form-dialog/hero-form-dialog';



@NgModule({
  imports: [
    CommonModule,
    HeroFormDialog,
    HeroTableComponent
  ],
  exports: [HeroFormDialog,HeroTableComponent]
})
export class SharedModule { }
