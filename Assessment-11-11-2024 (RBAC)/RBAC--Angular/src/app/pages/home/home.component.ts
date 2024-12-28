import { Component, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AlertService, ApiService } from '@services';
import { RouterLink} from '@angular/router';
import { LineClampPipe } from '@pipes';

export interface PeriodicElement {
  image: string,
  name: string,
  price: number,
  description: string,
  type: string,
  status: string,
  id: string
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, RouterLink, LineClampPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private api = inject(ApiService);
  private alert = inject(AlertService);

  displayedColumns: string[] = ['image', 'name', 'price', 'description', 'type', 'status', 'action'];
  dataSource!: MatTableDataSource<PeriodicElement>;

  constructor() {
    this.fetchAllPRoducts();
  }

  private fetchAllPRoducts() {
    let rowData: any[] = [];
    this.api.get('get/products').subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          // console.log("product list: ", res.data);
          res.data.forEach((prod: any) => {
            rowData.push({
              image: prod.images ? prod.images[0] : '',
              name: prod.name,
              price: prod.price,
              description: prod.description,
              type: prod.product_type,
              status: prod.status,
              id: prod._id
            })
          })
          this.dataSource = new MatTableDataSource(rowData);
        }
        else {
          this.alert.toastify(res.message || 'Failed to fetch products', 'warning');
        }
      },
      error: (error) => {
        this.alert.toastify(error.error.message || 'Failed to fetch products', 'error');
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteProduct(id: string) {
    this.api.delete('delete/product/'+id).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          const data = this.dataSource.data;
          const index = data.findIndex(p => p.id === id);
          data.splice(index, 1);
          this.dataSource = new MatTableDataSource(data);
          this.alert.toastify('Product deleted successfully', 'success');
        }
        else {
          this.alert.toastify(res.message || 'Failed to delete products', 'warning');
        }
      },
      error: (error) => {
        this.alert.toastify(error.error.message || 'Failed to fetch products', 'error');
      }
    })
  }
}
