import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit{
  subscription:Subscription
  orders = [];
  products = [];
  total:number;
  constructor(private userService:UserService,private router:Router,private route:ActivatedRoute) {}

  ngOnInit(): void {
    this.subscription = this.userService.getOrder()
    .subscribe(response =>{
      this.orders = response['orders'];
      this.total = response['total'];
    });
  }

  ngOnDestroy(){
    this.subscription.unsubscribe()
  }
}
