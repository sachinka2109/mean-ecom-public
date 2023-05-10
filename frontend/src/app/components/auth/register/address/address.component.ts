import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit{
  addressForm: FormGroup;
  editMode = false;
  constructor(private authService:AuthService,private userService:UserService) {}

  ngOnInit(): void {
    this.initForm();
  }

  onSubmit(): void {
    // this.authService.Register(email,name,phone,password)
    this.authService.submitAddress(this.addressForm.value);
  }


  private initForm() {
    let address;
    let add1 = '';
    let add2 = '';
    let country = '';
    let state = '';
    let city = '';
    let pin ='';
    this.userService.fetchUser().subscribe(response => {
      address = response['useraddress'];
      add1 = address.add1;
      add2 = address.add2;
      country = address.country;
      state = address.state;
      city = address.city;
      pin = address.postalCode;
      this.addressForm = new FormGroup ({
        add1: new FormControl(add1,Validators.required),
        add2: new FormControl(add2,Validators.required),
        country: new FormControl(country,Validators.required),
        state: new FormControl(state,Validators.required),
        city: new FormControl(city,Validators.required),
        pin: new FormControl(pin,Validators.required),
      })
    });
    this.addressForm = new FormGroup ({
      add1: new FormControl(add1,Validators.required),
      add2: new FormControl(add2,Validators.required),
      country: new FormControl(country,Validators.required),
      state: new FormControl(state,Validators.required),
      city: new FormControl(city,Validators.required),
      pin: new FormControl(pin,Validators.required),
    })
  }
}
