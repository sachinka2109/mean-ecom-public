import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CategoryProductComponent } from "./category-product/category-product.component";
import { ProductsComponent } from "./products/products.component";
import { ShopComponent } from "./shop.component";
import { ProductDetailComponent } from "./product-detail/product-detail.component";
import { SearchComponent } from "./search/search.component";

const routes:Routes = [
  {path: '', component: ShopComponent,children: [
    {path: '', redirectTo:'products',pathMatch:'full'},
    {path: 'products', component: ProductsComponent},
    {path: 'categories/:id', component: CategoryProductComponent},
    {path: 'product-detail/:id',component: ProductDetailComponent},
  ]},
  {path: 'search',component:SearchComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ShopRoutingModule {

}
