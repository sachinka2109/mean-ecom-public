export class User {
  public _id: string;
  public name:string;
  public email:string;
  public phone: number;
  public password:string;
  public add1:string;
  public add2:string;
  public country:string;
  public state:string;
  public city:string;
  public pin:number;
  constructor(_id:string,name:string, email:string, phone:number,password:string,add1:string,add2:string,country:string,state:string,city:string,pin:number){
    this._id = _id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.password = password;
    this.add1 = add1;
    this.add2 = add2;
    this.country = country;
    this.state = state;
    this.city = city;
    this.pin = pin;
  }
}
