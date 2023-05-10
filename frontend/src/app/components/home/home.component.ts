import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { SocketIoService } from 'src/app/services/socket-io.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy{
  subscription:Subscription;
  productRating = [];
  maxRating = 5;
  maxRatingArray = [];
  newproducts:Product[] = [];
  featuredProducts:Product[] = [];
  todayDealProducts:Product[] = [];
  pageSizeOptions = [4];
  totalNewProducts:any;
  totalFeaturedProducts:any;
  totalTodaysProducts:any;
  todaysCombined;
  newCombined;
  FeaturedCombined;
  currentPage = 1;
  constructor(private productService:ProductService,private socketService:SocketIoService){}

  ngOnInit(): void {
    this.subscription = this.productService.productsChanged.subscribe(()=>{
      this.getNewProducts(this.currentPage);
      this.getFeaturedProducts(this.currentPage);
      this.getTodaysDeal(this.currentPage);
    })
    this.socketService.listener().subscribe(data => {
      this.getNewProducts(this.currentPage);
      this.getFeaturedProducts(this.currentPage);
      this.getTodaysDeal(this.currentPage);
    })
    this.getNewProducts(this.currentPage);
    this.getFeaturedProducts(this.currentPage);
    this.getTodaysDeal(this.currentPage);
    this.maxRatingArray = Array(this.maxRating).fill(0);
  }

  private getNewProducts(currentPage:number) {
    this.productService.getNewProducts(currentPage).subscribe(response => {
      this.newproducts= response["products"];
      this.totalNewProducts = response["totalproducts"];
      let productRating = response["productRating"]
      this.newCombined = this.newproducts.map((products,i) => {
        return {products,rating:productRating[i]}
      })
    })
  }

  private getTodaysDeal(currentPage:number) {
    this.productService.getTodaysDeal(currentPage).subscribe(response => {
      this.todayDealProducts = response['products'];
      this.totalTodaysProducts = response['totalproducts'];
      let productRating = response["productRating"]
      this.todaysCombined = this.todayDealProducts.map((products,i) => {
        return {products,rating:productRating[i]}
      })
    });
  }

  private getFeaturedProducts(currentPage: number){
    this.productService.getFeaturedProducts(currentPage).subscribe(response=> {
      this.featuredProducts = response['products'];
      this.totalFeaturedProducts = response['totalproducts'];
      let productRating = response["productRating"]
      this.FeaturedCombined = this.featuredProducts.map((products,i) => {
        return {products,rating:productRating[i]}
      })
    })
  }

  onNewProdPageChange(pageData:PageEvent){
    this.currentPage = pageData.pageIndex + 1;
    this.getNewProducts(this.currentPage);
    const newproducts = document.getElementById("newproducts");
    if (window.innerWidth <= 480) {
      if (newproducts) {
        newproducts.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  onFeatureProPageChange(pageData:PageEvent){
    this.currentPage = pageData.pageIndex + 1;
    this.getFeaturedProducts(this.currentPage);
    const featuredProducts = document.getElementById("featuredProducts");
    if (window.innerWidth <= 480) {
      if (featuredProducts) {
        featuredProducts.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  onTodaysDealPageChange(pageData:PageEvent){
    this.currentPage = pageData.pageIndex + 1;
    this.getTodaysDeal(this.currentPage);
    if (window.innerWidth <= 480) {
      const todayDealProducts = document.getElementById("todayDealProducts");
      if (todayDealProducts) {
        todayDealProducts.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  ngOnDestroy(){
    this.subscription.unsubscribe()
  }
}
