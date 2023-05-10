import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { RouterModule } from "@angular/router";
import { MainAdminComponent } from "./main-admin.component";
import { MainAdminRoutingModule } from "./main-admin-routing.module";
import { AllOrdersComponent } from './all-orders/all-orders.component';
import { AllProductsComponent } from './all-products/all-products.component';
import { AllUsersComponent } from './all-users/all-users.component';
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { AllOrderDetailComponent } from './all-orders/all-order-detail/all-order-detail.component';

@NgModule({
  declarations: [
    MainAdminComponent,
    AllOrdersComponent,
    AllProductsComponent,
    AllUsersComponent,
    AllOrderDetailComponent
  ],
  imports: [
    RouterModule,
    SharedModule,
    MainAdminRoutingModule,
    Ng2SearchPipeModule,
  ],
})
export class MainAdminModule {}
