import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

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
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  subscription:Subscription;
  registerForm:FormGroup;
  pattern = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
  constructor(
    private router:Router,
    private route:ActivatedRoute,
    private authService:AuthService,
    private toast:HotToastService,

    ){}

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      name: new FormControl('',Validators.required),
      email: new FormControl('',[Validators.email,Validators.required]),
      phone: new FormControl('',[Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
      password: new FormControl('',[
        Validators.required,
        Validators.pattern(this.pattern)
      ]),
      confirmPassword: new FormControl('',[
        Validators.required,
      ]),
    },{validators: passwordsMatchValidator()});
  }

  onLoginPage() {
    this.router.navigate(['../login'],{relativeTo:this.route});
  }

  onSubmit() {
    let name = this.registerForm.controls['name'].value;
    let email = this.registerForm.controls['email'].value;
    let phone = this.registerForm.controls['phone'].value;
    let password =this.registerForm.controls['password'].value;
    this.authService.Register(email,name,phone,password)
  }

}
