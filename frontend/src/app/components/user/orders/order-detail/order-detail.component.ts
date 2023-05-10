import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { UserService } from '../../../../services/user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  order;
  id:string;
  total;
  subscription:Subscription
  constructor(
    private userService:UserService,
    private cartService:CartService,
    private router:Router,
    private route:ActivatedRoute,
    private _location:Location
    ) {}

  ngOnInit(): void {
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

  onCancelOrder() {
    if(confirm('Are you sure you want to cancel')) {
      this.userService.cancelOrder(this.id);
    }
  }

  ngOnDestroy(){
    this.subscription.unsubscribe()
  }
}
