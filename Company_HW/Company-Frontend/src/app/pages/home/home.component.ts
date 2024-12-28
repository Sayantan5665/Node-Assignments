import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService, ApiService } from '@services';
import { ViewModalComponent } from 'src/app/shared/view-modal/view-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private readonly api = inject(ApiService);
  private readonly alert = inject(AlertService);
  private readonly dialog = inject(MatDialog);

  protected banners:Array<any> = [];

  constructor() {
    this.getBanner();
  }

  private getBanner() {
    this.api.get('home/banner/fetch-all').subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.banners = res.data;
          // console.log("this.banners: ", this.banners);
        } else {
          console.error(res.message);
          this.alert.toastify(res.message, 'warning');
        }
      },
      error: (err: any) => {
        console.error('error: ', err);
        this.alert.toastify(err.message, 'error');
      }
    })
  }

  protected viewBannerDetails(banner:any) {
    const dialogRef = this.dialog.open(ViewModalComponent, {
      width: '700px',
      minHeight: '300px',
      // disableClose: true,
      // autoFocus: false,
      // panelClass: ['modal-class'],
      data: { modal: 'view-banner-details', banner: banner }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('modal closed');
    });
  }
}
