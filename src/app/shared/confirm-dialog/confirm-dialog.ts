import { Component, inject } from '@angular/core';
import { TEXTS_UI } from '../../core/constants/texts_ui';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { ConfirmDialogData } from '../../core/models/confirm-dialog.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm-dialog',
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss'
})
export class ConfirmDialog {
  TEXTS_UI = TEXTS_UI;
  readonly dialogRef = inject(MatDialogRef<ConfirmDialogData>);
  readonly data: ConfirmDialogData = inject(MAT_DIALOG_DATA);
  readonly message: string = this.data.message;
  readonly title: string = this.data.title;
}
