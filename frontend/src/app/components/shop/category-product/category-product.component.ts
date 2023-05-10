import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { SocketIoService } from 'src/app/services/socket-io.service';

@Component({
  selector: 'app-category-product',
  templateUrl: './category-product.component.html',
  styleUrls: ['./category-product.component.css'],
})
export class CategoryProductComponent implements OnInit, OnDestroy{
  id:string;
  categoryId:string;
  productRating = [];
  maxRating = 5;
  maxRatingArray = [];
  products:Product[];
  subscription:Subscription
  pageSizeOptions = [ 6, 10, 25, 50];
  productsPerPage:number;
  totalProducts:any;
  currentPage = 1;
  searchText:any;
  socket;
  combined:any;
  constructor(private socketService:SocketIoService,private productService:ProductService,private cartService:CartService,private router:Router,private route:ActivatedRoute){

  }


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.categoryId = params['id'];
      this.getCategoryProducts(this.productsPerPage,this.currentPage);
    })
    this.subscription = this.productService.productsChanged.subscribe(()=>{
      this.getCategoryProducts(this.productsPerPage,this.currentPage);
    })
    this.socketService.listener().subscribe(data => {
      this.getCategoryProducts(this.productsPerPage,this.currentPage);
    })
    this.getCategoryProducts(this.productsPerPage,this.currentPage);
    this.maxRatingArray = Array(this.maxRating).fill(0);
  }

  private getCategoryProducts(productsPerPage: number,currentPage: number) {
    this.productService.getCategoryProducts(this.categoryId,productsPerPage?productsPerPage:6,currentPage).subscribe(response => {
      this.products = response["products"];
      this.totalProducts = response["totalproducts"];
      this.productRating = response["productRating"];
      this.combined = this.products.map((products,i)=> {
        return {products,rating:this.productRating[i]}
      })
    })
  }

  onDetails(id:string) {
    this.router.navigate([`/shop/product-detail/${id}`])
  }

  onAddToCart(id:string) {
    this.cartService.addToCart(id)
    // console.log(id)
  }

  onChangedPage(pageData:PageEvent){
    this.currentPage = pageData.pageIndex + 1;
    this.productsPerPage = pageData.pageSize;
    this.getCategoryProducts(this.productsPerPage,this.currentPage);
    if (window.innerWidth <= 480) {
      const productBody = document.getElementById("productBody");
      if (productBody) {
        productBody.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
