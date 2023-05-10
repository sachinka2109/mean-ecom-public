import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { UserComponent } from "./user.component";
import { UserProfileComponent } from './user-profile/user-profile.component';
import { OrdersComponent } from "./orders/orders.component";
import { UserRoutingModule } from "./user-routing.module";
import { OrderDetailComponent } from './orders/order-detail/order-detail.component';

@NgModule({
  declarations: [
    UserComponent,
    OrdersComponent,
    UserProfileComponent,
    OrderDetailComponent,
  ],
  imports: [
    RouterModule,
    SharedModule,
    UserRoutingModule
  ],
})

export class UserModule {}
