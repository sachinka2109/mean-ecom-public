import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import {Subscription } from 'rxjs';
import { SocketIoService } from 'src/app/services/socket-io.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit,OnDestroy{
  show = false;
  cart = [];
  subscription:Subscription
  total:number;
  socket;
  // cartUpdated$ = new BehaviorSubject<Object>([]);
  constructor(private cartService:CartService,private socketService:SocketIoService) {

  }

  ngOnInit(): void {
    this.subscription = this.cartService.cartUpdated.subscribe(()=> {
      this.getCartItems();
    })
    this.getCartItems();
    this.socketService.listener().subscribe(data => {
      if(data.action === 'update',data.action === 'delete') {
        this.getCartItems();
      }
    })
  }

  private getCartItems() {
    this.cartService.getCart().subscribe(response => {
      this.cart = response['products'];
      console.log(this.cart);
      this.total = response['total'];
    })
  }

  inc(id:string,quantity:number){
    let newQuantity = quantity + 1;
    this.onupdateQuantity(id, newQuantity)
    // console.log(newQuantity);
    // console.log(id)
  }

  dec(id:string,quantity:number) {
    let newQuantity = quantity - 1;
    this.onupdateQuantity(id, newQuantity)
    // console.log(newQuantity);
  }

  onupdateQuantity(id:string, quantity:number){
    this.cartService.updateCartQuantity(id, quantity)
  }

  onDeleteCartItem(id:string) {
    this.cartService.deleteCartItem(id);
    // console.log(id)
  }

  onEmptyCart() {
    this.cartService.clearCart();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
