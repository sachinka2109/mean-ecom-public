import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CheckoutComponent } from "./checkout.component";
import { CheckoutSuccessComponent } from "./checkout-success/checkout-success.component";
import { CheckoutRoutingModule } from "./checkout-routing.module";
import { SharedModule } from "../shared/shared.module";


@NgModule({
  declarations: [
    CheckoutComponent,
    CheckoutSuccessComponent,
  ],
  imports: [
    RouterModule,
    SharedModule,
    CheckoutRoutingModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CheckoutModule {}
