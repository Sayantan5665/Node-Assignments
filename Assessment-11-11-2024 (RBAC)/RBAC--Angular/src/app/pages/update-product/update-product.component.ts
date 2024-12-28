import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, ApiService } from '@services';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [MatIconModule, ReactiveFormsModule, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.scss'
})
export class UpdateProductComponent {
  private api = inject(ApiService);
  private alert = inject(AlertService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  private productId: string | null = null;
  protected images: Array<{ file: any, url: string }> = [];
  protected form: FormGroup = new FormGroup({
    imageArr: new FormControl(''),
    name: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    product_type: new FormControl('New'),
  });

  constructor() {
    this.productId = this.activatedRoute.snapshot.paramMap.get('id');
    console.log("productId: ", this.productId);
    if (this.productId) this.fetchProduct(this.productId);
    else this.alert.toastify('Could not find id from url.', 'error')
  }

  private fetchProduct(id: string) {
    this.api.get(`get/products/${id}`).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          console.log("product: ", res.data);
          const product = res.data;
          this.form.patchValue({
            name: product.name,
            price: product.price,
            description: product.description,
            product_type: product.product_type,
          });
          product.images && product.images.map((image: string) => {
            this.images.push({ file: image, url: image });
          })
          this.form.markAllAsTouched();
        }
        else {
          this.alert.toastify(res.message || 'Failed to fetch product', 'warning');
          console.log("res: ", res);
        }
      },
      error: (error: any) => {
        this.alert.toastify(error.error.message || 'Failed to fetch product', 'error');
        console.log("error.message: ", error);

      }
    });
  }

  protected handleImages(event: any) {
    console.log("event: ", event.target?.files);
    Object.values(event.target?.files as Array<File>).forEach((file: File) => {
      if (this.checkType(file)) {
        this.images.push({ file: file, url: URL.createObjectURL(file) })
      }
    })
  }

  removeImage(index: number, image: File | string): void {
    if (this.images.length <= 1) {
      this.alert.toastify('At least one image is required', 'warning');
      return;
    } else {
      this.images.splice(index, 1);
      const inputElement: any = document.getElementById('file-upload');
      inputElement && (inputElement.values = []);

      if (typeof image === 'string') {
        this.deleteImage(image);
      }
    }
  }

  private checkType(file: File) {
    return file.type.split('/')[0] === 'image' ? true : false;
  }

  protected deleteImage(image: string) {
    this.api.post(`delete/product/image/${this.productId}`, { image }).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          // console.log("deleted image: ", res.data);
          this.alert.toastify(res.message || 'Image deleted successfully', 'success');
        }
        else {
          this.alert.toastify(res.message || 'Failed to delete image', 'warning');
        }
      },
      error: (error) => {
        this.alert.toastify(error.error.message || 'Failed to delete image', 'error');
      }
    });
  }

  protected updateProduct() {
    if (this.form.valid) {
      this.form.removeControl('imageArr');

      const formData: any = new FormData();

      Object.keys(this.form.value).forEach((key: string) => {
        formData.append(key, this.form.value[key]);
      });

      console.log("this.images: ", this.images);
      this.images.forEach((img: any) => {
        if (typeof img.file == "string") {
          formData.append('images', img.file)
        } else {
          formData.append('images', img.file, img.file.name);
        }
      });

      this.api.put(`update/product/${this.productId}`, formData).subscribe({
        next: (res: any) => {
          if (res.status == 200) {
            console.log("updated product: ", res.data);
            this.alert.toastify(res.message || 'Product updated successfully', 'success');
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
      let _form = document.getElementById('update-product-form');
      if (_form) {
        let firstInvalidControl = _form.getElementsByClassName('ng-invalid')[0];
        console.log("firstInvalidControl: ", firstInvalidControl);
        firstInvalidControl?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }
}
