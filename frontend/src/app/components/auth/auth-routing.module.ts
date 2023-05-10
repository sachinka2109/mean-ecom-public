import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthComponent } from "./auth.component";
import { LoginComponent } from "./login/login.component";
import { AddressComponent } from "./register/address/address.component";
import { RegisterComponent } from "./register/register.component";
import { AuthGuard } from "./auth.guard";
import { ResetpassComponent } from "./resetpass/resetpass.component";

const routes:Routes = [
  {path:'',component:AuthComponent, children: [
    {path: '',redirectTo: 'login',pathMatch:'full'},
    {path:'login',component:LoginComponent},
    {path:'register',component:RegisterComponent},
    {path:'address',canActivate:[AuthGuard] ,component:AddressComponent}
  ]},
  {path:'reset/:token', component:ResetpassComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AuthRoutingModule {

}
