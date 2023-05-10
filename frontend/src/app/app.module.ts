import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './components/home/header/header.component';
import { FooterComponent } from './components/home/footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { Error404Component } from './components/error404/error404.component';
import { HotToastModule } from '@ngneat/hot-toast';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core.module';
import { SharedModule } from './components/shared/shared.module';
import { MainHeaderComponent } from './components/main-admin/main-header/main-header.component';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    Error404Component,
    MainHeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HotToastModule.forRoot(),
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    MdbCarouselModule,
    NoopAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
