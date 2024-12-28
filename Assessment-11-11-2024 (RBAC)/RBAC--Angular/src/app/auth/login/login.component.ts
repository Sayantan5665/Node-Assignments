import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertService, ApiService, AuthService, StorageService } from '@services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private storage = inject(StorageService);
  private auth = inject(AuthService);
  private alert = inject(AlertService);
  private api = inject(ApiService);
  private router = inject(Router);
  private activatedRouter = inject(ActivatedRoute);


  protected form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/)])
  })
  protected tooglePassword = signal<'text' | 'password'>('password');

  constructor() {
    this.activatedRouter.queryParams.subscribe(params => {
      const isVerified = params['verified'];
      if (isVerified && isVerified == 'true') {
        this.alert.toastify('Email verification successful!', 'success');
      } else if(isVerified && isVerified == 'false') {
        this.alert.toastify('Email verification failed.', 'error');
      }
    });
  }

  protected login(form: FormGroup): void {
    if (form.valid) {
      console.log("form: ", form.value);

      this.api.post('login/user', form.value).subscribe({
        next: (res: any) => {
          if (res.status == 200) {
            console.log("res: ", res);
            this.storage.setData(res.data);
            this.auth.isLoggedIn2.set(true);
            this.alert.toastify('Logged in successfully!', 'success');
            this.router.navigate(['/']);
          } else {
            console.error(res.message);
            this.alert.toastify(res.message, 'warning');
          }
        },
        error: (err: any) => {
          console.error('error: ', err);
          this.alert.toastify(err.error.message, 'error');
        }
      })

    } else {
      form.markAllAsTouched();

      /**Scroll to the first invalid field */
      let _form = document.getElementById('login-form');
      if (_form) {
        let firstInvalidControl = _form.getElementsByClassName('ng-invalid')[0];
        console.log("firstInvalidControl: ", firstInvalidControl);
        firstInvalidControl?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }
}
