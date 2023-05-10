import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { map ,take } from "rxjs";
import { UserService } from "src/app/services/user.service";


@Injectable({providedIn:'root'})
export class AuthGuard {
    user:any;
    constructor(private userService:UserService,private router:Router){

    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
      return this.userService.fetchUser().pipe(
        take(1),
        map(user =>{
          const admin = user['userAdmin'];
          if(admin === true) {
            return true;
          }
          return this.router.createUrlTree(['/auth/login']);
        })
      )
    }
}
