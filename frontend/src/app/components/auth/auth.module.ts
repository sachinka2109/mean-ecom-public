import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AuthComponent } from "./auth.component";
import { LoginComponent } from "./login/login.component";
import { AddressComponent } from "./register/address/address.component";
import { RegisterComponent } from "./register/register.component";
import { AuthRoutingModule } from "./auth-routing.module";
import { SharedModule } from "../shared/shared.module";
import { ResetpassComponent } from "./resetpass/resetpass.component";

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    ResetpassComponent,
    RegisterComponent,
    AddressComponent,
  ],
  imports: [
    RouterModule,
    SharedModule,
    AuthRoutingModule
  ]
})
export class AuthModule {

}
