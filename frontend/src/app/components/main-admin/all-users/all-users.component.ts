import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { MainAdminService } from 'src/app/services/main-admin.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})
export class AllUsersComponent implements OnInit{
  subscription:Subscription
  id:string;
  users:any = [];
  pageSizeOptions = [10, 25, 50];
  productsPerPage:number;
  totalUsers:any;
  currentPage = 1;
  searchText;
  socket:any;
  constructor(private mainAdminService:MainAdminService) {

  }

  ngOnInit(): void {
    this.subscription = this.mainAdminService.itemsChange.subscribe(()=> {
      this.getAllUsers(this.productsPerPage,this.currentPage);
    })
    this.getAllUsers(this.productsPerPage,this.currentPage);
  }

  private getAllUsers(productsPerPage:number,currentPage:number){
    this.mainAdminService.getAllUsers(productsPerPage || 10,currentPage).subscribe(response =>{
      this.users = response['users'];
      this.totalUsers = response['totalusers'];
    })
  }

  onChangedPage(pageData:PageEvent){
    this.currentPage = pageData.pageIndex + 1;
    this.productsPerPage = pageData.pageSize;
    this.getAllUsers(this.productsPerPage,this.currentPage);
  }

  onMakeAdmin(id:string){
    this.mainAdminService.makeAdmin(id);
  }

  onBanUser(id:string) {
    this.mainAdminService.banUser(id);
  }

  onDeleteUser(id:string) {
    this.mainAdminService.deleteUser(id);
  }

  OnDestroy(){
    this.subscription.unsubscribe()
  }
}
