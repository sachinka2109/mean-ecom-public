import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { MainAdminService } from 'src/app/services/main-admin.service';
import { ProductService } from 'src/app/services/product.service';
import { SocketIoService } from 'src/app/services/socket-io.service';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent {
  subscription:Subscription
  id:string;
  products?:Product[];
  pageSizeOptions = [10, 25, 50];
  productsPerPage:number;
  totalProducts:any;
  currentPage = 1;
  searchText;
  socket:any;
  featureMode:boolean;
  constructor(
    private socketService:SocketIoService,
    private productService:ProductService,
    private mainAdminService:MainAdminService,
    private router:Router,
    private route:ActivatedRoute,
    private toast:HotToastService
    ){}

  ngOnInit(): void {
    this.subscription = this.productService.productsChanged.subscribe(()=>{
      this.getAllProducts(this.productsPerPage,this.currentPage);
    })
    this.socketService.listener().subscribe(data => {
      this.getAllProducts(this.productsPerPage,this.currentPage);
    })
    this.getAllProducts(this.productsPerPage,this.currentPage);
  }

  private getAllProducts(productsPerPage: number,currentPage:number) {
    this.productService.getAllProducts(productsPerPage || 10,currentPage).subscribe(response => {
      this.products= response["products"];
      this.totalProducts = response["totalproducts"];
    })
  }

  onEdit(id:string) {
    this.router.navigate([`/main-admin/${id}/edit`]);
  }

  onDelete(id:string){
    this.productService.deleteProduct(id);
  }

  onToggleFeature(id:string) {
    this.mainAdminService.toggleFeature(id);
  }

  onChangedPage(pageData:PageEvent){
    this.currentPage = pageData.pageIndex + 1;
    this.productsPerPage = pageData.pageSize;
    this.getAllProducts(this.productsPerPage,this.currentPage);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
