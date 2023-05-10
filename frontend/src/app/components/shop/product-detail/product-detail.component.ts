import { Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { ProductService } from '../../../services/product.service';
import { CartService } from 'src/app/services/cart.service';
import {Location} from '@angular/common';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit,OnDestroy {
  id:string;
  product;
  @Input() maxRating = 5;
  @Input() selectedStar = 0;
  previousSelection = 0;
  maxRatingArray:any  = [];
  productRating:number;
  subscription:Subscription
  observer = new Subject<void>();
  constructor(
    private cartService:CartService,
    private productService:ProductService,
    private route:ActivatedRoute,
    private _location: Location){}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.subscription = this.productService.productsChanged.subscribe(()=> {
      this.getDetails();
    })
    this.getDetails()
    this.maxRatingArray = Array(this.maxRating).fill(0);
  }


  getDetails() {
    this.productService.getDetails(this.id)
    .subscribe(data => {
      this.product = data["product"];
      this.productRating = data["productRating"];
    })
  }

  onGoBack() {
    this._location.back();
  }

  onAddToCart() {
    this.cartService.addToCart(this.id.toString());
  }

  HandleMouseEnter(index:number) {
    this.selectedStar = index+1;
  }
  HandleMouseLeave(){
    if(this.previousSelection !== 0){
      this.selectedStar = this.previousSelection;
    } else {
      this.selectedStar = 0;
    }
  }
  Rating(index:number) {
    this.selectedStar = index+1;
    this.previousSelection = this.selectedStar;
  }


  @ViewChild('ratingForm',{static:false}) ratingForm:NgForm;
  onRatingSubmit(){
    this.productService.postRating(this.id,this.ratingForm.value,this.selectedStar);
    this.ratingForm.reset();
  }

  ngOnDestroy(){
    this.subscription.unsubscribe()
  }

}
