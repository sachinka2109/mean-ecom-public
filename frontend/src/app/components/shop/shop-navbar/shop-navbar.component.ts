import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-shop-navbar',
  templateUrl: './shop-navbar.component.html',
  styleUrls: ['./shop-navbar.component.css']
})
export class ShopNavbarComponent implements OnInit{
  categories = [];
  subscription:Subscription
  constructor(private categoryService:CategoryService){}

  ngOnInit(): void {
    this.subscription = this.categoryService.getCategories().subscribe(response => {
      this.categories = response['categories'];
    })
  }

  OnDestroy(){
    this.subscription.unsubscribe()
  }

}
