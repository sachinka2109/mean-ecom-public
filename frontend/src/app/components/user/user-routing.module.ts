import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UserComponent } from "./user.component";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { OrdersComponent } from "./orders/orders.component";
import { AuthGuard } from "../auth/auth.guard";
import { OrderDetailComponent } from "./orders/order-detail/order-detail.component";

const routes:Routes = [
  {path: '',component:UserComponent,canActivate:[AuthGuard] ,children: [
    {path:'',redirectTo: 'user', pathMatch:'full'},
    {path:'user',component:UserProfileComponent},
    {path:'edit', component:UserProfileComponent},
    {path: 'orders',component:OrdersComponent},
    {path:'order-detail/:id',component:OrderDetailComponent},
  ]},
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class UserRoutingModule {

}
