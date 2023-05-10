import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { Subject, tap} from 'rxjs';
import { RestApiService } from './rest-api.service';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  productsChanged = new Subject<void>();
  searchText;
  get refresh() {
    return this.productsChanged;
  }

  constructor(private rest:RestApiService) { }

  getAllProducts(productsPerPage?:number,page?:number) {
    return this.rest.get(environment.REST_API + `shop/products?pagesize=${productsPerPage}&page=${page}`);
  }

  getNewProducts(page:number){
    return this.rest.get(environment.REST_API + `shop/new-products?page=${page}`);
  }

  getFeaturedProducts(page:number){
    return this.rest.get(environment.REST_API + `shop/featured-products?page=${page}`);
  }

  getTodaysDeal(page:number){
    return this.rest.get(environment.REST_API + `shop/todays-deal?page=${page}`);
  }

  getCategoryProducts(id:string,productsPerPage:number,page:number) {
    return this.rest.get(environment.REST_API + `shop/categories/${id}?pagesize=${productsPerPage}&page=${page}`);
  }

  getDetails(id:string) {
    return this.rest.get(environment.REST_API + `shop/product-detail/${id}`)
  }

  getAdminProducts(productsPerPage:number,page:number){
    return this.rest.get( environment.REST_API + `admin/admin-products?pagesize=${productsPerPage}&page=${page}`)
  }

  getSingleProduct(id:string){
    return this.rest.get(environment.REST_API + `admin/${id}/edit`)
  }

  postRating(prodId:string,ratingForm:any,rating:number) {
    this.rest.post(environment.REST_API + 'shop/rate-product',{
      prodId:prodId,
      ratingForm:ratingForm,
      rating:rating
    })
    .pipe(tap(()=>{
      this.refresh.next();
    }))
    .subscribe()
  }

  addProduct(
    title:string,
    brand:string,
    imageUrl:File,
    description:string,
    quantity:string,
    category:string,
    subCategory:string,
    price:string,
    discount:string
    )
    {
    const formData = new FormData();
    formData.append("title",title);
    formData.append("imageUrl",imageUrl,title);
    formData.append("brand",brand);
    formData.append("quantity", quantity);
    formData.append("description",description);
    formData.append("category",category.toLowerCase())
    formData.append("subCategory",subCategory.toLowerCase())
    formData.append("price",price)
    formData.append("discount",discount);
    this.rest.post(environment.REST_API + 'admin/add-product',formData)
    .pipe(tap(()=>{
      this.refresh.next();
    }))
    .subscribe(response => {
      console.log(response);
    })
  }

  updateProduct(
    id:string,
    title:string,
    brand:string,
    imageUrl:File | string,
    description:string,
    quantity:string,
    category:string,
    subCategory:string,
    price:string,
    discount:string
    ){
      let formData: Product | FormData;
      if(typeof(imageUrl) === "object") {
        formData = new FormData();
        formData.append("title",title);
        formData.append("brand",brand);
        formData.append("imageUrl",imageUrl as File,title);
        formData.append("quantity", quantity);
        formData.append("description",description);
        formData.append("category",category)
        formData.append("subCategory",subCategory)
        formData.append("price",price)
        formData.append("discount",discount);
      } else {
          formData = {
            title:title,
            brand:brand,
            imageUrl:imageUrl as string,
            quantity:+quantity,
            description:description,
            category:category,
            subCategory:subCategory,
            price:+price,
            discount:+discount
          }
        }
    this.rest.post(environment.REST_API + `admin/${id}/edit`,formData)
    .pipe(tap(()=>{
      this.refresh.next();
    }))
    .subscribe()
  }

  deleteProduct(id:string) {
    this.rest.post(environment.REST_API + `admin/${id}`,{
      method: 'DELETE'
    })
    .pipe(tap(()=>{
      this.refresh.next();
    }))
    .subscribe()
  }
}
