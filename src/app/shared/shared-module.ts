import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroTableComponent } from './table/table';
import { HeroFormDialog } from './hero-form-dialog/hero-form-dialog';
import { ConfirmDialog } from './confirm-dialog/confirm-dialog';
import { UppercaseDirective } from './directives/uppercase';



@NgModule({
  imports: [
    CommonModule,
    HeroFormDialog,
    HeroTableComponent,
    ConfirmDialog,
    UppercaseDirective,
  ],
  exports: [HeroFormDialog,HeroTableComponent,UppercaseDirective]
})
export class SharedModule { }
