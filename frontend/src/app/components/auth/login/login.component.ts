import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  subscription:Subscription;
  loginForm:FormGroup;
  forgetPassword = false;
  constructor(
    private router:Router,
    private route:ActivatedRoute,
    private authService:AuthService,
    private toast:HotToastService,
    private userService:UserService
  ){}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('',[Validators.email,Validators.required]),
      password: new FormControl('',Validators.required),
    });
  }

  onRegisterPage() {
    this.router.navigate(['../register'],{relativeTo:this.route});
  }

  onForgotPassword() {
    this.forgetPassword = true;
  }

  @ViewChild('emailverifyForm',{static:false}) emailverifyForm:NgForm;
  onVerifySubmit() {
    this.authService.sendEmail(this.emailverifyForm.value);
  }

  onCancel() {
    this.forgetPassword = false;
  }

  onSubmit() {
    let email = this.loginForm.controls['email'].value;
    let password =this.loginForm.controls['password'].value;
    this.authService.Login(email,password)
  }
}
