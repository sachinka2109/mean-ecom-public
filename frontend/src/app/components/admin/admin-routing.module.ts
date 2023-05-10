import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AdminProductsComponent } from "./admin-products/admin-products.component";
import { AdminComponent } from "./admin.component";
import { EditProductComponent } from "./edit-product/edit-product.component";
import { AuthGuard } from "../auth/auth.guard";


const routes:Routes = [
  {path: '',component:AdminComponent,canActivate:[AuthGuard] ,children: [
    {path: '',redirectTo:'admin-products',pathMatch:'full'},
    {path: 'admin-products',component: AdminProductsComponent},
    {path: 'add-product',component: EditProductComponent},
    {path:':id',component:EditProductComponent,children:[
      {path: 'edit',component:EditProductComponent}
    ]},
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdminRoutingModule {

}
