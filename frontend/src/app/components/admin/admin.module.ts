import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AdminProductCardComponent } from "./admin-products/admin-product-card/admin-product-card.component";
import { AdminProductsComponent } from "./admin-products/admin-products.component";
import { AdminComponent } from "./admin.component";
import { EditProductComponent } from "./edit-product/edit-product.component";
import { AdminRoutingModule } from "./admin-routing.module";
import { SharedModule } from "../shared/shared.module";



@NgModule({
  declarations: [
    AdminComponent,
    AdminProductsComponent,
    EditProductComponent,
    AdminProductCardComponent,
  ],
  imports: [
    RouterModule,
    SharedModule,
    AdminRoutingModule
  ]
})
export class AdminModule {

}
