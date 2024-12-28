import { Component, effect, inject, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { AlertService, ApiService, AuthService, StorageService } from '@services';
import {MatTooltip, MatTooltipModule} from '@angular/material/tooltip';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, MatIcon, MatTooltip],
  providers: [TitleCasePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private alert = inject(AlertService);
  private storage = inject(StorageService);
  private titleCasePipe = inject(TitleCasePipe);

  protected editing:WritableSignal<boolean> = signal<boolean>(false);
  protected user:any = this.auth.getUserData();
  protected form:FormGroup = new FormGroup({
    image: new FormControl(''),
    name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    role: new FormControl(''),
  });
  protected profileImage: string = '';

  constructor() {
    this.user.role = this.titleCasePipe.transform(this.user.role);

    effect(() => {
      const isEditing = this.editing();
      if (isEditing) {
        this.form.enable();
        this.form.controls['role'].disable();
      } else {
        this.user.role = this.titleCasePipe.transform(this.user.role);
        this.form.disable();
        this.form.patchValue(this.user);
        this.form.controls['image'].patchValue(this.user.image);
        this.profileImage = this.user.image;
      }
    });

    this.form.patchValue(this.user);
    this.form.controls['image'].patchValue(this.user.image);
    this.profileImage = this.user.image;
  }

  protected handleImageUpload(file: any) {
    const img:File = file.target.files[0];
    if (img && this.checkType(img)) {
      this.form.controls['image'].patchValue(img);
      this.profileImage = URL.createObjectURL(img);
    }
  }

  private checkType(file: File) {
    return file.type.split('/')[0] === 'image' ? true : false;
  }

  protected updateProfile() {
    //update/user/:id
    if (this.form.valid) {
      this.form.controls['role'].disable();
      console.log("this.form.value: ", this.form.value);

      const formData: any = new FormData();

      Object.keys(this.form.value).forEach((key: string) => {
        formData.append(key, this.form.value[key]);
      });

      this.api.put(`update/user/${this.user.id}`, formData).subscribe({
        next: (res: any) => {
          if (res.status == 200) {
            console.log("updated user: ", res.data);
            this.storage.setData(res.data);
            this.user = this.auth.getUserData();
            this.auth.profileUpdated.set(Math.random());
            this.editing.set(false);
            this.alert.toastify(res.message || 'User details updated successfully', 'success');
          }
          else {
            this.alert.toastify(res.message || 'Failed to fetch user details', 'warning');
          }
        },
        error: (error) => {
          this.alert.toastify(error.error.message || 'Failed to update user details', 'error');
        },
        complete: () => {
          this.form.controls['role'].enable();
        }
      })
    } else {
      this.form.markAllAsTouched();
      /**Scroll to the first invalid field */
      let _form = document.getElementById('update-user-form');
      if (_form) {
        let firstInvalidControl = _form.getElementsByClassName('ng-invalid')[0];
        console.log("firstInvalidControl: ", firstInvalidControl);
        firstInvalidControl?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }
}
