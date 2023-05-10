import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {Router , ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit,OnDestroy{
  userpicture:string;
  username:string;
  useremail:string;
  userphone:number;
  useraddress:any;
  editMode = false;
  changePass = false;
  userForm:FormGroup
  subscription:Subscription
  constructor(private userService:UserService,private router:Router,private route:ActivatedRoute) {}

  ngOnInit(): void {
    this.subscription = this.userService.userUpdate$.subscribe(()=> {
      this.fetchdata();
    })
    this.fetchdata();
    this.route.params.subscribe(() => {
      const url = this.router.url
      if(url.includes('edit')){
        this.editMode = true;
        this.initForm();
      } else {
        this.editMode = false;
      }
    })
  }

  private fetchdata () {
    this.userService.fetchUser().subscribe(response => {
      this.username = response['username'];
      this.userpicture = response['userpicture'];
      this.useremail = response['useremail'];
      this.userphone = response['userphone'];
      this.useraddress = response['useraddress'];
    })
  }

  onEditProfile(){
    this.router.navigate(['/profile/edit']);
  }

  onChangePassword() {
    this.changePass = true;
  }

  onSubmit() {
    this.userService.updateUser(this.userForm.value);
    this.editMode = false;
  }

  // @ViewChild('emailverifyForm',{static:false}) emailverifyForm:NgForm;
  // onVerifySubmit() {
  //   this.userService.sendEmail(this.emailverifyForm.value);
  // }

  // onCancel() {
  //   this.changePass = false;
  // }

  onBecomeSeller() {
    if(confirm('Do you want to Become a Seller?')){
      this.userService.becomeSeller();
    }
  }

  private initForm() {
    let address;
    let name = '';
    let email = '';
    let phone = '';
    let add1 = '';
    let add2 = '';
    let country = '';
    let state = '';
    let city = '';
    let pin ='';
    if(this.editMode) {
      this.userService.fetchUser().subscribe(response => {
        name = response['username'];
        email = response['useremail'];
        phone = response['userphone'];
        address = response['useraddress'];
        add1 = address.add1;
        add2 = address.add2;
        country = address.country;
        state = address.state;
        city = address.city;
        pin = address.postalCode;
        this.userForm = new FormGroup ({
          fullname: new FormControl(name,Validators.required),
          email: new FormControl(email,Validators.required),
          phone: new FormControl(phone,Validators.required),
          add1: new FormControl(add1,Validators.required),
          add2: new FormControl(add2,Validators.required),
          country: new FormControl(country,Validators.required),
          state: new FormControl(state,Validators.required),
          city: new FormControl(city,Validators.required),
          pin: new FormControl(pin,Validators.required),
        })
      });
      this.userForm = new FormGroup ({
        fullname: new FormControl(name,Validators.required),
        email: new FormControl(email,Validators.required),
        phone: new FormControl(phone,Validators.required),
        add1: new FormControl(add1,Validators.required),
        add2: new FormControl(add2,Validators.required),
        country: new FormControl(country,Validators.required),
        state: new FormControl(state,Validators.required),
        city: new FormControl(city,Validators.required),
        pin: new FormControl(pin,Validators.required),
      })
    }
  }

  ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }
}
