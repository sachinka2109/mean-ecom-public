import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { HomeComponent } from "./home.component";
import { RouterModule } from "@angular/router";
import { HomeRoutingModule } from "./home-routing.module";

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    RouterModule,
    SharedModule,
    HomeRoutingModule,
  ],
})
export class HomeModule {}
