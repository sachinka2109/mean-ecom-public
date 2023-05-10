import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CategoryProductComponent } from "./category-product/category-product.component";
import { ProductDetailComponent } from "./product-detail/product-detail.component";
import { ProductsComponent } from "./products/products.component";
import { ShopNavbarComponent } from "./shop-navbar/shop-navbar.component";
import { ShopComponent } from "./shop.component";
import { ShopRoutingModule } from "./shop-routing.module";
import { SharedModule } from "../shared/shared.module";
import { SearchComponent } from './search/search.component';
import {Ng2SearchPipeModule } from 'ng2-search-filter';


@NgModule({
  declarations: [
    ShopComponent,
    ProductsComponent,
    ProductDetailComponent,
    ShopNavbarComponent,
    CategoryProductComponent,
    SearchComponent,
  ],
  imports: [
    RouterModule,
    SharedModule,
    ShopRoutingModule,
    Ng2SearchPipeModule,
  ],
})
export class ShopModule {}
