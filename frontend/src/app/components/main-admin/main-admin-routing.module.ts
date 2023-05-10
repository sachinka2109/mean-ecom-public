import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MainAdminComponent } from "./main-admin.component";
import { AllOrdersComponent } from "./all-orders/all-orders.component";
import { AllProductsComponent } from "./all-products/all-products.component";
import { AllUsersComponent } from "./all-users/all-users.component";
import { AllOrderDetailComponent } from "./all-orders/all-order-detail/all-order-detail.component";
import { EditProductComponent } from "../admin/edit-product/edit-product.component";

const routes:Routes = [
  {path:'',component:MainAdminComponent, children: [
    {path: '',redirectTo: 'products',pathMatch:'full'},
    {path: 'products',component:AllProductsComponent},
    {path: ':id/edit',component:EditProductComponent},
    {path: 'orders',component:AllOrdersComponent},
    {path: 'add',component:EditProductComponent},
    {path: 'order-details/:id',component:AllOrderDetailComponent},
    {path: 'users',component:AllUsersComponent}
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MainAdminRoutingModule {

}
