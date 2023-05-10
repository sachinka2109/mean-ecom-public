import { Component, Input } from '@angular/core';
import { Product } from '../../../../models/product.model';
import { Router } from '@angular/router';
import { ProductService } from '../../../../services/product.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-product-card',
  templateUrl: './admin-product-card.component.html',
  styleUrls: ['./admin-product-card.component.css']
})
export class AdminProductCardComponent {
  @Input() product:Product;
  @Input() id:string;
  subscription:Subscription
  constructor(private router:Router,private productService:ProductService){}

  onEdit(id:string){
    this.router.navigate(['/admin/' + id + '/edit']);
  }

  onDelete(id:string){
    this.productService.deleteProduct(id)
  }

}
