import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { RestApiService } from './rest-api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  categories = [];
  subscription:Subscription;
  constructor(private rest:RestApiService) { }

  getCategories() {
    return this.rest.get(environment.REST_API + 'shop/categories');
  }
}
