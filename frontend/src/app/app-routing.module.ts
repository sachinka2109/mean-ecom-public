import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { Error404Component } from './components/error404/error404.component';

const routes: Routes = [
  {path:'',redirectTo:'home',pathMatch:'full'},
  {path: 'home', loadChildren: ()=> import('./components/home/home.module').then((mod)=> mod.HomeModule)},
  {path: 'shop',loadChildren: () => import('./components/shop/shop.module').then((mod)=> mod.ShopModule)},
  {path: 'cart',loadChildren: () => import('./components/cart/cart.module').then((mod)=> mod.CartModule)},
  {path: 'checkout',loadChildren: () => import('./components/checkout/checkout.module').then((mod)=> mod.CheckoutModule)},
  {path: 'auth',loadChildren: () => import('./components/auth/auth.module').then((mod)=> mod.AuthModule)},
  {path: 'profile',loadChildren: () => import('./components/user/user.module').then((mod)=> mod.UserModule)},
  {path: 'admin',loadChildren: () => import('./components/admin/admin.module').then((mod)=> mod.AdminModule)},
  {path: 'main-admin',loadChildren: () => import('./components/main-admin/main-admin.module').then((mod)=> mod.MainAdminModule)},
  {path: '**',component:Error404Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{preloadingStrategy:PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
