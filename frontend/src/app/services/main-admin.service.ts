import { Injectable } from '@angular/core';
import { RestApiService } from './rest-api.service';
import { environment } from 'src/environments/environment';
import { Subject, tap } from 'rxjs';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class MainAdminService {
  itemsChange = new Subject<void>();
  constructor(
    private rest:RestApiService,
    private productService:ProductService
    ) { }

  get refresh() {
    return this.itemsChange;
  }

  getAllOrders(productsPerPage:number,currentPage:number) {
    return this.rest.get(environment.REST_API + `main-admin/orders?pagesize=${productsPerPage}&page=${currentPage}`);
  }

  getAllUsers(productsPerPage:number,currentPage:number) {
    return this.rest.get(environment.REST_API + `main-admin/users?pagesize=${productsPerPage}&page=${currentPage}`);
  }

  statusChange(id:string,status:string) {
    this.rest.post(environment.REST_API + 'main-admin/status',{id:id,status:status})
    .pipe(tap(()=> {
      this.refresh.next();
    }))
    .subscribe()
  }

  itemStatusChange(id:string,prodId:string,status:string) {
    this.rest.post(environment.REST_API + 'main-admin/item-status',{id:id,prodId:prodId,status:status})
    .pipe(tap(()=> {
      this.refresh.next();
    }))
    .subscribe()
  }

  toggleFeature(id:string) {
    this.rest.post(environment.REST_API + 'main-admin/toggle-feature',{id:id})
    .pipe(tap(()=> {
      this.productService.refresh.next();
    }))
    .subscribe()
  }

  deleteOrder(id:string){
    this.rest.post(environment.REST_API + `main-admin/delete-order?id=${id}`,{})
    .pipe(tap(()=> {
      this.refresh.next();
    }))
    .subscribe()
  }

  makeAdmin(id:string){
    this.rest.post(environment.REST_API + 'main-admin/make-admin',{id:id})
    .pipe(tap(()=> {
      this.refresh.next();
    }))
    .subscribe()
  }

  banUser(id:string){
    this.rest.post(environment.REST_API + `main-admin/ban-user?id=${id}`,{})
    .pipe(tap(()=> {
      this.refresh.next();
    }))
    .subscribe()
  }

  deleteUser(id:string){
    this.rest.post(environment.REST_API + `main-admin/delete-user?id=${id}`,{})
    .pipe(tap(()=> {
      this.refresh.next();
    }))
    .subscribe()
  }
}
