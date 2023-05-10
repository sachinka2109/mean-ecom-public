
export interface Product {
  _id?: string;
  title:string;
  brand:string;
  imageUrl: string;
  description:string;
  reviews?:Array<string>;
  category:string;
  subCategory:string;
  quantity:number
  price:number;
  discount:number;
  rating?:number;
}
