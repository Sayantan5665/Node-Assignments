import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-deafult-modal',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './deafult-modal.component.html',
  styleUrl: './deafult-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeafultModalComponent {
  readonly dialogRef = inject(MatDialogRef<DeafultModalComponent>);
  readonly data = inject(MAT_DIALOG_DATA);

  constructor(private dialog: MatDialog) {
    console.log("data: ", this.data);
  }

  public closeModal(): void {
    this.dialogRef.close();
  }
}
