import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MainAdminService } from 'src/app/services/main-admin.service';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.css']
})
export class AllOrdersComponent implements OnInit{
  subscription:Subscription
  id:string;
  orders:any = [];
  total:any;
  pageSizeOptions = [10, 25, 50];
  productsPerPage:number;
  totalOrders;
  currentPage = 1;
  searchText;
  constructor(private mainAdminService:MainAdminService,private router:Router,private route:ActivatedRoute) {}

  ngOnInit(): void {
    this.subscription = this.mainAdminService.itemsChange.subscribe(()=> {
      this.getAllOrders(this.productsPerPage,this.currentPage);
    })
    this.getAllOrders(this.productsPerPage,this.currentPage);
  }

  private getAllOrders(productsPerPage:number,currentPage:number) {
    this.mainAdminService.getAllOrders(productsPerPage || 10,currentPage).subscribe(response => {
      this.orders = response['orders'];
      this.totalOrders = response['totalorders'];
      this.total = response['total'];
      console.log(this.orders);
      console.log(this.total);
    })
  }

  onDetail(id:string) {
    this.router.navigate(['/main-admin/order-details/' + id])
  }

  onDeleteOrder(id:string){
    this.mainAdminService.deleteOrder(id);
  }

  onChangedPage(pageData:PageEvent){
    this.currentPage = pageData.pageIndex + 1;
    this.productsPerPage = pageData.pageSize;
    this.getAllOrders(this.productsPerPage,this.currentPage);
  }

  OnDestroy(){
    this.subscription.unsubscribe()
  }
}
