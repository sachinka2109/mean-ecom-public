import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CartRoutingModule } from "./cart-routing.module";
import { SharedModule } from "../shared/shared.module";
import { CartComponent } from "./cart.component";

@NgModule({
  declarations: [
    CartComponent
  ],
  imports: [
    RouterModule,
    SharedModule,
    CartRoutingModule
  ],
})
export class CartModule {}
