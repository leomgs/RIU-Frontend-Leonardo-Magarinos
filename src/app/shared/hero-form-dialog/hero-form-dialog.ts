import { Component, inject, model } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { IHero } from "../../core/models/hero.model";
import { TEXTS_UI } from "../../core/constants/texts_ui";
import { UppercaseDirective } from "../directives/uppercase";

@Component({
  selector: 'hero-form-dialog',
  templateUrl: './hero-form-dialog.html',
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
  ],
})
export class HeroFormDialog {
  readonly dialogRef = inject(MatDialogRef<HeroFormDialog>);
  readonly data:{hero:IHero | null} = inject(MAT_DIALOG_DATA);
  readonly name = model(this.data.hero ? this.data.hero.name : '');
  readonly id = model(this.data.hero ? this.data.hero.id : 0);
  TEXTS_UI = TEXTS_UI;

  sendResult() {
    const result : IHero = {
        name: this.name().trim(),
        id: this.id(),
    };
    return result; 
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  isValidName() {
    return this.name().trim().length > 0;
  }
  
  displayActionLabel() {
    return this.id() === 0 ? TEXTS_UI.add: TEXTS_UI.save;
  }
  displayActionHeader() {
    return this.id() === 0 ? TEXTS_UI.add: TEXTS_UI.edit;
  }
}