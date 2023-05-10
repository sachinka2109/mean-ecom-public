import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartService } from '../../../services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-checkout-success',
  templateUrl: './checkout-success.component.html',
  styleUrls: ['./checkout-success.component.css']
})
export class CheckoutSuccessComponent implements OnInit{
  token: string;
  sessionData: any;
  subscription:Subscription
  constructor(
    private cartService:CartService,
    private router:Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.token = params['token'];
      if(this.token) {
        this.cartService.postorder(this.token);
      } else {
        this.router.navigate(['checkout']);
      }
    })
  }

  goOrders() {
    this.router.navigate(['/orders']);
  }
}
