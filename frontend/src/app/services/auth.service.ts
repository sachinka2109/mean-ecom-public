import { Injectable } from '@angular/core';
import { RestApiService } from './rest-api.service';
import { environment } from 'src/environments/environment';
import { HotToastService } from '@ngneat/hot-toast';
import { Router, ActivatedRoute } from '@angular/router';
import { address } from '../models/address.model';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // success: boolean;
  user = new BehaviorSubject<string>(localStorage.getItem('token') || null);
  clearTimeout :any;
  constructor(private rest:RestApiService,private toast: HotToastService,private router:Router,private route:ActivatedRoute) {}

  Register(email:string,name:string,phone:number,password:string) {
    return this.rest
      .post(environment.REST_API + 'auth/register',{
        email:email,
        name:name,
        phone:phone,
        password:password
      })
      .subscribe(response =>{
        if(response['success'] === true) {
          return this.Login(email, password);
        } else {
          return response;
        }
      });
  }

  Login(email:string,password:string) {
    return this.rest
      .post(environment.REST_API + 'auth/login',{
        email:email,
        password:password
      })
      .subscribe(response =>{
        console.log(response);
        if(response['success'] === true) {
          localStorage.setItem('token', response['token']);
          localStorage.setItem('userId',response['userId']);
          localStorage.setItem('userName', response['userName']);
          localStorage.setItem('userSeller',response['userSeller']);
          localStorage.setItem('userAdmin',response['userAdmin']);
          const remainingtime = 60 * 60 * 10000;
          const expiresIn = new Date(new Date().getTime() + +remainingtime);
          localStorage.setItem('expires', expiresIn.toISOString());
          this.autoLogout(remainingtime);
          this.user.next(localStorage.getItem('token'));
        }
        return this.router.navigate(['/auth/address']);
      })
  }

  sendEmail(emailverifyForm) {
    this.rest.post(environment.REST_API + 'auth/reset',emailverifyForm)
    .subscribe(response => {
      console.log(response)
    })
  }

  passChange(passChangeForm,id) {
    console.log(passChangeForm);
    console.log(id)
    this.rest.post(environment.REST_API + 'auth/reset-pass',{passForm:passChangeForm,token:id})
    .subscribe(response => {
      return this.router.navigate(['/auth/login']);
    })
  }

  submitAddress(address:address) {
    this.rest.post(environment.REST_API + 'auth/address',address)
    .subscribe(response =>{
      return this.router.navigate(['/']);
    })
  }

  logoutHandler() {
    this.user.next(null);
    this.toast.info('You have been logged out');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expires');
    localStorage.removeItem('userName');
    localStorage.removeItem('userSeller');
    localStorage.removeItem('userAdmin');
    if(this.clearTimeout) {
      clearTimeout(this.clearTimeout);
    }
  }

  autoLogout(remainingtime:number) {
    this.clearTimeout = setTimeout(() => {
      this.logoutHandler();
      this.router.navigate(['/auth/login']);
    }, remainingtime);
  }

}
