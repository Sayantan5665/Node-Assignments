import { Component, ElementRef, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AlertService, ApiService } from '@services';
import { provideNgxMask, NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [MatIconModule, ReactiveFormsModule, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.scss'
})
export class CreateProductComponent {
  private api = inject(ApiService);
  private alert = inject(AlertService);
  private router = inject(Router);

  protected images: Array<{ file: any, url: string }> = [];
  protected form: FormGroup = new FormGroup({
    imageArr: new FormControl(''),
    name: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    product_type: new FormControl('New'),
  });

  protected handleImages(event: any) {
    console.log("event: ", event.target?.files);
    Object.values(event.target?.files as Array<File>).forEach((file: File) => {
      if (this.checkType(file)) {
        this.images.push({ file: file, url: URL.createObjectURL(file) })
      }
    })
  }

  removeImage(index: number) {
    this.images.splice(index, 1);
    const inputElement: any = document.getElementById('file-upload');
    inputElement && (inputElement.values = []);
  }

  private checkType(file: File) {
    return file.type.split('/')[0] === 'image' ? true : false;
  }

  protected createProduct() {
    if (this.form.valid) {
      this.form.removeControl('imageArr');

      const formData: any = new FormData();

      Object.keys(this.form.value).forEach((key: string) => {
        formData.append(key, this.form.value[key]);
      });

      this.images.forEach((img: any) => {
        formData.append('images', img.file, img.file.name);
      });

      this.api.post('/create/product', formData).subscribe({
        next: (res: any) => {
          if (res.status == 200) {
            console.log("product : ", res.data);
            this.alert.toastify(res.message || 'Product created successfully', 'success');
            this.router.navigate(['/home']);
          }
          else {
            this.alert.toastify(res.message || 'Failed to fetch products', 'warning');
          }
        },
        error: (error) => {
          this.alert.toastify(error.error.message || 'Failed to fetch products', 'error');
        }
      })
    } else {
      this.form.markAllAsTouched();
      /**Scroll to the first invalid field */
      let _form = document.getElementById('add-product-form');
      if (_form) {
        let firstInvalidControl = _form.getElementsByClassName('ng-invalid')[0];
        console.log("firstInvalidControl: ", firstInvalidControl);
        firstInvalidControl?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }
}
