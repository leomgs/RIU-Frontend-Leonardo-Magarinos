import { Component,computed,inject, model } from "@angular/core";
import { FormControl, FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { IHero, IKeyValue } from "../../core/models/hero.model";
import { TEXTS_UI } from "../../core/constants/texts_ui";
import { UppercaseDirective } from "../directives/uppercase";
import { MatChipsModule } from "@angular/material/chips";
import { POWERS_MOCK } from "../../core/constants/mock_data";

@Component({
  selector: 'app-hero-form-dialog',
  templateUrl: './hero-form-dialog.html',
  styleUrl: './hero-form-dialog.scss',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    UppercaseDirective,
    MatChipsModule,
],
})
export class HeroFormDialog {
  readonly dialogRef = inject(MatDialogRef<HeroFormDialog>);
  readonly data:{hero:IHero | null} = inject(MAT_DIALOG_DATA);
  readonly name = model(this.data.hero ? this.data.hero.name : '');
  readonly description = model(this.data.hero ? this.data.hero.description : '');
  readonly powers = model<IKeyValue<string>[]>(this.data.hero ? [...this.data.hero.powers] : []);
  readonly id = model(this.data.hero ? this.data.hero.id : 0);
  powersControl = new FormControl([]);
  validForm = computed(() => {
    if(this.id() === 0)
      return this.isValidName() && this.isValidDescription();
    if(this.name().length === 0 || this.description().length === 0)
      return false;
    return this.isValidName() || this.isValidDescription() || this.isValidPowers();
  });

  TEXTS_UI = TEXTS_UI;
  powersList: IKeyValue<string>[] = POWERS_MOCK;

  sendResult() {
    const result : IHero = {
        name: this.name().trim(),
        id: this.id(),
        description: this.description().trim(),
        powers: this.powers()
    };
    return result; 
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  
  isValidName() {
    return this.id() === 0 ? this.name().trim().length > 0 : this.name().trim().length > 0 && this.data.hero?.name !== this.name() ;
  }
  
  isValidDescription() {
    return this.id() === 0 ? this.description().trim().length > 0 : this.description().trim().length > 0 && this.data.hero?.description !== this.description();
  }
  
  isValidPowers() {
    if(this.id() !== 0) {
      if (this.data.hero?.powers.length !== this.powers().length) {
        return true;
      }
      return !this.data.hero?.powers.every((element, index) => element === this.powers()[index]);
    }
    return true;
  }
  
  displayActionLabel() {
    return this.id() === 0 ? TEXTS_UI.add: TEXTS_UI.save;
  }

  displayActionHeader() {
    return this.id() === 0 ? TEXTS_UI.add: TEXTS_UI.edit;
  }

  checkSelected(selected: IKeyValue<string>) {
    return this.powers().some((val)=> val.id === selected.id);
  }
}