import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { Product } from 'src/app/models/product.model';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit,OnDestroy{
  products: Product[];
  pageSizeOptions = [ 5, 10, 25, 50];
  productsPerPage:number;
  totalProducts:any;
  currentPage = 1;
  pages:number
  subscription:Subscription;
  constructor(private productService:ProductService){}

  ngOnInit(): void {
    this.subscription = this.productService.productsChanged.subscribe(()=>{
      this.getAdminProduct(this.productsPerPage,this.currentPage);
    })
    this.getAdminProduct(this.productsPerPage,this.currentPage);
  }

  private getAdminProduct(productsPerPage: number,currentPage: number){
    this.productService.getAdminProducts(productsPerPage,currentPage)
    .subscribe((data) =>{
      this.products = data["products"];
      this.totalProducts = data["totalproducts"];
    })
  }

  onChangedPage(pageData:PageEvent){
    console.log(pageData)
    this.currentPage = pageData.pageIndex + 1;
    this.productsPerPage = pageData.pageSize;
    this.getAdminProduct(this.productsPerPage,this.currentPage);
    if (window.innerWidth <= 480) {
      const adminProduct = document.getElementById("adminProduct");
      if (adminProduct) {
        adminProduct.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
