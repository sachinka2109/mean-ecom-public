import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { mimeType } from './mime-type.validator';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit{
  id:string;
  addProductForm: FormGroup;
  editMode = false;
  imagePreview:string;
  subscription:Subscription;
  categoryOptions = [];
  subCategoryOptions = [];
  categorySelected:any;
  subCategorySelected:any;
  constructor(
    private productService: ProductService,
    private categoryService:CategoryService,
    private route:ActivatedRoute,
    private _location:Location
    ){

  }

  ngOnInit(): void {
    this.subscription = this.route.params.subscribe(
      (params:Params) => {
        this.id = params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
        this.getCategory();
        this.getSubCategories()
    });
  }

  getCategory() {
    this.categoryService.getCategories().subscribe(response => {
      this.categoryOptions = response['categories'].map(category =>{
        return category.name
      })
    })
  }

  getSubCategories() {
    this.categoryService.getCategories().subscribe(response => {
      let result = response['categories'].map(category =>{
        return category;
      })
      this.subCategoryOptions = result.reduce((acc, response) => {
        return acc.concat(response.subCategories.subCategory.map(item => item.name));
      }, []);
    })
  }

  onImagePicked(event:Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.addProductForm.patchValue({imageUrl: file});
    this.addProductForm.get('imageUrl').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    }
    reader.readAsDataURL(file);
  }

  onSubmit() {
    let title = this.addProductForm.value.title;
    let brand = this.addProductForm.value.brand;
    let imageUrl = this.addProductForm.value.imageUrl;
    let description = this.addProductForm.value.description;
    let quantity = this.addProductForm.value.quantity;
    let category = this.addProductForm.value.category;
    let subCategory = this.addProductForm.value.subCategory;
    let price = this.addProductForm.value.price;
    let discount = this.addProductForm.value.discount;
    if(this.addProductForm.value !== '' && this.addProductForm.value){
      if(this.editMode) {
        this.productService.updateProduct(
          this.id,title,brand,imageUrl,description,quantity,category,subCategory,price,discount)
      } else {
        this.productService.addProduct(
          title,brand,imageUrl,description,quantity,category,subCategory,price,discount)
      }
      this.onCancel();
    }
  }

  onCancel() {
    this._location.back();
  }

  private initForm() {
    let product;
    let productTitle = '';
    let productBrand = '';
    let productImageUrl = null;
    let productDescription = '';
    let productCategory = '';
    let productSubCategory = '';
    let productQuantity:number;
    let productPrice:number;
    let productDiscount:number;
    if(this.editMode) {
      this.productService.getSingleProduct(this.id).subscribe(response =>{
        product = response["product"];
        productTitle = product.title;
        productBrand = product.brand;
        productImageUrl = product.imageUrl;
        productDescription = product.description;
        productCategory = product.category;
        productSubCategory = product.subCategory;
        productQuantity = product.quantity;
        productPrice = product.price;
        productDiscount = product.discount;
        this.addProductForm = new FormGroup ({
          title: new FormControl(productTitle,Validators.required),
          // imageUrl: new FormArray([new FormGroup({imageUrl:new FormControl('',Validators.required)})],
          // ),
          brand: new FormControl(productBrand,Validators.required),
          imageUrl: new FormControl(productImageUrl,{validators: [Validators.required],asyncValidators:[mimeType]}),
          description: new FormControl(productDescription,Validators.required),
          category: new FormControl(productCategory,Validators.required),
          subCategory: new FormControl(productSubCategory,Validators.required),
          quantity: new FormControl(productQuantity,[Validators.required,Validators.min(0)]),
          price: new FormControl(productPrice,[Validators.required,Validators.min(100)]),
          discount: new FormControl(productDiscount),
        });
      })
    }
    this.addProductForm = new FormGroup ({
      title: new FormControl(productTitle,Validators.required),
      // imageUrl: new FormArray([new FormGroup({imageUrl:new FormControl('',Validators.required)})],
      // ),
      brand: new FormControl(productBrand,Validators.required),
      imageUrl: new FormControl(productImageUrl,{validators: [Validators.required],asyncValidators:[mimeType]}),
      description: new FormControl(productDescription,Validators.required),
      category: new FormControl(productCategory,Validators.required),
      subCategory: new FormControl(productSubCategory,Validators.required),
      quantity: new FormControl(productQuantity,[Validators.required,Validators.min(0)]),
      price: new FormControl(productPrice,[Validators.required,Validators.min(100)]),
      discount: new FormControl(productDiscount),
    });
  }

  ngOnDestroy(){
    this.subscription.unsubscribe()
  }
}
