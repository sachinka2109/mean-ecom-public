import { Injectable } from '@angular/core';
import { RestApiService } from './rest-api.service';
import { environment } from 'src/environments/environment';
import { Subject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user:User
  userUpdate$ = new Subject<void>();
  constructor(
    private rest:RestApiService,
    private router:Router
    ) { }

  get refresh() {
    return this.userUpdate$;
  }

  fetchUser() {
    return this.rest.get(environment.REST_API + 'user/profile');
  }

  updateUser(user:User) {
    this.rest.post(environment.REST_API + 'user/update',user)
    .pipe(tap(()=>{
      this.refresh.next();
    }))
    .subscribe(response => {
      if(response['success'] === true){
        return this.router.navigate(['/profile']);
      }
      return response
    })
  }

  becomeSeller() {
    this.rest.post(environment.REST_API + 'user/become-seller',{method: 'Seller'})
    .pipe(tap(()=>{
      this.refresh.next();
    }))
    .subscribe()
  }

  getOrder(){
    return this.rest.get(environment.REST_API + 'user/order')
  }

  getSingleOrder(id:string) {
    return this.rest.get(environment.REST_API + `user/order-detail/${id}`)
  }

  cancelOrder(id:string) {
    this.rest.post(environment.REST_API + `user/order-detail/${id}`,{
      method: 'DELETE',
    })
    .subscribe(res => {
      if(res['success'] === true){
        return this.router.navigate(['/profile/orders'])
      } else {
        return res;
      }
    })
  }

}
