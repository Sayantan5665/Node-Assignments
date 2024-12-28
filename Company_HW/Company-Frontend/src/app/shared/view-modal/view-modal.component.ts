import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-view-modal',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './view-modal.component.html',
  styleUrl: './view-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewModalComponent {
  readonly dialogRef = inject(MatDialogRef<ViewModalComponent>);
  readonly data = inject(MAT_DIALOG_DATA);

  constructor(private dialog: MatDialog) {
    console.log("data: ", this.data);
  }

  public closeModal(): void {
    this.dialogRef.close();
  }
}
