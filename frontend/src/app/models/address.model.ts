export class address {
  public add1:string;
  public add2:string;
  public country:string;
  public state:string;
  public city:string;
  public pin:number;
  constructor(add1:string,add2:string,country:string,state:string,city:string,pin:number){
    this.add1 = add1;
    this.add2 = add2;
    this.country = country;
    this.state = state;
    this.city = city;
    this.pin = pin;
  }
}
