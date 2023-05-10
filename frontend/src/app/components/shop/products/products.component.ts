import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { PageEvent } from '@angular/material/paginator';
import { SocketIoService } from 'src/app/services/socket-io.service';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy{
  subscription:Subscription
  id:string;
  productRating = [];
  maxRating = 5;
  maxRatingArray = [];
  products?:Product[];
  pageSizeOptions = [ 6, 10, 25, 50];
  productsPerPage:number;
  totalProducts:any;
  currentPage = 1;
  searchText:string;
  socket:any;
  combined:any;
  constructor( private socketService:SocketIoService,private productService:ProductService,private cartService:CartService,private router:Router,private route:ActivatedRoute){}
  ngOnInit(): void {
    this.subscription = this.productService.productsChanged.subscribe(()=>{
      this.getAllProducts(this.productsPerPage,this.currentPage);
    })
    this.socketService.listener().subscribe(data => {
      this.getAllProducts(this.productsPerPage,this.currentPage);
    })
    this.getAllProducts(this.productsPerPage,this.currentPage);
    this.maxRatingArray = Array(this.maxRating).fill(0);
  }

  private getAllProducts(productsPerPage: number,currentPage:number) {
    this.productService.getAllProducts(productsPerPage?productsPerPage:6,currentPage).subscribe(response => {
      this.products= response["products"];
      this.totalProducts = response["totalproducts"];
      this.productRating = response["productRating"];
      this.combined = this.products.map((products,i)=> {
        return {products,rating:this.productRating[i]}
      })
    })
  }

  onDetails(id:string) {
    this.router.navigate([`shop/product-detail/${id}`])
  }

  onAddToCart(id:string) {
    this.cartService.addToCart(id);
  }

  onChangedPage(pageData:PageEvent){
    this.currentPage = pageData.pageIndex + 1;
    this.productsPerPage = pageData.pageSize;
    this.getAllProducts(this.productsPerPage,this.currentPage);
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
