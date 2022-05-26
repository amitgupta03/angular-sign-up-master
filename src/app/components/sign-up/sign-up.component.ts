import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ProfileUser } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

export function passwordsMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordsDontMatch: true };
    } else {
      return null;
    }
  };
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {

  signUpForm = new FormGroup(
    {
      name: new FormControl('', Validators.required),
      pAddress: new FormControl('', Validators.required),
      tAddress: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      dob: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      caste: new FormControl('', Validators.required),
      occupation: new FormControl('', Validators.required),
      income: new FormControl('', Validators.required),
      nationality: new FormControl('', Validators.required),
      religion: new FormControl('', Validators.required),
      community: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),

    },
    { validators: passwordsMatchValidator() }
  );

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: HotToastService,
    private usersService: UsersService
  ) { }

  ngOnInit(): void { }

  get name() {
    return this.signUpForm.get('name');
  }

  get pAddress() {
    return this.signUpForm.get('pAddress');
  }
  get tAddress() {
    return this.signUpForm.get('tAddress');
  }
  get phone() {
    return this.signUpForm.get('phone');
  }

  get dob() {
    return this.signUpForm.get('dob');
  }

  get email() {
    return this.signUpForm.get('email');
  }

  get password() {
    return this.signUpForm.get('password');
  }

  get confirmPassword() {
    return this.signUpForm.get('confirmPassword');
  }

  get occupation() {
    return this.signUpForm.get('occupation');
  }

  get income() {
    return this.signUpForm.get('income');
  }
  get nationality() {
    return this.signUpForm.get('nationality');
  }
  get religion() {
    return this.signUpForm.get('religion');
  }
  get community() {
    return this.signUpForm.get('community');
  }
  get caste() {
    return this.signUpForm.get('caste');
  }

  submit() {
    if (!this.signUpForm.valid) {
      return;
    }

    const { name, email, password } = this.signUpForm.value;
    this.authService
      .signUp(email, password)
      .pipe(
        switchMap(({ user: { uid } }) =>
          this.usersService.addUser({ uid, email, displayName: name })
        ),
        this.toast.observe({
          success: 'Congrats! You are all signed up',
          loading: 'Signing up...',
          error: ({ message }) => `${message}`,
        })
      )
      .subscribe(() => {
        this.router.navigate(['/profile']);
      });
  }
}
