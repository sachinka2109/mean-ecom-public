import { Injectable } from '@angular/core';
import { RestApiService } from './rest-api.service';
import { environment } from 'src/environments/environment';
import { Subject, tap } from 'rxjs';
import { Router } from '@angular/router';
import {loadStripe} from '@stripe/stripe-js';
import { LoaderService } from '../components/shared/loader.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartUpdated = new Subject<void>();
  payment_success = false;
  constructor(private rest:RestApiService,private router:Router,private loader:LoaderService) {
  }
  get refresh() {
    return this.cartUpdated;
  }

  getCart() {
    return this.rest.get(environment.REST_API + 'shop/cart');
  }

  updateCartQuantity(prodId: string,quantity:number) {
    this.rest.post(environment.REST_API + 'shop/cart/update',{prodId: prodId, quantity: quantity})
    .pipe(tap(() =>{
      this.refresh.next();
    }))
    .subscribe()
  }

  addToCart(prodId:string){
    this.rest.post(environment.REST_API + 'shop/cart',{prodId:prodId})
    .pipe(tap(()=>{
      this.refresh.next();
    }))
    .subscribe()
  }

  deleteCartItem(id:string) {
    this.rest.post(environment.REST_API + 'shop/cart/delete', {prodId:id})
    .pipe(tap(()=>{
      this.refresh.next();
    }))
    .subscribe()
  }

  clearCart() {
    this.rest.post(environment.REST_API + 'shop/cart/clear',{})
    .pipe(tap(()=>{
      this.refresh.next();
    }))
    .subscribe()
  }

  checkout() {
    this.loader.isLoading.next(true);
    return this.rest.get(environment.REST_API + 'shop/checkout')
      .subscribe(response => {
        this.loader.isLoading.next(false);
        loadStripe(environment.STRIPE_KEY)
          .then(stripe => {
            stripe.redirectToCheckout({
              sessionId: response['sessionId'],
            });
          })
          .catch(error => {
            console.error(error);
          });
      });
  }

  postorder(token) {
    this.rest.post(environment.REST_API + `shop/order/${token}`,{}).subscribe(response =>{
      this.router.navigate(['/profile/orders']);
    });
  }
}
