import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MainAdminService } from 'src/app/services/main-admin.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-all-order-detail',
  templateUrl: './all-order-detail.component.html',
  styleUrls: ['./all-order-detail.component.css']
})
export class AllOrderDetailComponent implements OnInit{
  order;
  id:string;
  total;
  subscription:Subscription;
  constructor(
    private _location:Location,
    private userService:UserService,
    private mainAdminService:MainAdminService,
    private router:Router,
    private route:ActivatedRoute,
    ){

  }

  ngOnInit():void {
    this.subscription = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.getSingleOrder();
    })
  }

  private getSingleOrder() {
    this.userService.getSingleOrder(this.id).subscribe(data => {
      this.order = data['order'];
      this.total = data['total'];
    });
  }

  onGoBack() {
    this._location.back();
  }

  onStatusChange(id:string,event:string) {
    this.mainAdminService.statusChange(id,event);
  }

  onitemStatusChange(id:string,prodId:string,event:string){
    this.mainAdminService.itemStatusChange(id,prodId,event);
  }

  OnDestroy(){
    this.subscription.unsubscribe()
  }
}
