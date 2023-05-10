import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-resetpass',
  templateUrl: './resetpass.component.html',
  styleUrls: ['./resetpass.component.css']
})
export class ResetpassComponent implements OnInit{
  id: string;
  subscription:Subscription;
  constructor(private authService:AuthService,private router:Router,private route:ActivatedRoute){

  }

  ngOnInit(): void {
    this.subscription = this.route.params.subscribe(params => {
      this.id = params['token'];
    })
  }

  @ViewChild('passChangeForm',{static:false}) passChangeForm:NgForm;
  onSubmitPassReset(){
    this.authService.passChange(this.passChangeForm.value,this.id)
  }

  onCancel() {
    this.router.navigate(['user']);
  }

  ngOnDestroy(){
    this.subscription.unsubscribe()
  }
}
