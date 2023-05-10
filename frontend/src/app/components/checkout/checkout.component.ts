import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})

export class CheckoutComponent implements OnInit{
  subscription:Subscription;
  cart = [];
  total:number;
  constructor(private cartService:CartService,private router:Router,private route:ActivatedRoute){}

  ngOnInit(): void {
    this.subscription = this.cartService.cartUpdated.subscribe(()=> {
      this.getCartItems();
    })
    this.getCartItems();
  }

  private getCartItems() {
    this.cartService.getCart().subscribe(response => {
      this.cart = response['products'];
      // console.log(this.cart);
      this.total = response['total'];
      // console.log(this.cart.length);
    })
  }

  onCheckOut() {
    // const items = this.cart.map((item) =>{
    //   return item.productId;
    // })
    // console.log(items);
    this.cartService.checkout();
  }

  // onOrder() {
  //   this.cartService.postorder();
  // }

  ngOnDestroy(){
    this.subscription.unsubscribe()
  }
}
